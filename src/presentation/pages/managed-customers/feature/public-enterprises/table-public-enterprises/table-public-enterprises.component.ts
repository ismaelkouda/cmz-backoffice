import { AsyncPipe, CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
} from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import {
    CUSTOMERS_MANAGED_STEP_ENUM,
    T_CUSTOMERS_MANAGED_STEP_ENUM,
} from '../../../data-access/managed-customers/enums/managed-customers-step.enum';
import { CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM } from '../../../data-access/managed-customers/interfaces/managed-customers-buttons-actions.enum';
import { PUBLIC_ENTERPRISES_TABLE } from '../../../data-access/public-enterprises/constants/public-enterprises-table.constant';
import { PublicEnterprisesFilterInterface } from '../../../data-access/public-enterprises/interfaces/public-enterprises-filter.interface';
import { PublicEnterprisesInterface } from '../../../data-access/public-enterprises/interfaces/public-enterprises.interface';
import { PublicEnterprisesApiService } from '../../../data-access/public-enterprises/services/public-enterprises-api.service';

type TYPE_COLOR_STEP_BADGE = 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-public-enterprises',
    standalone: true,
    templateUrl: './table-public-enterprises.component.html',
    styleUrls: ['./table-public-enterprises.component.scss'],
    imports: [
        CommonModule,
        TableModule,
        AsyncPipe,
        DialogModule,
        TranslateModule,
    ],
})
export class TablePublicEnterprisesComponent implements OnDestroy {
    @Output() interfaceUser = new EventEmitter<any>();

    @Input() spinner!: boolean;
    @Input() listPublicEnterprises$: Observable<PublicEnterprisesInterface[]> =
        new BehaviorSubject<PublicEnterprisesInterface[]>([]);
    @Input() pagination$!: Observable<Paginate<PublicEnterprisesInterface>>;

    @Input() listPublicEnterprisesStep!: T_CUSTOMERS_MANAGED_STEP_ENUM[];

    public publicEnterpriseSelected!: PublicEnterprisesInterface;
    public table: TableConfig = PUBLIC_ENTERPRISES_TABLE;
    private destroy$ = new Subject<void>();

    public visibleForm = false;

    public CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM =
        CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM;

    constructor(
        private toastService: ToastrService,
        private loadingBarService: LoadingBarService,
        private clipboardService: ClipboardService,
        private PublicEnterprisesApiService: PublicEnterprisesApiService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService
    ) {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public pageCallback() {
        return this.PublicEnterprisesApiService.fetchPublicEnterprises(
            {} as PublicEnterprisesFilterInterface
        );
    }

    public onExportExcel(): void {
        this.PublicEnterprisesApiService.getPublicEnterprises()
            .pipe(take(1))
            .subscribe((publicEnterprises) => {
                if (publicEnterprises) {
                    this.tableExportExcelFileService.exportAsExcelFile(
                        publicEnterprises,
                        this.table,
                        'list_public_enterprises'
                    );
                } else {
                    this.toastService.error(
                        this.translate.instant('NO_DATA_TO_EXPORT')
                    );
                }
            });
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    public getStepBadge(
        statut: T_CUSTOMERS_MANAGED_STEP_ENUM
    ): TYPE_COLOR_STEP_BADGE {
        switch (statut) {
            case CUSTOMERS_MANAGED_STEP_ENUM.ON:
                return 'badge-success';
            case CUSTOMERS_MANAGED_STEP_ENUM.OFF:
                return 'badge-danger';
            default:
                return 'badge-danger';
        }
    }

    public handleAction(params: any): void {
        this.onSelectPublicEnterprise(params.data);
        if (params.view === 'page') {
            this.interfaceUser.emit(params);
        }
    }

    private onSelectPublicEnterprise(
        publicEnterpriseSelected: PublicEnterprisesInterface
    ): void {
        this.publicEnterpriseSelected = publicEnterpriseSelected;
    }

    public handleActionButtonOpenStyle(publicEnterpriseSelected: {
        statut: string;
        traitement: string;
        code_client: string;
    }): { class: string; icon: string; tooltip: string } {
        const SIM_OF_THE_REQUEST = this.translate.instant('SIM_OF_THE_REQUEST');
        const CANNOT_SEE_THE_SIM = this.translate.instant('CANNOT_SEE_THE_SIM');
        switch (publicEnterpriseSelected?.statut) {
            case CUSTOMERS_MANAGED_STEP_ENUM.ON: {
                return {
                    class: 'p-button-dark',
                    icon: 'pi pi-folder-open',
                    tooltip: `${SIM_OF_THE_REQUEST} ${publicEnterpriseSelected.code_client}`,
                };
            }
            default: {
                return {
                    class: 'p-button-secondary',
                    icon: 'pi pi-folder-open',
                    tooltip: `${CANNOT_SEE_THE_SIM} ${publicEnterpriseSelected.code_client}`,
                };
            }
        }
    }
}

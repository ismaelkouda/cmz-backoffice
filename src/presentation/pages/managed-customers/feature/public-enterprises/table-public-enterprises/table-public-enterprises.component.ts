import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { PUBLIC_ENTERPRISES_TABLE } from '../../../data-access/public-enterprises/constants/public-enterprises-table.constant';
import { PublicEnterprisesFilterInterface } from '../../../data-access/public-enterprises/interfaces/public-enterprises-filter.interface';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { PublicEnterprisesInterface } from '../../../data-access/public-enterprises/interfaces/public-enterprises.interface';
import { PublicEnterprisesApiService } from '../../../data-access/public-enterprises/services/public-enterprises-api.service';
import {
    MANAGED_CUSTOMERS_STEP_ENUM,
    T_MANAGED_CUSTOMERS_STEP_ENUM,
} from '../../../data-access/managed-customers/enums/managed-customers-step.enum';
import { MANAGED_CUSTOMERS_BUTTONS_ACTIONS_ENUM } from '../../../data-access/managed-customers/interfaces/managed-customers-buttons-actions.enum';

type TYPE_COLOR_STEP_BADGE = 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-public-enterprises',
    templateUrl: './table-public-enterprises.component.html',
    styleUrls: ['./table-public-enterprises.component.scss'],
})
export class TablePublicEnterprisesComponent {
    @Output() interfaceUser = new EventEmitter<any>();

    @Input() spinner: boolean;
    @Input() listPublicEnterprises$: Observable<
        Array<PublicEnterprisesInterface>
    > = new BehaviorSubject<Array<PublicEnterprisesInterface>>([]);
    @Input() pagination$: Observable<Paginate<PublicEnterprisesInterface>>;

    @Input() listPublicEnterprisesStep: Array<T_MANAGED_CUSTOMERS_STEP_ENUM>;

    public publicEnterpriseSelected: PublicEnterprisesInterface;
    public table: TableConfig = PUBLIC_ENTERPRISES_TABLE;
    private destroy$ = new Subject<void>();

    public visibleForm: boolean = false;

    public MANAGED_CUSTOMERS_BUTTONS_ACTIONS_ENUM =
        MANAGED_CUSTOMERS_BUTTONS_ACTIONS_ENUM;

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
        statut: T_MANAGED_CUSTOMERS_STEP_ENUM
    ): TYPE_COLOR_STEP_BADGE {
        switch (statut) {
            case MANAGED_CUSTOMERS_STEP_ENUM.ON:
                return 'badge-success';
            case MANAGED_CUSTOMERS_STEP_ENUM.OFF:
                return 'badge-danger';
            default:
                return 'badge-danger';
        }
    }

    public handleAction(params): void {
        this.onSelectPublicEnterprise(params.data);
        switch (params.view) {
            case 'page':
                this.interfaceUser.emit(params);
                break;
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
            case MANAGED_CUSTOMERS_STEP_ENUM.ON: {
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

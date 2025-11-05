import { AsyncPipe, CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { COMMERCIAL_ENTERPRISE_TABLE } from '../../../data-access/commercial-enterprises/constants/commercial-enterprises-table.constant';
import { CommercialEnterprisesFilterInterface } from '../../../data-access/commercial-enterprises/interfaces/commercial-enterprises-filter.interface';
import { CommercialEnterprisesInterface } from '../../../data-access/commercial-enterprises/interfaces/commercial-enterprises.interface';
import { CommercialEnterprisesApiService } from '../../../data-access/commercial-enterprises/services/commercial-enterprises-api.service';
import {
    CUSTOMERS_MANAGED_STEP_ENUM,
    T_CUSTOMERS_MANAGED_STEP_ENUM,
} from '../../../data-access/managed-customers/enums/managed-customers-step.enum';
import { CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM } from '../../../data-access/managed-customers/interfaces/managed-customers-buttons-actions.enum';
import { ManagedCustomersPageActionsType } from '../../../data-access/managed-customers/types/managed-customers-page-actions.type';

type TYPE_COLOR_STEP_BADGE = 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-commercial-enterprises',
    standalone: true,
    templateUrl: './table-commercial-enterprises.component.html',
    styleUrls: ['./table-commercial-enterprises.component.scss'],
    imports: [CommonModule, TableModule, AsyncPipe, TranslateModule, DialogModule],
})
export class TableCommercialEnterprisesComponent implements OnDestroy {
    @Output() interfaceUser =
        new EventEmitter<ManagedCustomersPageActionsType>();

    @Input() spinner!: boolean;
    @Input() listCommercialEnterprises$: Observable<
        Array<CommercialEnterprisesInterface>
    > = new BehaviorSubject<Array<CommercialEnterprisesInterface>>([]);
    @Input() pagination$!: Observable<Paginate<CommercialEnterprisesInterface>>;

    public commercialEnterpriseSelected!: CommercialEnterprisesInterface;
    public table: TableConfig = COMMERCIAL_ENTERPRISE_TABLE;
    private destroy$ = new Subject<void>();

    public visibleForm: boolean = false;

    public CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM =
        CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM;

    constructor(
        private toastService: ToastrService,
        private clipboardService: ClipboardService,
        private CommercialEnterprisesApiService: CommercialEnterprisesApiService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService
    ) {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public pageCallback() {
        return this.CommercialEnterprisesApiService.fetchCommercialEnterprises(
            {} as CommercialEnterprisesFilterInterface
        );
    }

    public onExportExcel(): void {
        this.CommercialEnterprisesApiService.getCommercialEnterprises()
            .pipe(take(1))
            .subscribe((commercialEnterprises) => {
                if (commercialEnterprises) {
                    this.tableExportExcelFileService.exportAsExcelFile(
                        commercialEnterprises,
                        this.table,
                        'list_commercial_enterprises'
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

    public handleAction(params: ManagedCustomersPageActionsType): void {
        // this.onSelectCommercialEnterprise(params.data);
        switch (params.view) {
            case 'page':
                this.interfaceUser.emit(params);
                break;
        }
    }

    private onSelectCommercialEnterprise(
        commercialEnterpriseSelected: CommercialEnterprisesInterface
    ): void {
        this.commercialEnterpriseSelected = commercialEnterpriseSelected;
    }

    public handleActionButtonOpenStyle(commercialEnterpriseSelected: {
        statut: string;
        traitement: string;
        code_client: string;
    }): { class: string; icon: string; tooltip: string } {
        const SIM_OF_THE_REQUEST = this.translate.instant('SIM_OF_THE_REQUEST');
        const CANNOT_SEE_THE_SIM = this.translate.instant('CANNOT_SEE_THE_SIM');
        switch (commercialEnterpriseSelected?.statut) {
            case CUSTOMERS_MANAGED_STEP_ENUM.ON: {
                return {
                    class: 'p-button-dark',
                    icon: 'pi pi-folder-open',
                    tooltip: `${SIM_OF_THE_REQUEST} ${commercialEnterpriseSelected.code_client}`,
                };
            }
            default: {
                return {
                    class: 'p-button-secondary',
                    icon: 'pi pi-folder-open',
                    tooltip: `${CANNOT_SEE_THE_SIM} ${commercialEnterpriseSelected.code_client}`,
                };
            }
        }
    }
}

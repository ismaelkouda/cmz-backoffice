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
import { CUSTOMERS_TABLE } from '../../../data-access/customers/constants/customers-table.constant';
import { CustomersFilterInterface } from '../../../data-access/customers/interfaces/customers-filter.interface';
import { CustomersInterface } from '../../../data-access/customers/interfaces/customers.interface';
import { CustomersApiService } from '../../../data-access/customers/services/customers-api.service';
import {
    MANAGED_CUSTOMERS_STEP_ENUM,
    T_MANAGED_CUSTOMERS_STEP_ENUM,
} from '../../../data-access/managed-customers/enums/managed-customers-step.enum';
import { MANAGED_CUSTOMERS_BUTTONS_ACTIONS_ENUM } from '../../../data-access/managed-customers/interfaces/managed-customers-buttons-actions.enum';

type TYPE_COLOR_STEP_BADGE = 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-customers',
    templateUrl: './table-customers.component.html',
    styleUrls: ['./table-customers.component.scss'],
})
export class TableCustomersComponent {
    @Output() interfaceUser = new EventEmitter<any>();

    @Input() spinner: boolean;
    @Input() listCustomers$: Observable<Array<CustomersInterface>> =
        new BehaviorSubject<Array<CustomersInterface>>([]);
    @Input() pagination$: Observable<Paginate<CustomersInterface>>;

    @Input() listCustomersStep: Array<T_MANAGED_CUSTOMERS_STEP_ENUM>;

    public customerSelected: CustomersInterface;
    public table: TableConfig = CUSTOMERS_TABLE;
    private destroy$ = new Subject<void>();

    public visibleForm: boolean = false;

    public MANAGED_CUSTOMERS_BUTTONS_ACTIONS_ENUM =
        MANAGED_CUSTOMERS_BUTTONS_ACTIONS_ENUM;

    constructor(
        private toastService: ToastrService,
        private clipboardService: ClipboardService,
        private CustomersApiService: CustomersApiService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService
    ) {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public pageCallback() {
        return this.CustomersApiService.fetchCustomers(
            {} as CustomersFilterInterface
        );
    }

    public onExportExcel(): void {
        this.CustomersApiService.getCustomers()
            .pipe(take(1))
            .subscribe((customers) => {
                if (customers) {
                    this.tableExportExcelFileService.exportAsExcelFile(
                        customers,
                        this.table,
                        'list_customers'
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
        this.onSelectCustomer(params.data);
        switch (params.view) {
            case 'page':
                this.interfaceUser.emit(params);
                break;
        }
    }

    private onSelectCustomer(customerSelected: CustomersInterface): void {
        this.customerSelected = customerSelected;
    }

    public handleActionButtonOpenStyle(customerSelected: {
        statut: string;
        traitement: string;
        code_client: string;
    }): { class: string; icon: string; tooltip: string } {
        const SIM_OF_THE_REQUEST = this.translate.instant('SIM_OF_THE_REQUEST');
        const CANNOT_SEE_THE_SIM = this.translate.instant('CANNOT_SEE_THE_SIM');
        switch (customerSelected?.statut) {
            case MANAGED_CUSTOMERS_STEP_ENUM.ON: {
                return {
                    class: 'p-button-dark',
                    icon: 'pi pi-folder-open',
                    tooltip: `${SIM_OF_THE_REQUEST} ${customerSelected.code_client}`,
                };
            }
            default: {
                return {
                    class: 'p-button-secondary',
                    icon: 'pi pi-folder-open',
                    tooltip: `${CANNOT_SEE_THE_SIM} ${customerSelected.code_client}`,
                };
            }
        }
    }
}

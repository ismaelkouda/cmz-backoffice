import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { CUSTOMERS_TABLE } from '../../../data-access/customers/constants/customers-table.constant';
import { CustomersFilterInterface } from '../../../data-access/customers/interfaces/customers-filter.interface';
import { CustomersInterface } from '../../../data-access/customers/interfaces/customers.interface';
import { CustomersApiService } from '../../../data-access/customers/services/customers-api.service';
import {
    CUSTOMERS_MANAGED_STEP_ENUM,
    T_CUSTOMERS_MANAGED_STEP_ENUM,
} from '../../../data-access/managed-customers/enums/managed-customers-step.enum';
import { CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM } from '../../../data-access/managed-customers/interfaces/managed-customers-buttons-actions.enum';

type TYPE_COLOR_STEP_BADGE = 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-customers',
    standalone: true,
    templateUrl: './table-customers.component.html',
    styleUrls: ['./table-customers.component.scss'],
    imports: [TableModule, DialogModule, AsyncPipe, TranslateModule],
})
export class TableCustomersComponent {
    @Output() interfaceUser = new EventEmitter<any>();

    @Input() spinner!: boolean;
    @Input() listCustomers$: Observable<CustomersInterface[]> =
        new BehaviorSubject<CustomersInterface[]>([]);
    @Input() pagination$!: Observable<Paginate<CustomersInterface>>;

    @Input() listCustomersStep!: T_CUSTOMERS_MANAGED_STEP_ENUM[];

    public customerSelected!: CustomersInterface;
    public table: TableConfig = CUSTOMERS_TABLE;
    private destroy$ = new Subject<void>();

    public visibleForm = false;

    public CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM =
        CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM;

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
        this.onSelectCustomer(params.data);
        if (params.view === 'page') {
            this.interfaceUser.emit(params);
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

        if (customerSelected?.statut === CUSTOMERS_MANAGED_STEP_ENUM.ON) {
            return {
                class: 'p-button-dark',
                icon: 'pi pi-folder-open',
                tooltip: `${SIM_OF_THE_REQUEST} ${customerSelected.code_client}`,
            };
        } else {
            return {
                class: 'p-button-secondary',
                icon: 'pi pi-folder-open',
                tooltip: `${CANNOT_SEE_THE_SIM} ${customerSelected.code_client}`,
            };
        }
    }
}

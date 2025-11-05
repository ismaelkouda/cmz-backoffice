import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MODULE_TREATMENT_CUSTOMERS_ACTIVATE } from '../../../../../../shared/enum/module-treatment-customers-activate';
import { CustomersActivateInterface } from '../../../../../../shared/interfaces/customers-activate.interface';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { TableExportExcelFileService } from '../../../../../../shared/services/table-export-excel-file.service';
import { CUSTOMERS_ACTIVATE_TABLE } from '../../../data-access/customers-activate/constants/customers-activate-table.constant';
import { CUSTOMERS_ACTIVATE_STATE_ENUM } from '../../../data-access/customers-activate/enums/customers-activate-state.enum';
import { CUSTOMERS_ACTIVATE_STEP_ENUM } from '../../../data-access/customers-activate/enums/customers-activate-step.enum';
import { CustomersActivateFilterInterface } from '../../../data-access/customers-activate/interfaces/customers-activate-filter.interface';
import { CustomersActivatePageActionsType } from '../../../data-access/customers-activate/types/customers-activate-page-actions.type';
import { REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM } from '../../../data-access/requests-service/enums/requests-service-buttons-actions.enum';
import { REQUESTS_SERVICE_PAYMENT_STATE_ENUM } from '../../../data-access/requests-service/enums/requests-service-payment-state.enum';
import { REQUESTS_SERVICE_TREATMENT_ENUM } from '../../../data-access/requests-service/enums/requests-service-treatment.enum';

@Component({
    selector: 'app-table-customers-activate',
    standalone: true,
    templateUrl: './table-customers-activate.component.html',
    styleUrls: ['./table-customers-activate.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TableModule, DialogModule, TranslateModule],
})
export class TableCustomersActivateComponent implements OnInit, OnDestroy {
    @Output() interfaceUser =
        new EventEmitter<CustomersActivatePageActionsType>();
    @Input() spinner!: boolean;
    @Input() listCustomersActivate$!: Observable<
        Array<CustomersActivateInterface>
    >;
    @Input() pagination$!: Observable<Paginate<CustomersActivateInterface>>;

    public customerActivateSelected: CustomersActivateInterface = {} as any;
    public table = CUSTOMERS_ACTIVATE_TABLE;

    public visibleForm: boolean = false;
    public list: CustomersActivateInterface[] = [];
    public page: Paginate<CustomersActivateInterface> | null = null;

    public stepBadgeMap: Record<string, string> = {};
    public stateBadgeMap: Record<string, Record<string, string>> = {};
    public createMetaMap = {
        data: null,
        action: REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.ADD,
        view: 'page',
    };
    public editMetaMap: Record<
        string,
        { class: string; icon: string; tooltip: string; params: any }
    > = {};
    public paymentMetaMap: Record<
        string,
        {
            class: string;
            icon: string;
            tooltip: string;
            disabled?: boolean;
            params: any;
        }
    > = {};

    private destroy$ = new Subject<void>();

    constructor(
        private cdr: ChangeDetectorRef,
        private translate: TranslateService,
        private sharedService: SharedService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private toastService: ToastrService
    ) {
        this.initBadgeMaps();
    }

    ngOnInit() {
        this.listCustomersActivate$
            .pipe(takeUntil(this.destroy$))
            .subscribe((list) => {
                this.list = list ?? [];
                this.buildMetaMaps();
                this.cdr.markForCheck();
            });

        this.pagination$.pipe(takeUntil(this.destroy$)).subscribe((page) => {
            this.page = page;
            this.cdr.markForCheck();
        });
    }

    private initBadgeMaps() {
        this.stepBadgeMap = {
            [CUSTOMERS_ACTIVATE_STEP_ENUM.SUBMISSION]: 'badge-dark',
            [CUSTOMERS_ACTIVATE_STEP_ENUM.TREATMENT]: 'badge-warning',
            [CUSTOMERS_ACTIVATE_STEP_ENUM.FINALIZATION]: 'badge-info',
            [CUSTOMERS_ACTIVATE_STEP_ENUM.CLOSURE]: 'badge-success',
        };

        this.stateBadgeMap = {
            [CUSTOMERS_ACTIVATE_STEP_ENUM.SUBMISSION]: {
                [CUSTOMERS_ACTIVATE_STATE_ENUM.IN_WAITING]: 'badge-dark',
                [CUSTOMERS_ACTIVATE_STATE_ENUM.PARTIAL]: 'badge-warning',
                [CUSTOMERS_ACTIVATE_STATE_ENUM.RECEIVE]: 'badge-dark',
                [CUSTOMERS_ACTIVATE_STATE_ENUM.APPROVE]: 'badge-success',
                [CUSTOMERS_ACTIVATE_STATE_ENUM.REJECT]: 'badge-danger',
            },
            [CUSTOMERS_ACTIVATE_STEP_ENUM.CLOSURE]: {
                [CUSTOMERS_ACTIVATE_STATE_ENUM.LET_DOWN]: 'badge-warning',
                [CUSTOMERS_ACTIVATE_STATE_ENUM.REJECT]: 'badge-danger',
                [CUSTOMERS_ACTIVATE_STATE_ENUM.REFUSE]: 'badge-danger',
            },
        };
    }

    private buildMetaMaps() {
        this.editMetaMap = {};
        this.paymentMetaMap = {};

        for (const item of this.list || []) {
            const id = item.numero_demande;
            const editMeta = this.computeEditMeta(item);
            const paymentMeta = this.computePaymentMeta(item);

            this.editMetaMap[id] = {
                ...editMeta,
                params: {
                    data: item.numero_demande,
                    action: REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.EDIT,
                    view: 'modal',
                },
            };
            this.paymentMetaMap[id] = {
                ...paymentMeta,
                params: {
                    data: item.numero_demande,
                    action: paymentMeta.action,
                    view: 'page',
                },
            };
        }
    }

    private computeEditMeta(item: CustomersActivateInterface) {
        const STOP_OR_CHANGE = this.translate.instant('STOP_OR_CHANGE');
        const DETAILS_OF_THE_REQUEST = this.translate.instant(
            'DETAILS_OF_THE_REQUEST'
        );

        if (
            item?.statut === CUSTOMERS_ACTIVATE_STEP_ENUM.SUBMISSION &&
            (item.traitement === CUSTOMERS_ACTIVATE_STATE_ENUM.IN_WAITING ||
                item.traitement === CUSTOMERS_ACTIVATE_STATE_ENUM.REJECT)
        ) {
            return {
                class: 'p-button-warning',
                icon: 'pi pi-times',
                tooltip: `${STOP_OR_CHANGE} ${item.numero_demande}`,
                action: REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.EDIT,
                handleTreatment: {
                    module: MODULE_TREATMENT_CUSTOMERS_ACTIVATE.REQUESTS_SERVICE,
                    typeTreatment: REQUESTS_SERVICE_TREATMENT_ENUM.MODIFY,
                },
            };
        }

        return {
            class: 'p-button-secondary',
            icon: 'pi pi-eye',
            tooltip: `${DETAILS_OF_THE_REQUEST} ${item.numero_demande}`,
            action: REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.SEE,
            handleTreatment: {
                module: MODULE_TREATMENT_CUSTOMERS_ACTIVATE.REQUESTS_SERVICE,
                typeTreatment: REQUESTS_SERVICE_TREATMENT_ENUM.VIEW,
            },
        };
    }

    private computePaymentMeta(item: CustomersActivateInterface) {
        const SOLVE = this.translate.instant('SOLVE');
        const MAKE_A_PAYMENT = this.translate.instant('MAKE_A_PAYMENT');
        const MODIFY_THE_PAYMENT = this.translate.instant('MODIFY_THE_PAYMENT');
        const CANNOT_MAKE_A_PAYMENT = this.translate.instant(
            'CANNOT_MAKE_A_PAYMENT'
        );

        if (
            item?.statut === CUSTOMERS_ACTIVATE_STEP_ENUM.CLOSURE &&
            item.traitement === CUSTOMERS_ACTIVATE_STATE_ENUM.LET_DOWN
        ) {
            return {
                class: 'p-button-secondary',
                icon: 'pi pi-print',
                tooltip: `${CANNOT_MAKE_A_PAYMENT} ${item.numero_demande}`,
                action: REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.PAYMENT,
                disabled: true,
            };
        } else if (
            item?.traitement === REQUESTS_SERVICE_PAYMENT_STATE_ENUM.VALIDATED
        ) {
            return {
                class: 'p-button-success',
                icon: 'pi pi-print',
                tooltip: `${SOLVE}`,
                action: REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.INVOICE,
            };
        } else if (
            item?.traitement === REQUESTS_SERVICE_PAYMENT_STATE_ENUM.POSTED
        ) {
            return {
                class: 'p-button-warning',
                icon: 'pi pi-print',
                tooltip: `${MODIFY_THE_PAYMENT} ${item.numero_demande}`,
                action: REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.PAYMENT,
            };
        } else {
            return {
                class: 'p-button-danger',
                icon: 'pi pi-print',
                tooltip: `${MAKE_A_PAYMENT} ${item.numero_demande}`,
                action: REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.PAYMENT,
            };
        }
    }

    public onActionButtonClick(
        evt: Event,
        item: CustomersActivateInterface,
        params: CustomersActivatePageActionsType
    ) {
        if (evt) evt.stopPropagation();
        if (item) this.onRowSelect(item);
        this.handleAction(params);
    }

    public onRowSelect(item: CustomersActivateInterface) {
        this.customerActivateSelected = item;

        this.cdr.markForCheck();
    }

    public handleAction(params: CustomersActivatePageActionsType) {
        if (!params) return;
        switch (params.view) {
            case 'modal':
                if (
                    params.action === REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.EDIT
                ) {
                    this.visibleForm = true;
                } else if (
                    params.action ===
                    REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.NEWSPAPER
                ) {
                    // this.handleJournal(params.data.numero_demande);
                }
                break;
            case 'page':
                this.interfaceUser.emit(params);
                break;
        }
    }

    public computeIndex(rowIndex: number) {
        if (!this.page) return rowIndex + 1;
        return (this.page.current_page - 1) * this.page.per_page + rowIndex + 1;
    }

    public trackByRow(index: number, item: CustomersActivateInterface) {
        return item?.numero_demande;
    }

    public trackByCol(index: number, col: any) {
        return col?.field ?? index;
    }

    public pageCallback() {
        return this.sharedService.fetchCustomersActivate(
            {} as CustomersActivateFilterInterface
        );
    }

    public onExportExcel(): void {
        this.sharedService
            .getCustomersActivate()
            .pipe(take(1))
            .subscribe((customersActivate) => {
                if (customersActivate) {
                    this.tableExportExcelFileService.exportAsExcelFile(
                        customersActivate,
                        this.table,
                        'list_customers_Activate'
                    );
                } else {
                    this.toastService.error(
                        this.translate.instant('NO_DATA_TO_EXPORT')
                    );
                }
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

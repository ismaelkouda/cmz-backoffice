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
import {
    CUSTOMERS_ACTIVATE_STEP_ENUM,
    T_CUSTOMERS_ACTIVATE_STEP_ENUM,
} from '../../../data-access/customers-activate/enums/customers-activate-step.enum';
import {
    CUSTOMERS_ACTIVATE_STATE_ENUM,
    T_CUSTOMERS_ACTIVATE_STATE_ENUM,
} from '../../../data-access/customers-activate/enums/customers-activate-state.enum';
import { REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM } from '../../../data-access/requests-service/enums/requests-service-buttons-actions.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JournalComponent } from '../../../../../../shared/components/journal/journal.component';
import { ModalParams } from '../../../../../../shared/constants/modalParams.contant';
import { CUSTOMERS_ACTIVATE_TABLE } from '../../../data-access/customers-activate/constants/customers-activate-table.constant';
import { CustomersActivateFilterInterface } from '../../../data-access/customers-activate/interfaces/customers-activate-filter.interface';
import {
    REQUESTS_SERVICE_TREATMENT_ENUM,
    T_REQUESTS_SERVICE_TREATMENT_ENUM,
} from '../../../data-access/requests-service/enums/requests-service-treatment.enum';
import {
    MODULE_TREATMENT_CUSTOMERS_ACTIVATE,
    T_MODULE_TREATMENT_CUSTOMERS_ACTIVATE,
} from '../../../../../../shared/enum/module-treatment-customers-activate';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { CustomersActivateInterface } from '../../../../../../shared/interfaces/customers-activate.interface';
import { REQUESTS_SERVICE_PAYMENT_STATE_ENUM } from '../../../data-access/requests-service/enums/requests-service-payment-state.enum';
import { CustomersActivatePageActionsType } from '../../../data-access/customers-activate/types/customers-activate-page-actions.type';

type TYPE_COLOR_STEP_BADGE =
    | 'badge-dark'
    | 'badge-warning'
    | 'badge-info'
    | 'badge-success';
type TYPE_COLOR_STATE_BADGE =
    | 'badge-warning'
    | 'badge-dark'
    | 'badge-success'
    | 'badge-danger';

@Component({
    selector: 'app-table-customers-activate',
    templateUrl: './table-customers-activate.component.html',
    styleUrls: ['./table-customers-activate.component.scss'],
})
export class TableCustomersActivateComponent {
    @Output() interfaceUser =
        new EventEmitter<CustomersActivatePageActionsType>();

    @Input() spinner: boolean;
    @Input() listCustomersActivate$: Observable<
        Array<CustomersActivateInterface>
    > = new BehaviorSubject<Array<CustomersActivateInterface>>([]);
    @Input() pagination$: Observable<Paginate<CustomersActivateInterface>>;

    public customerActivateSelected: CustomersActivateInterface;
    public table: TableConfig = CUSTOMERS_ACTIVATE_TABLE;
    private destroy$ = new Subject<void>();

    public visibleForm: boolean = false;

    public REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM =
        REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM;
    public REQUESTS_SERVICE_PAYMENT_STATE_ENUM =
        REQUESTS_SERVICE_PAYMENT_STATE_ENUM;

    constructor(
        private toastService: ToastrService,
        private ngbModal: NgbModal,
        private clipboardService: ClipboardService,
        private sharedService: SharedService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService
    ) {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
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

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    getStepBadge(dossier?: {
        statut: T_CUSTOMERS_ACTIVATE_STEP_ENUM;
    }): TYPE_COLOR_STEP_BADGE {
        if (!dossier || !dossier.statut) {
            return 'badge-dark';
        }

        const etapeMap: Record<
            T_CUSTOMERS_ACTIVATE_STEP_ENUM,
            TYPE_COLOR_STEP_BADGE
        > = {
            [CUSTOMERS_ACTIVATE_STEP_ENUM.SUBMISSION]: 'badge-dark',
            [CUSTOMERS_ACTIVATE_STEP_ENUM.TREATMENT]: 'badge-warning',
            [CUSTOMERS_ACTIVATE_STEP_ENUM.FINALIZATION]: 'badge-info',
            [CUSTOMERS_ACTIVATE_STEP_ENUM.CLOSURE]: 'badge-success',
        };
        return etapeMap[dossier.statut] || 'badge-dark';
    }

    getStateBadge(dossier?: {
        statut?: T_CUSTOMERS_ACTIVATE_STEP_ENUM;
        traitement?: T_CUSTOMERS_ACTIVATE_STATE_ENUM;
    }): TYPE_COLOR_STATE_BADGE {
        if (!dossier || !dossier.statut || !dossier.traitement) {
            return 'badge-dark';
        }

        const stateMap: Partial<
            Record<
                T_CUSTOMERS_ACTIVATE_STEP_ENUM,
                Partial<
                    Record<
                        T_CUSTOMERS_ACTIVATE_STATE_ENUM,
                        TYPE_COLOR_STATE_BADGE
                    >
                >
            >
        > = {
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

        return stateMap[dossier.statut]?.[dossier.traitement] || 'badge-dark';
    }

    public handleAction(params: CustomersActivatePageActionsType | any): void {
        this.onSelectCustomerActivation(params.data);

        switch (params.view) {
            case 'modal':
                if (
                    params.action === REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.EDIT
                ) {
                    this.visibleForm = true;
                }
                if (
                    params.action ===
                    REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.NEWSPAPER
                ) {
                    this.handleJournal(params.data);
                }
                break;

            case 'page':
                this.interfaceUser.emit(params);
                break;
        }
    }

    private onSelectCustomerActivation(
        customerActivateSelected: CustomersActivateInterface
    ): void {
        this.customerActivateSelected = customerActivateSelected;
    }

    handleJournal(customerActivateSelected: { numero_demande: string }): void {
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.numero_demande =
            customerActivateSelected?.numero_demande;
        modalRef.componentInstance.typeJournal = 'demandes-services';
    }

    public handleActionButtonOpenStyle(customerActivateSelected: {
        statut: string;
        traitement: string;
        numero_demande: string;
    }): { class: string; icon: string; tooltip: string } {
        const SIM_OF_THE_REQUEST = this.translate.instant('SIM_OF_THE_REQUEST');
        const CANNOT_SEE_THE_SIM = this.translate.instant('CANNOT_SEE_THE_SIM');
        switch (customerActivateSelected?.statut) {
            case CUSTOMERS_ACTIVATE_STEP_ENUM.FINALIZATION: {
                return {
                    class: 'p-button-dark',
                    icon: 'pi pi-folder-open',
                    tooltip: `${SIM_OF_THE_REQUEST} ${customerActivateSelected.numero_demande}`,
                };
            }
            default: {
                return {
                    class: 'p-button-secondary',
                    icon: 'pi pi-folder-open',
                    tooltip: `${CANNOT_SEE_THE_SIM} ${customerActivateSelected.numero_demande}`,
                };
            }
        }
    }

    public handleActionButtonEditStyle(customerActivateSelected: {
        statut: string;
        traitement: string;
        numero_demande: string;
    }): {
        class: string;
        icon: string;
        tooltip: string;
        handleTreatment: {
            module: T_MODULE_TREATMENT_CUSTOMERS_ACTIVATE;
            typeTreatment: T_REQUESTS_SERVICE_TREATMENT_ENUM;
        };
    } {
        const STOP_OR_CHANGE = this.translate.instant('STOP_OR_CHANGE');
        const DETAILS_OF_THE_REQUEST = this.translate.instant(
            'DETAILS_OF_THE_REQUEST'
        );
        switch (customerActivateSelected?.statut) {
            case CUSTOMERS_ACTIVATE_STEP_ENUM.SUBMISSION: {
                if (
                    customerActivateSelected?.traitement ===
                    CUSTOMERS_ACTIVATE_STATE_ENUM.IN_WAITING
                ) {
                    return {
                        class: 'p-button-warning',
                        icon: 'pi pi-times',
                        tooltip: `${STOP_OR_CHANGE} ${customerActivateSelected?.numero_demande}`,
                        handleTreatment: {
                            module: MODULE_TREATMENT_CUSTOMERS_ACTIVATE.REQUESTS_SERVICE,
                            typeTreatment:
                                REQUESTS_SERVICE_TREATMENT_ENUM.MODIFY,
                        },
                    };
                }
                if (
                    customerActivateSelected?.traitement ===
                    CUSTOMERS_ACTIVATE_STATE_ENUM.REJECT
                ) {
                    return {
                        class: 'p-button-warning',
                        icon: 'pi pi-times',
                        tooltip: `${STOP_OR_CHANGE} ${customerActivateSelected?.numero_demande}`,
                        handleTreatment: {
                            module: MODULE_TREATMENT_CUSTOMERS_ACTIVATE.REQUESTS_SERVICE,
                            typeTreatment:
                                REQUESTS_SERVICE_TREATMENT_ENUM.MODIFY,
                        },
                    };
                }
            }
        }
        return {
            class: 'p-button-secondary',
            icon: 'pi pi-eye',
            tooltip: `${DETAILS_OF_THE_REQUEST} ${customerActivateSelected?.numero_demande}`,
            handleTreatment: {
                module: MODULE_TREATMENT_CUSTOMERS_ACTIVATE.REQUESTS_SERVICE,
                typeTreatment: REQUESTS_SERVICE_TREATMENT_ENUM.VIEW,
            },
        };
    }

    public handleActionButtonPaymentStyle(customerActivateSelected: {
        etat_paiement: string;
        statut: string;
        traitement: string;
        numero_demande: string;
    }): { class: string; icon: string; tooltip: string } {
        const SOLVE = this.translate.instant('SOLVE');
        const MAKE_A_PAYMENT = this.translate.instant('MAKE_A_PAYMENT');
        const MODIFY_THE_PAYMENT = this.translate.instant('MODIFY_THE_PAYMENT');
        const CANNOT_MAKE_A_PAYMENT = this.translate.instant(
            'CANNOT_MAKE_A_PAYMENT'
        );
        if (
            customerActivateSelected?.statut ===
                CUSTOMERS_ACTIVATE_STEP_ENUM.CLOSURE &&
            customerActivateSelected.traitement ===
                CUSTOMERS_ACTIVATE_STATE_ENUM.LET_DOWN
        ) {
            return {
                class: 'p-button-secondary',
                icon: 'pi pi-print',
                tooltip: `${CANNOT_MAKE_A_PAYMENT} ${customerActivateSelected?.numero_demande}`,
            };
        } else if (
            customerActivateSelected?.etat_paiement ===
            REQUESTS_SERVICE_PAYMENT_STATE_ENUM.VALIDATED
        ) {
            return {
                class: 'p-button-success',
                icon: 'pi pi-print',
                tooltip: `${SOLVE}`,
            };
        } else if (
            customerActivateSelected?.etat_paiement ===
            REQUESTS_SERVICE_PAYMENT_STATE_ENUM.POSTED
        ) {
            return {
                class: 'p-button-warning',
                icon: 'pi pi-print',
                tooltip: `${MODIFY_THE_PAYMENT} ${customerActivateSelected?.numero_demande}`,
            };
        } else {
            return {
                class: 'p-button-danger',
                icon: 'pi pi-print',
                tooltip: `${MAKE_A_PAYMENT} ${customerActivateSelected?.numero_demande}`,
            };
        }
    }
}

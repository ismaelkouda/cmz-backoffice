import { TREATMENT_MONITORING_TABLE } from './../../../data-access/treatment-monitoring/constants/treatment-monitoring-table.constant';
import { ModalParams } from './../../../../../../shared/constants/modalParams.contant';
import { JournalComponent } from './../../../../../../shared/components/journal/journal.component';
import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { TreatmentMonitoringApiService } from '../../../data-access/treatment-monitoring/services/treatment-monitoring-api.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { Observable, Subject, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TreatmentMonitoringFilterInterface } from '../../../data-access/treatment-monitoring/interfaces/treatment-monitoring-filter.interface';
import { TreatmentMonitoringInterface } from '../../../../../../shared/interfaces/treatment-monitoring.interface';
import {
    T_TREATMENT_MONITORING_STEP_ENUM,
    TREATMENT_MONITORING_STEP_ENUM,
} from '../../../data-access/treatment-monitoring/enums/treatment-monitoring-step.enum';
import {
    T_TREATMENT_MONITORING_STATE_ENUM,
    TREATMENT_MONITORING_STATE_ENUM,
} from '../../../data-access/treatment-monitoring/enums/treatment-monitoring-state.enum';
import { OVERSEEING_OPERATIONS_BUTTONS_ACTIONS_ENUM } from '../../../data-access/overseeing-operations/enums/overseeing-operations-buttons-actions.enum';
import {
    MODULE_TREATMENT_CUSTOMERS_ACTIVATE,
    T_MODULE_TREATMENT_CUSTOMERS_ACTIVATE,
} from '../../../../../../shared/enum/module-treatment-customers-activate';
import {
    OVERSEEING_OPERATIONS_TREATMENT_ENUM,
    T_OVERSEEING_OPERATIONS_TREATMENT_ENUM,
} from '../../../data-access/overseeing-operations/enums/overseeing-operations-treatment.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    selector: 'app-table-treatment-monitoring',
    templateUrl: './table-treatment-monitoring.component.html',
})
export class TableTreatmentMonitoringComponent {
    @Input() spinner: boolean;
    @Input() listTreatmentMonitoring$: Observable<
        Array<TreatmentMonitoringInterface>
    >;
    @Input() pagination$: Observable<Paginate<TreatmentMonitoringInterface>>;

    @Input()
    listTreatmentMonitoringStep: Array<T_TREATMENT_MONITORING_STEP_ENUM>;
    @Input()
    listTreatmentMonitoringState: Array<T_TREATMENT_MONITORING_STATE_ENUM>;

    public treatmentMonitoringSelected: TreatmentMonitoringInterface;
    public readonly table: TableConfig = TREATMENT_MONITORING_TABLE;
    private destroy$ = new Subject<void>();

    public visibleForm = false;

    public OVERSEEING_OPERATIONS_BUTTONS_ACTIONS_ENUM =
        OVERSEEING_OPERATIONS_BUTTONS_ACTIONS_ENUM;
    public TREATMENT_MONITORING_STATE_ENUM = TREATMENT_MONITORING_STATE_ENUM;

    constructor(
        private toastService: ToastrService,
        private clipboardService: ClipboardService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService,
        private ngbModal: NgbModal,
        private treatmentMonitoringApiService: TreatmentMonitoringApiService
    ) {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public pageCallback() {
        return this.treatmentMonitoringApiService.fetchTreatmentMonitoring(
            {} as TreatmentMonitoringFilterInterface
        );
    }

    public onExportExcel(): void {
        this.treatmentMonitoringApiService
            .getTreatmentMonitoring()
            .pipe(take(1))
            .subscribe((treatmentMonitoring) => {
                if (treatmentMonitoring) {
                    this.tableExportExcelFileService.exportAsExcelFile(
                        treatmentMonitoring,
                        this.table,
                        'list_treatment_monitoring'
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
        statut: T_TREATMENT_MONITORING_STEP_ENUM;
    }): TYPE_COLOR_STEP_BADGE {
        if (!dossier || !dossier.statut) {
            return 'badge-dark';
        }

        const etapeMap: Record<
            T_TREATMENT_MONITORING_STEP_ENUM,
            TYPE_COLOR_STEP_BADGE
        > = {
            [TREATMENT_MONITORING_STEP_ENUM.SUBMISSION]: 'badge-dark',
            [TREATMENT_MONITORING_STEP_ENUM.TREATMENT]: 'badge-warning',
            [TREATMENT_MONITORING_STEP_ENUM.FINALIZATION]: 'badge-info',
            [TREATMENT_MONITORING_STEP_ENUM.CLOSURE]: 'badge-success',
        };
        return etapeMap[dossier.statut] || 'badge-dark';
    }

    getStateBadge(dossier?: {
        statut?: T_TREATMENT_MONITORING_STEP_ENUM;
        traitement?: T_TREATMENT_MONITORING_STATE_ENUM;
    }): TYPE_COLOR_STATE_BADGE {
        if (!dossier || !dossier.statut || !dossier.traitement) {
            return 'badge-dark';
        }

        const stateMap: Partial<
            Record<
                T_TREATMENT_MONITORING_STEP_ENUM,
                Partial<
                    Record<
                        T_TREATMENT_MONITORING_STATE_ENUM,
                        TYPE_COLOR_STATE_BADGE
                    >
                >
            >
        > = {
            [TREATMENT_MONITORING_STEP_ENUM.SUBMISSION]: {
                [TREATMENT_MONITORING_STATE_ENUM.IN_WAITING]: 'badge-dark',
                [TREATMENT_MONITORING_STATE_ENUM.PARTIAL]: 'badge-warning',
                [TREATMENT_MONITORING_STATE_ENUM.RECEIVE]: 'badge-dark',
                [TREATMENT_MONITORING_STATE_ENUM.APPROVE]: 'badge-success',
                [TREATMENT_MONITORING_STATE_ENUM.REJECT]: 'badge-danger',
            },
            [TREATMENT_MONITORING_STEP_ENUM.CLOSURE]: {
                [TREATMENT_MONITORING_STATE_ENUM.LET_DOWN]: 'badge-warning',
                [TREATMENT_MONITORING_STATE_ENUM.REJECT]: 'badge-danger',
                [TREATMENT_MONITORING_STATE_ENUM.REFUSE]: 'badge-danger',
            },
        };

        return stateMap[dossier.statut]?.[dossier.traitement] || 'badge-dark';
    }

    public handleAction(params): void {
        this.onSelectTreatmentMonitoring(params.data);

        switch (params.view) {
            case 'modal':
                if (
                    params.action ===
                    OVERSEEING_OPERATIONS_BUTTONS_ACTIONS_ENUM.CLOSURE
                ) {
                    this.visibleForm = true;
                }
                if (
                    params.action ===
                    OVERSEEING_OPERATIONS_BUTTONS_ACTIONS_ENUM.SEE
                ) {
                    this.visibleForm = true;
                }
        }
    }

    private onSelectTreatmentMonitoring(
        selectedTreatmentMonitoring: TreatmentMonitoringInterface
    ): void {
        this.treatmentMonitoringSelected = selectedTreatmentMonitoring;
    }

    public handleActionButtonEditStyle(treatmentMonitoringSelected: {
        statut: string;
        traitement: string;
        numero_demande: string;
    }): {
        class: string;
        icon: string;
        tooltip: string;
        handleTreatment: {
            module: T_MODULE_TREATMENT_CUSTOMERS_ACTIVATE;
            typeTreatment: T_OVERSEEING_OPERATIONS_TREATMENT_ENUM;
        };
    } {
        const STOP_OR_CHANGE = this.translate.instant('STOP_OR_CHANGE');
        const TO_CLOSURE = this.translate.instant('TO_CLOSURE');
        const DETAILS_OF_THE_REQUEST = this.translate.instant(
            'DETAILS_OF_THE_REQUEST'
        );
        switch (treatmentMonitoringSelected?.statut) {
            case TREATMENT_MONITORING_STEP_ENUM.SUBMISSION: {
                if (
                    treatmentMonitoringSelected?.traitement ===
                    TREATMENT_MONITORING_STATE_ENUM.IN_WAITING
                ) {
                    return {
                        class: 'p-button-warning',
                        icon: 'pi pi-times',
                        tooltip: `${STOP_OR_CHANGE} ${treatmentMonitoringSelected?.numero_demande}`,
                        handleTreatment: {
                            module: MODULE_TREATMENT_CUSTOMERS_ACTIVATE.OVERSEEING_OPERATIONS,
                            typeTreatment:
                                OVERSEEING_OPERATIONS_TREATMENT_ENUM.VIEW,
                        },
                    };
                }
                if (
                    treatmentMonitoringSelected?.traitement ===
                    TREATMENT_MONITORING_STATE_ENUM.REJECT
                ) {
                    return {
                        class: 'p-button-warning',
                        icon: 'pi pi-times',
                        tooltip: `${STOP_OR_CHANGE} ${treatmentMonitoringSelected?.numero_demande}`,
                        handleTreatment: {
                            module: MODULE_TREATMENT_CUSTOMERS_ACTIVATE.REQUESTS_SERVICE,
                            typeTreatment:
                                OVERSEEING_OPERATIONS_TREATMENT_ENUM.MODIFY,
                        },
                    };
                }
            }
            case TREATMENT_MONITORING_STEP_ENUM.FINALIZATION: {
                if (
                    treatmentMonitoringSelected?.traitement ===
                    TREATMENT_MONITORING_STATE_ENUM.DO
                ) {
                    return {
                        class: 'p-button-success',
                        icon: 'pi pi-check-circle',
                        tooltip: `${TO_CLOSURE} ${treatmentMonitoringSelected?.numero_demande}`,
                        handleTreatment: {
                            module: MODULE_TREATMENT_CUSTOMERS_ACTIVATE.OVERSEEING_OPERATIONS,
                            typeTreatment:
                                OVERSEEING_OPERATIONS_TREATMENT_ENUM.CLOSURE,
                        },
                    };
                }
            }
        }
        return {
            class: 'p-button-secondary',
            icon: 'pi pi-eye',
            tooltip: `${DETAILS_OF_THE_REQUEST} ${treatmentMonitoringSelected?.numero_demande}`,
            handleTreatment: {
                module: MODULE_TREATMENT_CUSTOMERS_ACTIVATE.REQUESTS_SERVICE,
                typeTreatment: OVERSEEING_OPERATIONS_TREATMENT_ENUM.MODIFY,
            },
        };
    }

    public handleNewspaper(selectedTreatmentMonitoring: {
        numero_demande: string;
    }): void {
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.numero_demande =
            selectedTreatmentMonitoring?.numero_demande;
        modalRef.componentInstance.typeJournal = 'demandes-services';
    }
}

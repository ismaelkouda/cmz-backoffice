import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { Observable, Subject, take } from 'rxjs';
import {
    MODULE_TREATMENT_CUSTOMERS_ACTIVATE,
    T_MODULE_TREATMENT_CUSTOMERS_ACTIVATE,
} from '../../../../../../shared/enum/module-treatment-customers-activate';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { WaitingQueueInterface } from '../../../../../../shared/interfaces/waiting-queue.interface';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { OVERSEEING_OPERATIONS_BUTTONS_ACTIONS_ENUM } from '../../../data-access/overseeing-operations/enums/overseeing-operations-buttons-actions.enum';
import { WAITING_QUEUE_TABLE } from '../../../data-access/waiting-queue/constants/waiting-queue-table.constant';
import {
    T_WAITING_QUEUE_STATE_ENUM,
    WAITING_QUEUE_STATE_ENUM,
} from '../../../data-access/waiting-queue/enums/waiting-queue-state.enum';
import {
    T_WAITING_QUEUE_STEP_ENUM,
    WAITING_QUEUE_STEP_ENUM,
} from '../../../data-access/waiting-queue/enums/waiting-queue-step.enum';
import { WaitingQueueFilterInterface } from '../../../data-access/waiting-queue/interfaces/waiting-queue-filter.interface';
import {
    OVERSEEING_OPERATIONS_TREATMENT_ENUM,
    T_OVERSEEING_OPERATIONS_TREATMENT_ENUM,
} from './../../../data-access/overseeing-operations/enums/overseeing-operations-treatment.enum';
import { WaitingQueueApiService } from './../../../data-access/waiting-queue/services/waiting-queue-api.service';

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
    selector: 'app-table-waiting-queue',
    standalone: true,
    templateUrl: './table-waiting-queue.component.html',
    imports: [CommonModule, DialogModule, AsyncPipe, TableModule, TranslateModule],
})
export class TableWaitingQueueComponent {
    @Input() spinner!: boolean;
    @Input() listWaitingQueue$!: Observable<Array<WaitingQueueInterface>>;
    @Input() pagination$!: Observable<Paginate<WaitingQueueInterface>>;

    @Input() listWaitingQueueStep!: Array<T_WAITING_QUEUE_STEP_ENUM>;
    @Input() listWaitingQueueState!: Array<T_WAITING_QUEUE_STATE_ENUM>;

    public waitingQueueSelected!: WaitingQueueInterface;
    public readonly table: TableConfig = WAITING_QUEUE_TABLE;
    private destroy$ = new Subject<void>();

    public visibleForm = false;

    public OVERSEEING_OPERATIONS_BUTTONS_ACTIONS_ENUM =
        OVERSEEING_OPERATIONS_BUTTONS_ACTIONS_ENUM;

    constructor(
        private toastService: ToastrService,
        private clipboardService: ClipboardService,
        private waitingQueueApiService: WaitingQueueApiService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService
    ) {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public pageCallback() {
        return this.waitingQueueApiService.fetchWaitingQueue(
            {} as WaitingQueueFilterInterface
        );
    }

    public onExportExcel(): void {
        this.waitingQueueApiService
            .getWaitingQueue()
            .pipe(take(1))
            .subscribe((waitingQueue) => {
                if (waitingQueue) {
                    this.tableExportExcelFileService.exportAsExcelFile(
                        waitingQueue,
                        this.table,
                        'list_waiting_queue'
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
        statut: T_WAITING_QUEUE_STEP_ENUM;
    }): TYPE_COLOR_STEP_BADGE {
        if (!dossier || !dossier.statut) {
            return 'badge-dark';
        }

        const etapeMap: Record<
            T_WAITING_QUEUE_STEP_ENUM,
            TYPE_COLOR_STEP_BADGE
        > = {
            [WAITING_QUEUE_STEP_ENUM.SUBMISSION]: 'badge-dark',
            [WAITING_QUEUE_STEP_ENUM.TREATMENT]: 'badge-warning',
            [WAITING_QUEUE_STEP_ENUM.FINALIZATION]: 'badge-info',
            [WAITING_QUEUE_STEP_ENUM.CLOSURE]: 'badge-success',
        };
        return etapeMap[dossier.statut] || 'badge-dark';
    }

    getStateBadge(dossier?: {
        statut?: T_WAITING_QUEUE_STEP_ENUM;
        traitement?: T_WAITING_QUEUE_STATE_ENUM;
    }): TYPE_COLOR_STATE_BADGE {
        if (!dossier || !dossier.statut || !dossier.traitement) {
            return 'badge-dark';
        }

        const stateMap: Partial<
            Record<
                T_WAITING_QUEUE_STEP_ENUM,
                Partial<
                    Record<T_WAITING_QUEUE_STATE_ENUM, TYPE_COLOR_STATE_BADGE>
                >
            >
        > = {
            [WAITING_QUEUE_STEP_ENUM.SUBMISSION]: {
                [WAITING_QUEUE_STATE_ENUM.IN_WAITING]: 'badge-dark',
                [WAITING_QUEUE_STATE_ENUM.PARTIAL]: 'badge-warning',
                [WAITING_QUEUE_STATE_ENUM.RECEIVE]: 'badge-dark',
                [WAITING_QUEUE_STATE_ENUM.APPROVE]: 'badge-success',
                [WAITING_QUEUE_STATE_ENUM.REJECT]: 'badge-danger',
            },
            [WAITING_QUEUE_STEP_ENUM.CLOSURE]: {
                [WAITING_QUEUE_STATE_ENUM.LET_DOWN]: 'badge-warning',
                [WAITING_QUEUE_STATE_ENUM.REJECT]: 'badge-danger',
                [WAITING_QUEUE_STATE_ENUM.REFUSE]: 'badge-danger',
            },
        };

        return stateMap[dossier.statut]?.[dossier.traitement] || 'badge-dark';
    }

    public handleAction(params: any): void {
        this.onSelectWaitingQueue(params.data);

        if (
            params.view === 'modal' &&
            params.action === OVERSEEING_OPERATIONS_BUTTONS_ACTIONS_ENUM.EDIT
        ) {
            this.visibleForm = true;
        }
    }

    private onSelectWaitingQueue(
        selectedWaitingQueue: WaitingQueueInterface
    ): void {
        this.waitingQueueSelected = selectedWaitingQueue;
    }

    public handleActionButtonEditStyle(waitingQueueSelected: {
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
        const DETAILS_OF_THE_REQUEST = this.translate.instant(
            'DETAILS_OF_THE_REQUEST'
        );
        switch (waitingQueueSelected?.statut) {
            case WAITING_QUEUE_STEP_ENUM.SUBMISSION: {
                if (
                    waitingQueueSelected?.traitement ===
                    WAITING_QUEUE_STATE_ENUM.IN_WAITING
                ) {
                    return {
                        class: 'p-button-warning',
                        icon: 'pi pi-times',
                        tooltip: `${STOP_OR_CHANGE} ${waitingQueueSelected?.numero_demande}`,
                        handleTreatment: {
                            module: MODULE_TREATMENT_CUSTOMERS_ACTIVATE.OVERSEEING_OPERATIONS,
                            typeTreatment:
                                OVERSEEING_OPERATIONS_TREATMENT_ENUM.MODIFY,
                        },
                    };
                }
                if (
                    waitingQueueSelected?.traitement ===
                    WAITING_QUEUE_STATE_ENUM.REJECT
                ) {
                    return {
                        class: 'p-button-warning',
                        icon: 'pi pi-times',
                        tooltip: `${STOP_OR_CHANGE} ${waitingQueueSelected?.numero_demande}`,
                        handleTreatment: {
                            module: MODULE_TREATMENT_CUSTOMERS_ACTIVATE.REQUESTS_SERVICE,
                            typeTreatment:
                                OVERSEEING_OPERATIONS_TREATMENT_ENUM.MODIFY,
                        },
                    };
                }
            }
        }
        return {
            class: 'p-button-secondary',
            icon: 'pi pi-eye',
            tooltip: `${DETAILS_OF_THE_REQUEST} ${waitingQueueSelected?.numero_demande}`,
            handleTreatment: {
                module: MODULE_TREATMENT_CUSTOMERS_ACTIVATE.REQUESTS_SERVICE,
                typeTreatment: OVERSEEING_OPERATIONS_TREATMENT_ENUM.MODIFY,
            },
        };
    }
}

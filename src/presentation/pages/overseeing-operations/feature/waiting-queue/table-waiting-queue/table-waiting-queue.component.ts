import { WaitingQueueApiService } from './../../../data-access/waiting-queue/services/waiting-queue-api.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import {
    BADGE_ETAT,
    T_BADGE_ETAT,
} from '../../../../../../shared/constants/badge-etat.contant';
import {
    BADGE_ETAPE,
    T_BADGE_ETAPE,
} from '../../../../../../shared/constants/badge-etape.constant';
import { Folder } from '../../../../../../shared/interfaces/folder';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { Observable, take } from 'rxjs';
import { waitingQueueTableConstant } from '../../../data-access/waiting-queue/constants/waiting-queue-table.constant';
import { TranslateService } from '@ngx-translate/core';
import { waitingQueueFilterInterface } from '../../../data-access/waiting-queue/interfaces/waiting-queue-filter.interface';
import { createButtonStyle } from '../../../../../../shared/functions/treatment-demands.function';
import { TreatmentDemands } from '../../../../../../shared/interfaces/treatment-demands.interface';

type Action = ModalAction;
type ModalAction = {
    data: Folder;
    action: 'view-waiting-queue';
    view: 'modal';
};
const INIT_TYPE_TRAITEMENT: TreatmentDemands = {
    module: 'overseeing-operations',
    abandonner: false,
    modifier: false,
    visualiser: false,
    cloturer: false,
};
type TYPE_COLOR_ETAPE_BADGE =
    | 'badge-dark'
    | 'badge-warning'
    | 'badge-info'
    | 'badge-success';
type TYPE_COLOR_ETAT_BADGE =
    | 'badge-warning'
    | 'badge-dark'
    | 'badge-success'
    | 'badge-danger';

@Component({
    selector: 'app-table-waiting-queue',
    templateUrl: './table-waiting-queue.component.html',
})
export class TableWaitingQueueComponent {
    @Input() listWaitingQueue$: Observable<Array<Folder>>;
    @Input() waitingQueueSelected: Folder;
    @Input() pagination$: Observable<Paginate<Folder>>;
    @Output() interfaceUser = new EventEmitter<any>();
    public typeTreatment: TreatmentDemands = INIT_TYPE_TRAITEMENT;
    public visibleFormWaitingQueue = false;

    public readonly table: TableConfig = waitingQueueTableConstant;
    public readonly BADGE_STEP = BADGE_ETAPE;
    public readonly BADGE_STATE = BADGE_ETAT;

    constructor(
        private toastrService: ToastrService,
        private clipboardService: ClipboardService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService,
        private waitingQueueApiService: WaitingQueueApiService,
        private ngbModal: NgbModal
    ) {}

    public onExportExcel(): void {
        this.listWaitingQueue$.pipe(take(1)).subscribe((data) => {
            if (data) {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    'List_waitingQueue'
                );
            }
        });
    }

    public pageCallback() {
        this.waitingQueueApiService.fetchWaitingQueue(
            {} as waitingQueueFilterInterface
        );
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastrService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    public getStepWaitingQueueBadge(selectedWaitingQueue?: {
        statut: T_BADGE_ETAPE;
    }): TYPE_COLOR_ETAPE_BADGE {
        if (!selectedWaitingQueue || !selectedWaitingQueue.statut) {
            return 'badge-dark';
        }

        const etapeMap: Record<T_BADGE_ETAPE, TYPE_COLOR_ETAPE_BADGE> = {
            [BADGE_ETAPE.SOUMISSION]: 'badge-dark',
            [BADGE_ETAPE.TRAITEMENT]: 'badge-warning',
            [BADGE_ETAPE.FINALISATEUR]: 'badge-info',
            [BADGE_ETAPE.CLOTURE]: 'badge-success',
        };
        return etapeMap[selectedWaitingQueue.statut] || 'badge-dark';
    }

    public getStateWaitingQueueBadge(selectedWaitingQueue?: {
        statut?: T_BADGE_ETAPE;
        traitement?: T_BADGE_ETAT;
    }): TYPE_COLOR_ETAT_BADGE {
        if (
            !selectedWaitingQueue ||
            !selectedWaitingQueue.statut ||
            !selectedWaitingQueue.traitement
        ) {
            return 'badge-dark';
        }

        const stateMap: Partial<
            Record<
                T_BADGE_ETAPE,
                Partial<Record<T_BADGE_ETAT, TYPE_COLOR_ETAT_BADGE>>
            >
        > = {
            [BADGE_ETAPE.SOUMISSION]: {
                [BADGE_ETAT.EN_ATTENTE]: 'badge-dark',
                [BADGE_ETAT.PARTIEL]: 'badge-warning',
                [BADGE_ETAT.RECU]: 'badge-dark',
                [BADGE_ETAT.APPROUVE]: 'badge-success',
                [BADGE_ETAT.REJETE]: 'badge-danger',
            },
            [BADGE_ETAPE.CLOTURE]: {
                [BADGE_ETAT.ABANDONNE]: 'badge-warning',
            },
        };

        return (
            stateMap[selectedWaitingQueue.statut]?.[
                selectedWaitingQueue.traitement
            ] || 'badge-dark'
        );
    }

    public handleAction(params: Action): void {
        this.onSelectWaitingQueue(params.data);

        switch (params.view) {
            case 'modal':
                if (params.action === 'view-waiting-queue') {
                    this.handleWaitingQueueTreatment(params.data);
                }
                break;
        }
    }

    public handleWaitingQueueTreatment(selectedWaitingQueue: {
        statut: string;
        traitement: string;
    }): void {
        this.visibleFormWaitingQueue = true;
        this.typeTreatment =
            this.getTreatmentButtonViewStyle(
                selectedWaitingQueue
            )?.typeTreatment;
    }

    getTreatmentButtonViewStyle(dossier: {
        statut: string;
        traitement: string;
    }): {
        class: string;
        icon: string;
        tooltip: string;
        typeTreatment: TreatmentDemands;
    } {
        const STOP_OR_CHANGE = this.translate.instant('STOP_OR_CHANGE');
        const DETAILS_OF_THE_REQUEST = this.translate.instant(
            'DETAILS_OF_THE_REQUEST'
        );
        switch (dossier?.statut) {
            case BADGE_ETAPE.SOUMISSION: {
                if (dossier?.traitement === BADGE_ETAT.EN_ATTENTE) {
                    return createButtonStyle(
                        'p-button-warning',
                        'pi pi-times',
                        STOP_OR_CHANGE,
                        this.typeTreatment,
                        { abandonner: true, modifier: true, visualiser: false }
                    );
                }
                if (dossier?.traitement === BADGE_ETAT.REJETE) {
                    return createButtonStyle(
                        'p-button-warning',
                        'pi pi-times',
                        STOP_OR_CHANGE,
                        this.typeTreatment,
                        { abandonner: true, modifier: true, visualiser: false }
                    );
                }
            }
        }
        return createButtonStyle(
            'p-button-secondary',
            'pi pi-eye',
            DETAILS_OF_THE_REQUEST,
            this.typeTreatment,
            { abandonner: false, modifier: false, visualiser: true }
        );
    }

    private onSelectWaitingQueue(selectedWaitingQueue: Folder): void {
        this.waitingQueueSelected = selectedWaitingQueue;
        this.waitingQueueApiService.setWaitingQueueSelected(
            selectedWaitingQueue
        );
    }

    public hideDialog(): void {
        this.visibleFormWaitingQueue = false;
    }
}

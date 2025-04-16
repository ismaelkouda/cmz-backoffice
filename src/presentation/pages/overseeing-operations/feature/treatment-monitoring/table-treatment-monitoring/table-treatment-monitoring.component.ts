import { ModalParams } from './../../../../../../shared/constants/modalParams.contant';
import { JournalComponent } from './../../../../../../shared/components/journal/journal.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableConfig, TableExportExcelFileService } from '../../../../../../shared/services/table-export-excel-file.service';
import { BADGE_ETAT, T_BADGE_ETAT } from '../../../../../../shared/constants/badge-etat.contant';
import { BADGE_ETAPE, T_BADGE_ETAPE } from '../../../../../../shared/constants/badge-etape.constant';
import { treatmentMonitoringTableConstant } from '../../../data-access/treatment-monitoring/constants/treatment-monitoring-table.constant';
import { TreatmentMonitoringApiService } from '../../../data-access/treatment-monitoring/services/treatment-monitoring-api.service';
import { Folder } from '../../../../../../shared/interfaces/folder';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { treatmentMonitoringFilterInterface } from '../../../data-access/treatment-monitoring/interfaces/treatment-monitoring-filter.interface';
import { createButtonStyle } from '../../../../../../shared/functions/treatment-demands.function';
import { TreatmentDemands } from '../../../../../../shared/interfaces/treatment-demands.interface';

type Action = PageAction | ModalAction;
type PageAction = { data: Folder, action: 'open-folder-treatment-monitoring', view: 'page' };
type ModalAction = { data: Folder, action: 'view-treatment-monitoring' | 'journal-treatment-monitoring', view: 'modal' };
const INIT_TYPE_TRAITEMENT: TreatmentDemands = { module: "overseeing-operations", abandonner: false, modifier: false, visualiser: false, cloturer: false }
type TYPE_COLOR_ETAPE_BADGE = 'badge-dark' | 'badge-warning' | 'badge-info' | 'badge-success';
type TYPE_COLOR_ETAT_BADGE = 'badge-warning' | 'badge-dark' | 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-treatment-monitoring',
    templateUrl: './table-treatment-monitoring.component.html'
})

export class TableTreatmentMonitoringComponent {

    @Input() listTreatmentMonitoring$: Observable<Array<Folder>>;
    @Input() treatmentMonitoringSelected: Folder;
    @Input() pagination$: Observable<Paginate<Folder>>;
    @Output() interfaceUser = new EventEmitter<any>();
    public typeTreatment: TreatmentDemands = INIT_TYPE_TRAITEMENT;
    public visibleFormTreatmentMonitoring = false;

    public readonly table: TableConfig = treatmentMonitoringTableConstant;
    public readonly BADGE_STEP = BADGE_ETAPE;
    public readonly BADGE_STATE = BADGE_ETAT;

    constructor(private toastService: ToastrService, private clipboardService: ClipboardService, private ngbModal: NgbModal,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService,
        private treatmentMonitoringApiService: TreatmentMonitoringApiService) { }

    public onExportExcel(): void {
        this.listTreatmentMonitoring$.subscribe(data => {
            if (data) { this.tableExportExcelFileService.exportAsExcelFile(data, this.table, "List_treatment"); }
        });
    }

    public pageCallback() {
        this.treatmentMonitoringApiService.fetchTreatmentMonitoring({} as treatmentMonitoringFilterInterface);
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant('COPIED_TO_THE_CLIPBOARD');
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    getStepTreatmentMonitoringBadge(selectedTreatmentMonitoring?: { statut: T_BADGE_ETAPE; }): TYPE_COLOR_ETAPE_BADGE {
        if (!selectedTreatmentMonitoring || !selectedTreatmentMonitoring.statut) {
            return 'badge-dark';
        }

        const etapeMap: Record<T_BADGE_ETAPE, TYPE_COLOR_ETAPE_BADGE> = {
            [BADGE_ETAPE.SOUMISSION]: 'badge-dark',
            [BADGE_ETAPE.TRAITEMENT]: 'badge-warning',
            [BADGE_ETAPE.FINALISATEUR]: 'badge-info',
            [BADGE_ETAPE.CLOTURE]: 'badge-success',
        };
        return etapeMap[selectedTreatmentMonitoring.statut] || 'badge-dark';
    }


    getStateTreatmentMonitoringBadge(selectedTreatmentMonitoring?: { statut?: T_BADGE_ETAPE; traitement?: T_BADGE_ETAT }): TYPE_COLOR_ETAT_BADGE {
        if (!selectedTreatmentMonitoring || !selectedTreatmentMonitoring.statut || !selectedTreatmentMonitoring.traitement) {
            return 'badge-dark';
        }

        const stateMap: Partial<Record<T_BADGE_ETAPE, Partial<Record<T_BADGE_ETAT, TYPE_COLOR_ETAT_BADGE>>>> = {
            [BADGE_ETAPE.SOUMISSION]: {
                [BADGE_ETAT.EN_ATTENTE]: 'badge-dark',
                [BADGE_ETAT.PARTIEL]: 'badge-warning',
                [BADGE_ETAT.RECU]: 'badge-dark',
                [BADGE_ETAT.APPROUVE]: 'badge-success',
                [BADGE_ETAT.REJETE]: 'badge-danger',
            },
            [BADGE_ETAPE.CLOTURE]: {
                [BADGE_ETAT.ABANDONNE]: 'badge-warning'
            },
        };

        return stateMap[selectedTreatmentMonitoring.statut]?.[selectedTreatmentMonitoring.traitement] || 'badge-dark';
    }

    public handleAction(params: Action): void {
        this.onSelectTreatmentMonitoring(params.data);

        switch (params.view) {
            case 'modal':
                if (params.action === 'view-treatment-monitoring') { this.handleTreatmentMonitoringTreatment(params.data) }
                if (params.action === 'journal-treatment-monitoring') { this.handleJournal(params.data) };
                break;

            case 'page':
                if (params.action === 'open-folder-treatment-monitoring') { this.interfaceUser.emit(params) };
                break;
        }
    }

    handleTreatmentMonitoringTreatment(selectedTreatmentMonitoring: { statut: string, traitement: string }): void {
        this.visibleFormTreatmentMonitoring = true;
        this.typeTreatment = this.getTreatmentButtonViewTreatmentMonitoringStyle(selectedTreatmentMonitoring)?.typeTreatment;
    }
    handleJournal(selectedTreatmentMonitoring: { numero_demande: string }): void {
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.numero_demande = selectedTreatmentMonitoring?.numero_demande;
        modalRef.componentInstance.typeJournal = "demandes-services";
    }

    private onSelectTreatmentMonitoring(selectedTreatmentMonitoring: Folder): void {
        this.treatmentMonitoringSelected = selectedTreatmentMonitoring;
        this.treatmentMonitoringApiService.setTreatmentMonitoringSelected(selectedTreatmentMonitoring);
    }

    public hideDialog(): void {
        this.visibleFormTreatmentMonitoring = false;
    }

    getTreatmentButtonViewTreatmentMonitoringStyle(selectedTreatmentMonitoring: { statut: string, traitement: string }): { class: string, icon: string, tooltip: string, typeTreatment: TreatmentDemands } {
        const STOP_OR_CHANGE = this.translate.instant('STOP_OR_CHANGE');
        const DETAILS_OF_THE_REQUEST = this.translate.instant('DETAILS_OF_THE_REQUEST');
        const TO_CLOSURE = this.translate.instant('TO_CLOSURE');
        switch (selectedTreatmentMonitoring?.statut) {
            case BADGE_ETAPE.SOUMISSION: {
                if (selectedTreatmentMonitoring?.traitement === BADGE_ETAT.EN_ATTENTE) {
                    return createButtonStyle('p-button-warning', 'pi pi-times', STOP_OR_CHANGE, this.typeTreatment, { abandonner: true, modifier: true, visualiser: false });
                }
                if (selectedTreatmentMonitoring?.traitement === BADGE_ETAT.REJETE) {
                    return createButtonStyle('p-button-warning', 'pi pi-times', STOP_OR_CHANGE, this.typeTreatment, { abandonner: true, modifier: true, visualiser: false });
                }
            }
            case BADGE_ETAPE.FINALISATEUR: {
                if (selectedTreatmentMonitoring?.traitement === BADGE_ETAT.LIVRE) {
                    return createButtonStyle('p-button-success', 'pi pi-check-circle', TO_CLOSURE, this.typeTreatment, { abandonner: false, modifier: false, visualiser: false, cloturer: true });
                }
            }
            default: 
                return createButtonStyle('p-button-secondary', 'pi pi-eye', DETAILS_OF_THE_REQUEST, this.typeTreatment, { abandonner: false, modifier: false, visualiser: true });
        }
        
    }

    getTreatmentButtonOpenTreatmentMonitoringStyle(selectedTreatmentMonitoring: { statut: string, traitement: string, numero_demande: string }): { class: string, icon: string, tooltip: string } {
        const SIM_OF_THE_REQUEST = this.translate.instant('SIM_OF_THE_REQUEST');
        const CANNOT_SEE_THE_SIM = this.translate.instant('CANNOT_SEE_THE_SIM');
        switch (selectedTreatmentMonitoring?.statut) {
            case BADGE_ETAPE.TRAITEMENT: {
                if (selectedTreatmentMonitoring?.traitement === BADGE_ETAT.EN_COURS) {
                    return createButtonStyle('p-button-secondary', 'pi pi-folder-open', CANNOT_SEE_THE_SIM, this.typeTreatment);
                }
            }
            case BADGE_ETAPE.SOUMISSION: {
                if (selectedTreatmentMonitoring?.traitement === BADGE_ETAT.EN_ATTENTE) {
                    return createButtonStyle('p-button-secondary', 'pi pi-folder-open', CANNOT_SEE_THE_SIM, this.typeTreatment);
                }
            }
            case BADGE_ETAPE.CLOTURE: {
                if (selectedTreatmentMonitoring?.traitement === BADGE_ETAT.ABANDONNE) {
                    return createButtonStyle('p-button-secondary', 'pi pi-folder-open', CANNOT_SEE_THE_SIM, this.typeTreatment);
                }
            }
        }
        return createButtonStyle('p-button-dark', 'pi pi-folder-open', `${SIM_OF_THE_REQUEST} ${selectedTreatmentMonitoring.numero_demande}`, this.typeTreatment);
    }
}

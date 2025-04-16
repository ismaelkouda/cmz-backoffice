import { ModalParams } from './../../../../../../shared/constants/modalParams.contant';
import { JournalComponent } from './../../../../../../shared/components/journal/journal.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableConfig, TableExportExcelFileService } from '../../../../../../shared/services/table-export-excel-file.service';
import { BADGE_ETAT, T_BADGE_ETAT } from '../../../../../../shared/constants/badge-etat.contant';
import { BADGE_ETAPE, T_BADGE_ETAPE } from '../../../../../../shared/constants/badge-etape.constant';
import { TreatmentDemands } from '../../../../../../shared/interfaces/treatment-demands.interface';
import { whiteSimTableConstant } from '../../../data-access/white-sim/constants/white-sim-table.constant';
import { TranslateService } from '@ngx-translate/core';
import { createButtonStyle } from '../../../../../../shared/functions/treatment-demands.function';
import { CommandWhiteSimApiService } from '../../../data-access/white-sim/services/white-sim-api.service';
import { Observable } from 'rxjs';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { Folder } from '../../../../../../shared/interfaces/folder';
import { OperationTransaction } from '../../../../../../shared/enum/OperationTransaction.enum';
import { SharedService } from '../../../../../../shared/services/shared.service';

type Action = PageAction | ModalAction;
type PageAction = { data: Folder, action: 'open-folder-white-sim' | 'invoice-white-sim' | 'mass-edit-white-sim' | 'mass-add-white-sim' | 'simple-add-white-sim', view: 'page' };
type ModalAction = { data: Folder, action: 'view-white-sim' | 'journal-white-sim', view: 'modal' };
const INIT_TYPE_TREATMENT: TreatmentDemands = { module: "requests-products", abandonner: false, modifier: false, visualiser: false, cloturer: false }
type TYPE_COLOR_ETAPE_BADGE = 'badge-dark' | 'badge-warning' | 'badge-info' | 'badge-success';
type TYPE_COLOR_ETAT_BADGE = 'badge-warning' | 'badge-dark' | 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-white-sim',
    templateUrl: './table-white-sim.component.html'
})

export class TableWhiteSimComponent {

    @Input() spinner: boolean;
    @Input() listCommandWhiteSim$: Observable<Array<Folder>>;
    @Input() pagination$: Observable<Paginate<Folder>>;
    @Output() interfaceUser = new EventEmitter<any>();
    public commandWhiteSimSelected: Folder;
    public typeTreatment: TreatmentDemands = INIT_TYPE_TREATMENT;
    public visibleFormCommandWhiteSim = false;

    public readonly table: TableConfig = whiteSimTableConstant;
    public readonly BADGE_ETAPE = BADGE_ETAPE;
    public readonly BADGE_ETAT = BADGE_ETAT;

    constructor(private toastService: ToastrService, private clipboardService: ClipboardService, private ngbModal: NgbModal,
        private commandWhiteSimApiService: CommandWhiteSimApiService, private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService, private sharedService: SharedService) { }

    public pageCallback() {
        this.sharedService.fetchDemands({operation: OperationTransaction.SIM_BLANCHE} as Folder);
    }

    public onExportExcel(): void {
        this.listCommandWhiteSim$.subscribe(data => {
            if (data) { this.tableExportExcelFileService.exportAsExcelFile(data, this.table, "list_commands_white_sim"); }
        });
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant('COPIED_TO_THE_CLIPBOARD');
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    getStepCommandWhiteSimBadge(commandWhiteSim?: { statut: T_BADGE_ETAPE; }): TYPE_COLOR_ETAPE_BADGE {
        if (!commandWhiteSim || !commandWhiteSim.statut) {
            return 'badge-dark';
        }

        const etapeMap: Record<T_BADGE_ETAPE, TYPE_COLOR_ETAPE_BADGE> = {
            [BADGE_ETAPE.SOUMISSION]: 'badge-dark',
            [BADGE_ETAPE.TRAITEMENT]: 'badge-warning',
            [BADGE_ETAPE.FINALISATEUR]: 'badge-info',
            [BADGE_ETAPE.CLOTURE]: 'badge-success',
        };
        return etapeMap[commandWhiteSim.statut] || 'badge-dark';
    }


    getStateCommandWhiteSimBadge(commandWhiteSim?: { statut?: T_BADGE_ETAPE; traitement?: T_BADGE_ETAT }): TYPE_COLOR_ETAT_BADGE {
        if (!commandWhiteSim || !commandWhiteSim.statut || !commandWhiteSim.traitement) {
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

        return stateMap[commandWhiteSim.statut]?.[commandWhiteSim.traitement] || 'badge-dark';
    }

    public handleAction(params: Action): void {
        this.onSelectCommandWhiteSim(params.data);

        switch (params.view) {
            case 'modal':
                if (params.action === 'view-white-sim') { this.handleCommandWhiteSimTreatment(params.data) }
                if (params.action === 'journal-white-sim') { this.handleJournal(params.data) };
                break;

            case 'page':
                if (params.action === 'invoice-white-sim') { this.interfaceUser.emit(params) };
                if (params.action === 'open-folder-white-sim') { this.interfaceUser.emit(params) };
                if (params.action === 'mass-edit-white-sim') { this.interfaceUser.emit(params) };
                if (params.action === 'mass-add-white-sim') { this.interfaceUser.emit(params) };
                if (params.action === 'simple-add-white-sim') { this.interfaceUser.emit(params) };
                break;
        }
    }

    handleCommandWhiteSimTreatment(commandWhiteSim: { statut: string, traitement: string }): void {
        this.visibleFormCommandWhiteSim = true;
        this.typeTreatment = this.getTreatmentButtonViewCommandStyle(commandWhiteSim)?.typeTreatment;
    }

    handleJournal(commandWhiteSim: { numero_demande: string }): void {
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.numero_demande = commandWhiteSim?.numero_demande;
        modalRef.componentInstance.typeJournal = "demandes-services";
    }

    private onSelectCommandWhiteSim(commandWhiteSimSelected: Folder): void {
        this.commandWhiteSimSelected = commandWhiteSimSelected;
        this.sharedService.setDemandSelected(commandWhiteSimSelected);
    }

    hideDialog(): void {
        this.visibleFormCommandWhiteSim = false;
    }

    getTreatmentButtonViewCommandStyle(commandWhiteSim: { statut: string, traitement: string }): { class: string, icon: string, tooltip: string, typeTreatment: TreatmentDemands } {
        const STOP_OR_CHANGE = this.translate.instant('STOP_OR_CHANGE');
        const DETAILS_OF_THE_REQUEST = this.translate.instant('DETAILS_OF_THE_REQUEST');
        const TO_CLOSURE = this.translate.instant('TO_CLOSURE');
        switch (commandWhiteSim?.statut) {
            case BADGE_ETAPE.SOUMISSION: {
                if (commandWhiteSim?.traitement === BADGE_ETAT.EN_ATTENTE) {
                    return createButtonStyle('p-button-warning', 'pi pi-times', STOP_OR_CHANGE, this.typeTreatment, { abandonner: true, modifier: true, visualiser: false });
                }
                if (commandWhiteSim?.traitement === BADGE_ETAT.REJETE) {
                    return createButtonStyle('p-button-warning', 'pi pi-times', STOP_OR_CHANGE, this.typeTreatment, { abandonner: true, modifier: true, visualiser: false });
                }
            }
            case BADGE_ETAPE.FINALISATEUR: {
                if (commandWhiteSim?.traitement === BADGE_ETAT.LIVRE) {
                    return createButtonStyle('p-button-success', 'pi pi-check-circle', TO_CLOSURE, this.typeTreatment, { abandonner: false, modifier: false, visualiser: false, cloturer: true });
                }
            }
        }
        return createButtonStyle('p-button-secondary', 'pi pi-eye', DETAILS_OF_THE_REQUEST, this.typeTreatment, { abandonner: false, modifier: false, visualiser: true });
    }

    getTreatmentButtonOpenCommandStyle(commandWhiteSim: { statut: string, traitement: string }): { class: string, icon: string, tooltip: string } {
        const SIM_OF_THE_REQUEST = this.translate.instant('SIM_OF_THE_REQUEST');
        const CANNOT_SEE_THE_SIM = this.translate.instant('CANNOT_SEE_THE_SIM');
        switch (commandWhiteSim?.statut) {
            case BADGE_ETAPE.TRAITEMENT: {
                if (commandWhiteSim?.traitement === BADGE_ETAT.EN_COURS) {
                    return createButtonStyle('p-button-secondary', 'pi pi-folder-open', CANNOT_SEE_THE_SIM, this.typeTreatment);
                }
            }
            case BADGE_ETAPE.SOUMISSION: {
                if (commandWhiteSim?.traitement === BADGE_ETAT.EN_ATTENTE) {
                    return createButtonStyle('p-button-secondary', 'pi pi-folder-open', CANNOT_SEE_THE_SIM, this.typeTreatment);
                }
                if (commandWhiteSim?.traitement === BADGE_ETAT.REJETE) {
                    return createButtonStyle('p-button-secondary', 'pi pi-folder-open', CANNOT_SEE_THE_SIM, this.typeTreatment);
                }
            }
            case BADGE_ETAPE.CLOTURE: {
              if (commandWhiteSim?.traitement === BADGE_ETAT.ABANDONNE) {
                return createButtonStyle('p-button-secondary', 'pi pi-folder-open', CANNOT_SEE_THE_SIM, this.typeTreatment);
              }
            }
        }
        return createButtonStyle('p-button-dark', 'pi pi-folder-open', SIM_OF_THE_REQUEST, this.typeTreatment);
    }


    getTreatmentButtonPaiementCommandStyle(commandWhiteSim: { type_paiement: string, statut: string, traitement: string }): { class: string, icon: string, tooltip: string } {
        const SOLVE = this.translate.instant('SOLVE');
        const MAKE_A_PAYMENT = this.translate.instant('MAKE_A_PAYMENT');
        const CANNOT_MAKE_A_PAYMENT = this.translate.instant('CANNOT_MAKE_A_PAYMENT');
        if(commandWhiteSim?.statut === BADGE_ETAPE.CLOTURE && commandWhiteSim.traitement === BADGE_ETAT.ABANDONNE) {
            return createButtonStyle('p-button-secondary', 'pi pi-print', CANNOT_MAKE_A_PAYMENT, this.typeTreatment);
          } else if (!!commandWhiteSim?.type_paiement) {
            return createButtonStyle('p-button-success', 'pi pi-print', SOLVE, this.typeTreatment);
        } else {
            return createButtonStyle('p-button-danger', 'pi pi-print', MAKE_A_PAYMENT, this.typeTreatment);
        }
    }
}

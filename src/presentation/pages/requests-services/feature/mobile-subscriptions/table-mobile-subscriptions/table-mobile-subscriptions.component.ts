import { mobileSubscriptionsTableConstant } from './../../../data-access/mobile-subscriptions/constantes/mobile-subscriptions-table';
import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    BADGE_ETAPE,
    T_BADGE_ETAPE,
} from '../../../../../../shared/constants/badge-etape.constant';
import {
    BADGE_ETAT,
    T_BADGE_ETAT,
} from '../../../../../../shared/constants/badge-etat.contant';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ModalParams } from '../../../../../../shared/constants/modalParams.contant';
import { JournalComponent } from '../../../../../../shared/components/journal/journal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Folder } from '../../../../../../shared/interfaces/folder';
import { createButtonStyle } from '../../../../../../shared/functions/treatment-demands.function';
import { TreatmentDemands } from '../../../../../../shared/interfaces/treatment-demands.interface';
import { Observable } from 'rxjs';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { OperationTransaction } from '../../../../../../shared/enum/OperationTransaction.enum';

type Action = PageAction | ModalAction;
type PageAction = {
    data: Folder;
    action:
        | 'open-folder-mobile-subscription'
        | 'mass-edit-mobile-subscription'
        | 'mass-add-mobile-subscription'
        | 'simple-add-mobile-subscription'
        | 'view-payment'
        | 'view-invoice';
    view: 'page';
};
type ModalAction = {
    data: Folder;
    action: 'view-mobile-subscription' | 'journal-mobile-subscription';
    view: 'modal';
};
const INIT_TYPE_TRAITEMENT: TreatmentDemands = {
    module: 'requests-services',
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
    selector: 'app-table-mobile-subscriptions',
    templateUrl: './table-mobile-subscriptions.component.html',
})
export class TableMobileSubscriptionsComponent {
    @Input() spinner: boolean;
    @Input() listDemands$: Observable<Array<Folder>>;
    @Input() pagination$: Observable<Paginate<Folder>>;
    @Output() interfaceUser = new EventEmitter<any>();
    public demandSelected: Folder;
    public typeTreatment: TreatmentDemands = INIT_TYPE_TRAITEMENT;
    public visibleFormDossier = false;

    public readonly table: TableConfig = mobileSubscriptionsTableConstant;
    public readonly BADGE_ETAPE = BADGE_ETAPE;
    public readonly BADGE_ETAT = BADGE_ETAT;

    constructor(
        private toastrService: ToastrService,
        private clipboardService: ClipboardService,
        private ngbModal: NgbModal,
        private sharedService: SharedService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService
    ) {}

    public pageCallback() {
        this.sharedService.fetchDemands({
            operation: OperationTransaction.ACTIVATION,
        } as Folder);
    }

    public onExportExcel(): void {
        this.listDemands$.subscribe((data) => {
            if (data) {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    'List_demands'
                );
            }
        });
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastrService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    getStepBadge(dossier?: { statut: T_BADGE_ETAPE }): TYPE_COLOR_ETAPE_BADGE {
        if (!dossier || !dossier.statut) {
            return 'badge-dark';
        }

        const etapeMap: Record<T_BADGE_ETAPE, TYPE_COLOR_ETAPE_BADGE> = {
            [BADGE_ETAPE.SOUMISSION]: 'badge-dark',
            [BADGE_ETAPE.TRAITEMENT]: 'badge-warning',
            [BADGE_ETAPE.FINALISATEUR]: 'badge-info',
            [BADGE_ETAPE.CLOTURE]: 'badge-success',
        };
        return etapeMap[dossier.statut] || 'badge-dark';
    }

    getStateBadge(dossier?: {
        statut?: T_BADGE_ETAPE;
        traitement?: T_BADGE_ETAT;
    }): TYPE_COLOR_ETAT_BADGE {
        if (!dossier || !dossier.statut || !dossier.traitement) {
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
                [BADGE_ETAT.REJETE]: 'badge-danger',
                [BADGE_ETAT.REFUSE]: 'badge-danger',
            },
        };

        return stateMap[dossier.statut]?.[dossier.traitement] || 'badge-dark';
    }

    public handleAction(params: Action): void {
        this.onSelectDemand(params.data);

        switch (params.view) {
            case 'modal':
                if (params.action === 'view-mobile-subscription') {
                    this.handleDossierTreatment(params.data);
                }
                if (params.action === 'journal-mobile-subscription') {
                    this.handleJournal(params.data);
                }
                break;

            case 'page':
                this.interfaceUser.emit(params);
                // if (params.action === 'open-folder-mobile-subscription') {
                //     this.interfaceUser.emit(params);
                // }
                // if (params.action === 'mass-edit-mobile-subscription') {
                //     this.interfaceUser.emit(params);
                // }
                // if (params.action === 'mass-add-mobile-subscription') {
                //     this.interfaceUser.emit(params);
                // }
                // if (params.action === 'simple-add-mobile-subscription') {
                //     this.interfaceUser.emit(params);
                // }
                break;
        }
    }

    handleDossierTreatment(dossier: {
        statut: string;
        traitement: string;
        numero_demande: string;
    }): void {
        this.visibleFormDossier = true;
        this.typeTreatment =
            this.getTreatmentButtonViewStyle(dossier)?.typeTreatment;
    }
    handleJournal(dossier: { numero_demande: string }): void {
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.numero_demande = dossier?.numero_demande;
        modalRef.componentInstance.typeJournal = 'demandes-services';
    }

    private onSelectDemand(selectedDemand: Folder): void {
        this.demandSelected = selectedDemand;
        this.sharedService.setDemandSelected(selectedDemand);
    }

    hideDialog(): void {
        this.visibleFormDossier = false;
    }

    getTreatmentButtonViewStyle(dossier: {
        statut: string;
        traitement: string;
        numero_demande: string;
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
        const TO_CLOSURE = this.translate.instant('TO_CLOSURE');
        switch (dossier?.statut) {
            case BADGE_ETAPE.SOUMISSION: {
                if (dossier?.traitement === BADGE_ETAT.EN_ATTENTE) {
                    return createButtonStyle(
                        'p-button-warning',
                        'pi pi-times',
                        `${STOP_OR_CHANGE} ${dossier?.numero_demande}`,
                        this.typeTreatment,
                        { abandonner: true, modifier: true, visualiser: false }
                    );
                }
                if (dossier?.traitement === BADGE_ETAT.REJETE) {
                    return createButtonStyle(
                        'p-button-warning',
                        'pi pi-times',
                        `${STOP_OR_CHANGE} ${dossier?.numero_demande}`,
                        this.typeTreatment,
                        { abandonner: true, modifier: true, visualiser: false }
                    );
                }
            }
            case BADGE_ETAPE.FINALISATEUR: {
                if (dossier?.traitement === BADGE_ETAT.LIVRE) {
                    return createButtonStyle(
                        'p-button-success',
                        'pi pi-check-circle',
                        `${TO_CLOSURE} ${dossier?.numero_demande}`,
                        this.typeTreatment,
                        {
                            abandonner: false,
                            modifier: false,
                            visualiser: false,
                            cloturer: true,
                        }
                    );
                }
            }
        }
        return createButtonStyle(
            'p-button-secondary',
            'pi pi-eye',
            `${DETAILS_OF_THE_REQUEST} ${dossier?.numero_demande}`,
            this.typeTreatment,
            { abandonner: false, modifier: false, visualiser: true }
        );
    }

    getTreatmentButtonOpenFolderStyle(dossier: {
        statut: string;
        traitement: string;
        numero_demande: string;
    }): { class: string; icon: string; tooltip: string } {
        const SIM_OF_THE_REQUEST = this.translate.instant('SIM_OF_THE_REQUEST');
        const CANNOT_SEE_THE_SIM = this.translate.instant('CANNOT_SEE_THE_SIM');
        switch (dossier?.statut) {
            case BADGE_ETAPE.FINALISATEUR: {
                if (dossier?.traitement === BADGE_ETAT.LIVRE) {
                    return createButtonStyle(
                        'p-button-dark',
                        'pi pi-folder-open',
                        `${SIM_OF_THE_REQUEST} ${dossier.numero_demande}`,
                        this.typeTreatment
                    );
                }
            }
            default: {
                return createButtonStyle(
                    'p-button-secondary',
                    'pi pi-folder-open',
                    `${CANNOT_SEE_THE_SIM} ${dossier.numero_demande}`,
                    this.typeTreatment
                );
            }
        }
    }

    getTreatmentButtonPaymentStyle(dossier: {
        type_paiement: string;
        statut: string;
        traitement: string;
        numero_demande: string;
    }): { class: string; icon: string; tooltip: string } {
        const SOLVE = this.translate.instant('SOLVE');
        const MAKE_A_PAYMENT = this.translate.instant('MAKE_A_PAYMENT');
        const CANNOT_MAKE_A_PAYMENT = this.translate.instant(
            'CANNOT_MAKE_A_PAYMENT'
        );
        if (
            dossier?.statut === BADGE_ETAPE.CLOTURE &&
            dossier.traitement === BADGE_ETAT.ABANDONNE
        ) {
            return createButtonStyle(
                'p-button-secondary',
                'pi pi-print',
                `${CANNOT_MAKE_A_PAYMENT} ${dossier?.numero_demande}`,
                this.typeTreatment
            );
        } else if (!!dossier?.type_paiement) {
            return createButtonStyle(
                'p-button-success',
                'pi pi-print',
                `${SOLVE}`,
                this.typeTreatment
            );
        } else {
            return createButtonStyle(
                'p-button-danger',
                'pi pi-print',
                `${MAKE_A_PAYMENT} ${dossier?.numero_demande}`,
                this.typeTreatment
            );
        }
    }
}

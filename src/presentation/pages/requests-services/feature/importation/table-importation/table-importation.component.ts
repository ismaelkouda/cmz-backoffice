import { importationTableConstant } from '../../../data-access/importation/constantes/importation-table';
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
import {
    combineLatest,
    filter,
    Observable,
    Subject,
    take,
    takeUntil,
} from 'rxjs';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { OperationTransaction } from '../../../../../../shared/enum/OperationTransaction.enum';
import { PAYMENT_STATUS_ENUM } from '../../../../accounting/data-access/payment/enums/payment-status.enum';
import {
    IMPORTATION_STEP,
    T_IMPORTATION_STEP,
} from '../../../data-access/importation/enums/importation-step.constant';
import { CurrentUser } from '../../../../../../shared/interfaces/current-user.interface';
import { StoreCurrentUserService } from '../../../../../../shared/services/store-current-user.service';
import { ImportationService } from '../../../data-access/importation/service/importation-api.service';
import { DetailsImportationTableConstant } from '../details-importation/data-access/constantes/details-importation-table';
import { OnDestroy } from '@angular/core';
import { ta } from 'date-fns/locale';

type Action = PageAction | ModalAction;
type PageAction = {
    data: Folder;
    action:
        | 'open-folder-importation'
        | 'mass-edit-importation'
        | 'mass-add-importation'
        | 'simple-add-importation'
        | 'payment-importation'
        | 'invoice-importation';
    view: 'page';
};
type ModalAction = {
    data: Folder;
    action: 'view-importation' | 'journal-importation' | 'download-importation';
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
    | 'badge-success'
    | 'badge-danger';
type TYPE_COLOR_ETAT_BADGE =
    | 'badge-warning'
    | 'badge-dark'
    | 'badge-success'
    | 'badge-danger';

@Component({
    selector: 'app-table-importation',
    templateUrl: './table-importation.component.html',
})
export class TableImportationComponent implements OnDestroy {
    @Input() spinner: boolean;
    @Input() listDemands$: Observable<Array<Folder>>;
    @Input() pagination$: Observable<Paginate<Folder>>;
    @Output() interfaceUser = new EventEmitter<any>();
    public demandSelected: Folder;
    public typeTreatment: TreatmentDemands = INIT_TYPE_TRAITEMENT;
    public visibleFormDossier = false;
    private destroy$ = new Subject<void>();

    public readonly table: TableConfig = importationTableConstant;
    private readonly excelHeaderSimTable: TableConfig =
        DetailsImportationTableConstant;
    public readonly BADGE_ETAPE = BADGE_ETAPE;
    public readonly BADGE_ETAT = BADGE_ETAT;
    public readonly PAYMENT_STATUS_ENUM = PAYMENT_STATUS_ENUM;

    constructor(
        private toastrService: ToastrService,
        private clipboardService: ClipboardService,
        private ngbModal: NgbModal,
        private sharedService: SharedService,
        private translate: TranslateService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private storeCurrentUserService: StoreCurrentUserService,
        private importationService: ImportationService
    ) {}

    public pageCallback() {
        this.sharedService.fetchDemandsImported();
    }

    public onExportExcel(): void {
        this.listDemands$.subscribe((data) => {
            if (data) {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    'List_demands_import'
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

    // getStepBadge(dossier?: { statut: T_BADGE_ETAPE }): TYPE_COLOR_ETAPE_BADGE {
    //     if (!dossier || !dossier.statut) {
    //         return 'badge-dark';
    //     }

    //     const etapeMap: Record<T_BADGE_ETAPE, TYPE_COLOR_ETAPE_BADGE> = {
    //         [BADGE_ETAPE.SOUMISSION]: 'badge-dark',
    //         [BADGE_ETAPE.TRAITEMENT]: 'badge-warning',
    //         [BADGE_ETAPE.FINALISATEUR]: 'badge-info',
    //         [BADGE_ETAPE.CLOTURE]: 'badge-success',
    //     };
    //     return etapeMap[dossier.statut] || 'badge-dark';
    // }

    getStepBadge(dossier?: {
        statut: T_IMPORTATION_STEP;
    }): TYPE_COLOR_ETAPE_BADGE {
        if (!dossier || !dossier.statut) {
            return 'badge-dark';
        }

        const etapeMap: Record<T_IMPORTATION_STEP, TYPE_COLOR_ETAPE_BADGE> = {
            [IMPORTATION_STEP.IN_WAITING]: 'badge-dark',
            [IMPORTATION_STEP.PARTIAL]: 'badge-warning',
            [IMPORTATION_STEP.COMPLETE]: 'badge-success',
            [IMPORTATION_STEP.FAILURE]: 'badge-danger',
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
                if (params.action === 'view-importation') {
                    this.handleDossierTreatment(params.data);
                }
                if (params.action === 'journal-importation') {
                    this.handleJournal(params.data);
                }
                if (params.action === 'download-importation') {
                    this.handleDownload(params.data);
                }
                break;

            case 'page':
                this.interfaceUser.emit(params);
                // if (params.action === 'open-folder-importation') {
                //     this.interfaceUser.emit(params);
                // }
                // if (params.action === 'mass-edit-importation') {
                //     this.interfaceUser.emit(params);
                // }
                // if (params.action === 'mass-add-importation') {
                //     this.interfaceUser.emit(params);
                // }
                // if (params.action === 'simple-add-importation') {
                //     this.interfaceUser.emit(params);
                // }
                break;
        }
    }

    getTruncatedValue(value: string, maxLength: number = 15): string {
        if (!value) return '';
        return value.length > maxLength
            ? value.slice(0, maxLength) + '...'
            : value;
    }

    getTooltipValue(value: string, maxLength: number = 15): string {
        if (!value) return '';
        return value.length > maxLength ? value : '';
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
        modalRef.componentInstance.typeJournal = 'importation-sim';
    }

    handleDownload(dossier: {
        numero_demande: string;
        sims_file: string;
    }): void {
        this.importationService.fetchSimDemand({
            numero_demande: dossier.numero_demande,
        });
        combineLatest([
            this.importationService.isLoadingSimDemand(),
            this.importationService.getSimDemand(),
        ])
            .pipe(
                takeUntil(this.destroy$),
                filter(([isLoading, data]) => !isLoading && data.length > 0),
                take(1)
            )
            .subscribe(([_, data]) => {
                console.log('data', data);
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.excelHeaderSimTable,
                    `list_sim_demand_${dossier.numero_demande}.xlsx`
                );
            });
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
        // switch (dossier?.statut) {
        //     case BADGE_ETAPE.SOUMISSION: {
        //         if (dossier?.traitement === BADGE_ETAT.EN_ATTENTE) {
        //             return createButtonStyle(
        //                 'p-button-warning',
        //                 'pi pi-times',
        //                 `${STOP_OR_CHANGE} ${dossier?.numero_demande}`,
        //                 this.typeTreatment,
        //                 {
        //                     abandonner: true,
        //                     modifier: true,
        //                     visualiser: false,
        //                     cloturer: false,
        //                 }
        //             );
        //         }
        //         if (dossier?.traitement === BADGE_ETAT.REJETE) {
        //             return createButtonStyle(
        //                 'p-button-warning',
        //                 'pi pi-times',
        //                 `${STOP_OR_CHANGE} ${dossier?.numero_demande}`,
        //                 this.typeTreatment,
        //                 {
        //                     abandonner: true,
        //                     modifier: true,
        //                     visualiser: false,
        //                     cloturer: false,
        //                 }
        //             );
        //         }
        //     }
        //     case BADGE_ETAPE.FINALISATEUR: {
        //         if (dossier?.traitement === BADGE_ETAT.LIVRE) {
        //             return createButtonStyle(
        //                 'p-button-success',
        //                 'pi pi-check-circle',
        //                 `${TO_CLOSURE} ${dossier?.numero_demande}`,
        //                 this.typeTreatment,
        //                 {
        //                     abandonner: false,
        //                     modifier: false,
        //                     visualiser: false,
        //                     cloturer: true,
        //                 }
        //             );
        //         }
        //     }
        // }
        return createButtonStyle(
            'p-button-secondary',
            'pi pi-eye',
            `${DETAILS_OF_THE_REQUEST} ${dossier?.numero_demande}`,
            this.typeTreatment,
            {
                abandonner: false,
                modifier: false,
                visualiser: true,
                cloturer: false,
            }
        );
    }

    getTreatmentButtonOpenFolderStyle(dossier: {
        statut: string;
        numero_demande: string;
    }): { class: string; icon: string; tooltip: string } {
        const SIM_OF_THE_REQUEST = this.translate.instant('SIM_OF_THE_REQUEST');
        return createButtonStyle(
            'p-button-dark',
            'pi pi-folder-open',
            `${SIM_OF_THE_REQUEST} ${dossier.numero_demande}`,
            this.typeTreatment
        );
    }

    getTreatmentButtonPaymentStyle(dossier: {
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
            dossier?.statut === BADGE_ETAPE.CLOTURE &&
            dossier.traitement === BADGE_ETAT.ABANDONNE
        ) {
            return createButtonStyle(
                'p-button-secondary',
                'pi pi-print',
                `${CANNOT_MAKE_A_PAYMENT} ${dossier?.numero_demande}`,
                this.typeTreatment
            );
        } else if (dossier?.etat_paiement === PAYMENT_STATUS_ENUM.VALIDATED) {
            return createButtonStyle(
                'p-button-success',
                'pi pi-print',
                `${SOLVE}`,
                this.typeTreatment
            );
        } else if (dossier?.etat_paiement === PAYMENT_STATUS_ENUM.POSTED) {
            return createButtonStyle(
                'p-button-warning',
                'pi pi-print',
                `${MODIFY_THE_PAYMENT} ${dossier?.numero_demande}`,
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { Observable, take } from 'rxjs';
import {
    BADGE_ETAPE,
    T_BADGE_ETAPE,
} from '../../../../../../shared/constants/badge-etape.constant';
import {
    BADGE_ETAT,
    T_BADGE_ETAT,
} from '../../../../../../shared/constants/badge-etat.contant';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { BADGE_STATE_CLAIMS } from '../../../data-access/claims/constants/claims-state.constant';
import { BADGE_STEP_CLAIMS } from '../../../data-access/claims/constants/claims-step.constant';
import { claimsTableConstant } from '../../../data-access/claims/constants/claims-table.constant';
import { claimsFilterInterface } from '../../../data-access/claims/interfaces/claims-filter.interface';
import { claimsInterface } from '../../../data-access/claims/interfaces/claims.interface';
import { ClaimsApiService } from '../../../data-access/claims/services/claims-api.service';
import { JournalComponent } from './../../../../../../shared/components/journal/journal.component';
import { ModalParams } from './../../../../../../shared/constants/modalParams.contant';
import { T_CLAIMS_STATUS_ENUM } from './../../../data-access/claims/enums/claims-status.enum';

type Action = PageAction | ModalAction;
type PageAction = {
    data: claimsInterface;
    action: 'open-folder-claims' | 'invoice-claims' | 'add-claims';
    view: 'page';
};
type ModalAction = {
    data: claimsInterface;
    action: 'view-claims' | 'journal-claims';
    view: 'modal';
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
    selector: 'app-table-claims',
    standalone: true,
    templateUrl: './table-claims.component.html',
    imports: [CommonModule, TableModule, AsyncPipe, DialogModule, TranslateModule],
})
export class TableClaimsComponent {
    @Input() spinner!: boolean;
    @Input() listClaims$!: Observable<Array<claimsInterface>>;
    @Input() claimsSelected!: claimsInterface;
    @Input() pagination$!: Observable<Paginate<claimsInterface>>;
    @Output() interfaceUser = new EventEmitter<any>();
    public typeTreatment: any;
    public visibleFormClaims = false;

    public readonly table: TableConfig = claimsTableConstant;

    constructor(
        private toastService: ToastrService,
        private clipboardService: ClipboardService,
        private ngbModal: NgbModal,
        private tableExportExcelFileService: TableExportExcelFileService,
        private claimsApiService: ClaimsApiService,
        private translate: TranslateService
    ) {}

    public onExportExcel(): void {
        this.listClaims$.pipe(take(1)).subscribe((data) => {
            if (data) {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    'List_claims'
                );
            }
        });
    }

    public pageCallback() {
        this.claimsApiService.fetchClaims({} as claimsFilterInterface);
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }
    getStepClaimsBadge(selectedClaim?: {
        statut: T_CLAIMS_STATUS_ENUM;
    }): TYPE_COLOR_ETAPE_BADGE {
        if (!selectedClaim || !selectedClaim.statut) {
            return 'badge-dark';
        }
        const etapeMap: Record<T_BADGE_ETAPE, TYPE_COLOR_ETAPE_BADGE> = {
            [BADGE_ETAPE.SOUMISSION]: 'badge-dark',
            [BADGE_ETAPE.TRAITEMENT]: 'badge-warning',
            [BADGE_ETAPE.FINALISATEUR]: 'badge-info',
            [BADGE_ETAPE.CLOTURE]: 'badge-success',
        };
        return etapeMap[selectedClaim.statut as T_BADGE_ETAPE] || 'badge-dark';
    }

    public getStateClaimsBadge(selectedClaims?: {
        statut?: T_BADGE_ETAPE;
        traitement?: T_BADGE_ETAT;
    }): TYPE_COLOR_ETAT_BADGE {
        if (
            !selectedClaims ||
            !selectedClaims.statut ||
            !selectedClaims.traitement
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
            stateMap[selectedClaims.statut]?.[selectedClaims.traitement] ||
            'badge-dark'
        );
    }

    public truncateString(str: string, num: number = 20): string {
        if (str.length > num) {
            return str.slice(0, num) + '...';
        } else {
            return str;
        }
    }

    public handleAction(params: Action): void {
        this.onSelectClaims(params.data);

        switch (params.view) {
            case 'modal':
                if (params.action === 'view-claims') {
                    this.handleClaimsTreatment(params.data);
                }
                if (params.action === 'journal-claims') {
                    this.handleJournal(params.data);
                }
                break;

            case 'page':
                this.interfaceUser.emit(params);
                break;
        }
    }

    handleClaimsTreatment(selectedClaims: {
        statut: string;
        traitement: string;
    }): void {
        this.visibleFormClaims = true;
        this.typeTreatment =
            this.getTreatmentButtonViewClaimsStyle(
                selectedClaims
            )?.typeTreatment;
    }

    handleJournal(selectedClaims: { numero_demande: string }): void {
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.numero_demande =
            selectedClaims?.numero_demande;
        modalRef.componentInstance.typeJournal = 'contentieux';
    }

    private onSelectClaims(selectedClaims: claimsInterface): void {
        this.claimsSelected = selectedClaims;
        this.claimsApiService.setClaimsSelected(selectedClaims);
    }

    hideDialog(): void {
        this.visibleFormClaims = false;
    }

    getTreatmentButtonViewClaimsStyle(selectedClaims: {
        statut: string;
        traitement: string;
    }): any {
        const STOP_OR_CHANGE = this.translate.instant('STOP_OR_CHANGE');
        const DETAILS_OF_THE_CLAIM = this.translate.instant(
            'DETAILS_OF_THE_CLAIM'
        );
        const TO_CLOSURE = this.translate.instant('TO_CLOSURE');
        switch (selectedClaims?.statut) {
            case BADGE_STEP_CLAIMS.SOUMISSION: {
                if (
                    selectedClaims?.traitement === BADGE_STATE_CLAIMS.IN_WAITING
                ) {
                    // return createButtonStyle(
                    //     'p-button-warning',
                    //     'pi pi-times',
                    //     STOP_OR_CHANGE,
                    //     this.typeTreatment,
                    //     { abandonner: true, modifier: true, visualiser: false }
                    // );
                }
                if (
                    selectedClaims?.traitement === BADGE_STATE_CLAIMS.ABANDONED
                ) {
                    // return createButtonStyle(
                    //     'p-button-warning',
                    //     'pi pi-times',
                    //     STOP_OR_CHANGE,
                    //     this.typeTreatment,
                    //     { abandonner: false, modifier: false, visualiser: true }
                    // );
                }
                break;
            }
            case BADGE_STEP_CLAIMS.TRAITEMENT: {
                if (
                    selectedClaims?.traitement === BADGE_STATE_CLAIMS.APPROVED
                ) {
                    // return createButtonStyle(
                    //     'p-button-success',
                    //     'pi pi-check-circle',
                    //     TO_CLOSURE,
                    //     this.typeTreatment,
                    //     {
                    //         abandonner: false,
                    //         modifier: false,
                    //         visualiser: false,
                    //         cloturer: true,
                    //     }
                    // );
                }
                if (
                    selectedClaims?.traitement === BADGE_STATE_CLAIMS.REJECTED
                ) {
                    // return createButtonStyle(
                    //     'p-button-success',
                    //     'pi pi-check-circle',
                    //     TO_CLOSURE,
                    //     this.typeTreatment,
                    //     {
                    //         abandonner: false,
                    //         modifier: false,
                    //         visualiser: false,
                    //         cloturer: true,
                    //     }
                    // );
                }
                break;
            }
        }
        // return createButtonStyle(
        //     'p-button-secondary',
        //     'pi pi-eye',
        //     DETAILS_OF_THE_CLAIM,
        //     this.typeTreatment,
        //     { abandonner: false, modifier: false, visualiser: true }
        // );
    }

    getTreatmentButtonOpenClaimsStyle(selectedClaims: {
        statut: string;
        traitement: string;
    }): any {
        const SIM_OF_THE_REQUEST = this.translate.instant('SIM_OF_THE_REQUEST');
        // return createButtonStyle(
        //     'p-button-success',
        //     'pi pi-folder-open',
        //     SIM_OF_THE_REQUEST,
        //     this.typeTreatment
        // );
    }
}

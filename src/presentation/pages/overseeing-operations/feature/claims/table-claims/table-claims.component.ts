import { T_CLAIMS_STATUS_ENUM } from './../../../data-access/claims/enums/claims-status.enum';
import { ModalParams } from './../../../../../../shared/constants/modalParams.contant';
import { JournalComponent } from './../../../../../../shared/components/journal/journal.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableConfig, TableExportExcelFileService } from '../../../../../../shared/services/table-export-excel-file.service';
import { BADGE_ETAT } from '../../../../../../shared/constants/badge-etat.contant';
import { BADGE_ETAPE } from '../../../../../../shared/constants/badge-etape.constant';
import { CLAIMS_STATUS_ENUM } from '../../../data-access/claims/enums/claims-status.enum';
import { ClaimsApiService } from '../../../data-access/claims/services/claims-api.service';
import { claimsFilterInterface } from '../../../data-access/claims/interfaces/claims-filter.interface';
import { Observable } from 'rxjs';
import { Folder } from '../../../../../../shared/interfaces/folder';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { TreatmentDemands } from '../../../../../../shared/interfaces/treatment-demands.interface';
import { claimsTableConstant } from '../../../data-access/claims/constants/claims-table.constant';
import { TranslateService } from '@ngx-translate/core';
import { createButtonStyle } from '../../../../../../shared/functions/treatment-demands.function';

type Action = PageAction | ModalAction;
type PageAction = { data: Folder, action: 'open-folder-claims' | 'invoice-claims' | 'mass-edit-claims' | 'mass-add-claims' | 'simple-add-claims', view: 'page' };
type ModalAction = { data: Folder, action: 'view-claims' | 'journal-claims', view: 'modal' };
const INIT_TYPE_TRAITEMENT: TreatmentDemands = { module: "tracking-processing", abandonner: false, modifier: false, visualiser: false, cloturer: false }
type TYPE_COLOR_STATUS_BADGE = 'badge-dark' | 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-claims',
    templateUrl: './table-claims.component.html'
})

export class TableClaimsComponent {

    @Input() listClaims$: Observable<Array<Folder>>;
    @Input() claimsSelected: Folder;
    @Input() pagination$: Observable<Paginate<Folder>>;
    @Output() interfaceUser = new EventEmitter<any>();
    public typeTreatment: TreatmentDemands = INIT_TYPE_TRAITEMENT;
    public visibleFormClaims = false;

    public readonly table: TableConfig = claimsTableConstant;

    constructor(private toastService: ToastrService, private clipboardService: ClipboardService, private ngbModal: NgbModal,
        private tableExportExcelFileService: TableExportExcelFileService, private claimsApiService: ClaimsApiService,
        private translate: TranslateService) { }

    public onExportExcel(): void {
        this.listClaims$.subscribe(data => {
            if (data) { this.tableExportExcelFileService.exportAsExcelFile(data, this.table, "List_claims"); }
        });
    }

    public pageCallback() {
        this.claimsApiService.fetchClaims({} as claimsFilterInterface);
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant('COPIED_TO_THE_CLIPBOARD');
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }
    getStatusClaimBadge(selectedClaim?: { code_rapport: T_CLAIMS_STATUS_ENUM }): TYPE_COLOR_STATUS_BADGE {
        if (!selectedClaim || !selectedClaim.code_rapport) { return 'badge-dark'; }
        const etapeMap: Record<T_CLAIMS_STATUS_ENUM, TYPE_COLOR_STATUS_BADGE> = {
            [CLAIMS_STATUS_ENUM.SUBMITTED]: 'badge-dark',
            [CLAIMS_STATUS_ENUM.TREATED]: 'badge-success',
            [CLAIMS_STATUS_ENUM.CLOSED]: 'badge-danger',
        };
        return etapeMap[selectedClaim.code_rapport] || 'badge-dark';
    }

    // getStatusClaimBadge(selectedClaims?: { statut?: T_BADGE_ETAPE; traitement?: T_BADGE_ETAT }): TYPE_COLOR_ETAT_BADGE {
    //     if (!selectedClaims || !selectedClaims.statut || !selectedClaims.traitement) {
    //         return 'badge-dark';
    //     }

    //     const stateMap: Partial<Record<T_BADGE_ETAPE, Partial<Record<T_BADGE_ETAT, TYPE_COLOR_ETAT_BADGE>>>> = {
    //         [BADGE_ETAPE.SOUMISSION]: {
    //             [CLAIMS_STATUS_ENUM.SUBMITTED]: 'badge-dark',
    //             [CLAIMS_STATUS_ENUM.TREATED]: 'badge-success',
    //             [CLAIMS_STATUS_ENUM.CLOSED]: 'badge-danger',
    //         },
    //         [BADGE_ETAPE.CLOTURE]: {
    //             [CLAIMS_STATUS_ENUM.SUBMITTED]: 'badge-dark'
    //         },
    //     };

    //     return stateMap[selectedClaims.statut]?.[selectedClaims.traitement] || 'badge-dark';
    // }

    public truncateString(str: string, num: number = 20): string {
        if (str.length > num) {
          return str.slice(0, num) + "...";
        } else {
          return str;
        }
      }

    // getReportClaimBadge(selectedClaim?: { code_rapport: T_CODE_REPORT_ENUM }): TYPE_COLOR_STATUS_BADGE {
    //     if (!selectedClaim || !selectedClaim.code_rapport) { return 'badge-dark'; }
    //     const code = selectedClaim.code_rapport?.split("-");
    //     const etapeMap: Record<T_CODE_REPORT_ENUM, TYPE_COLOR_STATUS_BADGE> = {
    //         [CODE_REPORT_ENUM[200]]: 'badge-success',
    //         [CODE_REPORT_ENUM.RECEIVED]: 'badge-dark',
    //         [CODE_REPORT_ENUM.REJECTED]: 'badge-danger',
    //         [CODE_REPORT_ENUM.REFUSED]: 'badge-danger',
    //         [CODE_REPORT_ENUM.ABANDONED]: 'badge-danger',
    //         [CODE_REPORT_ENUM.ACCEPTED]: 'badge-danger',
    //         [CODE_REPORT_ENUM.CLOSED]: 'badge-danger',
    //     };
    //     return etapeMap[code] || 'badge-dark';
    // }

    public handleAction(params: Action): void {
        this.onSelectClaims(params.data);

        switch (params.view) {
            case 'modal':
                if (params.action === 'view-claims') { this.handleClaimsTreatment(params.data) }
                if (params.action === 'journal-claims') { this.handleJournal(params.data) };
                break;

            case 'page':
                if (params.action === 'invoice-claims') { this.interfaceUser.emit(params) };
                if (params.action === 'open-folder-claims') { this.interfaceUser.emit(params) };
                if (params.action === 'mass-edit-claims') { this.interfaceUser.emit(params) };
                if (params.action === 'mass-add-claims') { this.interfaceUser.emit(params) };
                if (params.action === 'simple-add-claims') { this.interfaceUser.emit(params) };
                break;
        }
    }

    handleClaimsTreatment(selectedClaims: { statut: string, traitement: string }): void {
        this.visibleFormClaims = true;
        this.typeTreatment = this.getTreatmentButtonViewClaimsStyle(selectedClaims)?.typeTreatment;
    }

    handleJournal(selectedClaims: { numero_demande: string }): void {
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.numero_demande = selectedClaims?.numero_demande;
        modalRef.componentInstance.typeJournal = "contentieux";
    }

    private onSelectClaims(selectedClaims: Folder): void {
        this.claimsSelected = selectedClaims;
        this.claimsApiService.setClaimsSelected(selectedClaims);
    }

    hideDialog(): void {
        this.visibleFormClaims = false;
    }

    getTreatmentButtonViewClaimsStyle(selectedClaims: { statut: string, traitement: string }): { class: string, icon: string, tooltip: string, typeTreatment: TreatmentDemands } {
        const STOP_OR_CHANGE = this.translate.instant('STOP_OR_CHANGE');
        const DETAILS_OF_THE_REQUEST = this.translate.instant('DETAILS_OF_THE_REQUEST');
        switch (selectedClaims?.statut) {
            case BADGE_ETAPE.SOUMISSION: {
                if (selectedClaims?.traitement === BADGE_ETAT.EN_ATTENTE) {
                    return createButtonStyle('p-button-warning', 'pi pi-times', STOP_OR_CHANGE, this.typeTreatment, { abandonner: true, modifier: true, visualiser: false });
                }
                if (selectedClaims?.traitement === BADGE_ETAT.REJETE) {
                    return createButtonStyle('p-button-warning', 'pi pi-times', STOP_OR_CHANGE, this.typeTreatment, { abandonner: true, modifier: true, visualiser: false });
                }
            }
        }
        return createButtonStyle('p-button-secondary', 'pi pi-eye', DETAILS_OF_THE_REQUEST, this.typeTreatment, { abandonner: false, modifier: false, visualiser: true });
    }

    getTreatmentButtonOpenClaimsStyle(selectedClaims: { statut: string, traitement: string }): { class: string, icon: string, tooltip: string } {
        const SIM_OF_THE_REQUEST = this.translate.instant('SIM_OF_THE_REQUEST');
        const CANNOT_SEE_THE_SIM = this.translate.instant('CANNOT_SEE_THE_SIM');
        switch (selectedClaims?.statut) {
            case BADGE_ETAPE.TRAITEMENT: {
                if (selectedClaims?.traitement === BADGE_ETAT.EN_COURS) {
                    return createButtonStyle('p-button-success', 'pi pi-folder-open', SIM_OF_THE_REQUEST, this.typeTreatment);
                }
            }
        }
        return createButtonStyle('p-button-secondary', 'pi pi-folder-open', CANNOT_SEE_THE_SIM, this.typeTreatment);
    }


    getTreatmentButtonPaymentClaimsStyle(selectedClaims: { type_paiement: string }): { class: string, icon: string, tooltip: string } {
        const SOLVE = this.translate.instant('SOLVE');
        const MAKE_A_PAYMENT = this.translate.instant('MAKE_A_PAYMENT');
        if (!!selectedClaims?.type_paiement) {
            return createButtonStyle('p-button-success', 'pi pi-print', SOLVE, this.typeTreatment);
        } else {
            return createButtonStyle('p-button-danger', 'pi pi-print', MAKE_A_PAYMENT, this.typeTreatment);
        }
    }
}

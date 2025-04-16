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
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { TreatmentDemands } from '../../../../../../shared/interfaces/treatment-demands.interface';
import { claimsTableConstant } from '../../../data-access/claims/constants/claims-table.constant';
import { TranslateService } from '@ngx-translate/core';
import { createButtonStyle } from '../../../../../../shared/functions/treatment-demands.function';
import { claimsInterface } from '../../../data-access/claims/interfaces/claims.interface';

type Action = PageAction | ModalAction;
type PageAction = { data: claimsInterface, action: 'open-folder-claims' | 'invoice-claims' | 'mass-edit-claims' | 'mass-add-claims' | 'simple-add-claims', view: 'page' };
type ModalAction = { data: claimsInterface, action: 'view-claims' | 'journal-claims', view: 'modal' };
const INIT_TYPE_TRAITEMENT: TreatmentDemands = { module: "tracking-processing", abandonner: false, modifier: false, visualiser: false, cloturer: false }
type TYPE_COLOR_STATUS_BADGE = 'badge-dark' | 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-claims',
    templateUrl: './table-claims.component.html'
})

export class TableClaimsComponent {

    @Input() spinner: boolean;
    @Input() listClaims$: Observable<Array<claimsInterface>>;
    @Input() claimsSelected: claimsInterface;
    @Input() pagination$: Observable<Paginate<claimsInterface>>;
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

    public truncateString(str: string, num: number = 20): string {
        if (str.length > num) {
            return str.slice(0, num) + "...";
        } else {
            return str;
        }
    }

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

    private onSelectClaims(selectedClaims: claimsInterface): void {
        this.claimsSelected = selectedClaims;
        this.claimsApiService.setClaimsSelected(selectedClaims);
    }

    hideDialog(): void {
        this.visibleFormClaims = false;
    }

    getTreatmentButtonViewClaimsStyle(selectedClaims: { statut: string, traitement: string }): { class: string, icon: string, tooltip: string, typeTreatment: TreatmentDemands } {
        const DETAILS_OF_THE_REQUEST = this.translate.instant('DETAILS_OF_THE_REQUEST');
        return createButtonStyle('p-button-secondary', 'pi pi-eye', DETAILS_OF_THE_REQUEST, this.typeTreatment, { abandonner: false, modifier: false, visualiser: true });
    }

    getTreatmentButtonOpenClaimsStyle(selectedClaims: { statut: string, traitement: string }): { class: string, icon: string, tooltip: string } {
        const SIM_OF_THE_REQUEST = this.translate.instant('SIM_OF_THE_REQUEST');
        return createButtonStyle('p-button-success', 'pi pi-folder-open', SIM_OF_THE_REQUEST, this.typeTreatment);
    }
}

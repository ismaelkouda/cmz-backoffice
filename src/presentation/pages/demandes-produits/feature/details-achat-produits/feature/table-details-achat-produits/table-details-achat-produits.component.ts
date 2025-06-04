import { SupervisionOperationService } from 'src/presentation/pages/supervision-operations/data-access/supervision-operation.service';
import { BADGE_ETAPE } from 'src/shared/constants/badge-etape.constant';
import { BADGE_ETAT } from 'src/shared/constants/badge-etat.contant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
    OperationTransaction,
    TitleOperation,
} from '../../../../../../../shared/enum/OperationTransaction.enum';
const Swal = require('sweetalert2');

@Component({
    selector: `app-table-details-achat-produits`,
    templateUrl: `./table-details-achat-produits.component.html`,
})
export class TableDetailsAchatProduits {
    public BADGE_ETAT = BADGE_ETAT;
    public BADGE_ETAPE = BADGE_ETAPE;
    @Input() pargination: any;
    @Input() spinner: boolean;
    @Input() listProduits: Object;
    @Input() selectedAchat: Object;
    public IsLoading: boolean;
    public selectedProduit: Object;

    constructor(
        public toastrService: ToastrService,
        private clipboardService: ClipboardService,
        private supervisionOperationService: SupervisionOperationService
    ) {}

    copyData(dossier: any): void {
        this.toastrService.success('Copié dans le presse papier');
        this.clipboardService.copyFromContent(dossier);
    }
    public getTitleForm(operation: OperationTransaction): string {
        const titleOp = new TitleOperation();
        titleOp.setTitleForm(operation);
        return titleOp.getTitleForm;
    }
    public truncateString(str: string, num: number = 20): string {
        if (str.length > num) {
            return str.slice(0, num) + '...';
        } else {
            return str;
        }
    }

    public getEtapeBadge(data: any): string {
        switch (data?.statut) {
            case BADGE_ETAPE.SOUMISSION:
                return 'badge-dark';
            case BADGE_ETAPE.TRAITEMENT:
                return 'badge-warning';
            case BADGE_ETAPE.FINALISATEUR:
                return 'badge-info';
            case BADGE_ETAPE.CLOTURE:
                return 'badge-success';
        }
    }

    public getEtatBadge(data: any): string {
        switch (data?.statut) {
            case BADGE_ETAPE.SOUMISSION:
                if (data?.traitement === BADGE_ETAT.EN_ATTENTE)
                    return 'badge-dark';
                if (data?.traitement === BADGE_ETAT.APPROUVE)
                    return 'badge-success';
                if (data?.traitement === BADGE_ETAT.REJETE)
                    return 'badge-danger';
                if (data?.traitement === BADGE_ETAT.EN_COURS)
                    return 'badge-warning';
                if (data?.traitement === BADGE_ETAT.RECU) return 'badge-dark';
                break;

            case BADGE_ETAPE.TRAITEMENT:
                if (data?.traitement === BADGE_ETAT.EN_COURS)
                    return 'badge-warning';
                if (data?.traitement === BADGE_ETAT.TERMINE)
                    return 'badge-success';
                break;

            case BADGE_ETAPE.FINALISATEUR:
                if (data?.traitement === BADGE_ETAT.EN_ATTENTE) {
                    return 'badge-warning';
                }
                if (data?.traitement === BADGE_ETAT.EFFECTUE) {
                    return 'badge-warning';
                }
                if (data?.traitement === BADGE_ETAT.LIVRE) {
                    return 'badge-primary';
                }
                break;

            case BADGE_ETAPE.CLOTURE:
                if (data?.traitement === BADGE_ETAT.EFFECTUE) {
                    return 'badge-success';
                }
                if (data?.traitement === BADGE_ETAT.TERMINE) {
                    return 'badge-success';
                }
                if (data?.traitement === BADGE_ETAT.REFUSE) {
                    return 'badge-danger';
                }
                if (data?.traitement === BADGE_ETAT.ABANDONNE) {
                    return 'badge-warning';
                }
                if (data?.traitement === BADGE_ETAT.REJETE) {
                    return 'badge-danger';
                }
                break;
        }
    }

    public showDialog(data: Object): void {
        if (data['message']) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger',
                },
                buttonsStyling: false,
            });
            swalWithBootstrapButtons.fire({
                icon: 'info',
                html: `<span><strong>Message</strong> : ${
                    data['message']
                }</span> <br/><br/> ${this.swalBootstrapMessage(data)}`,
                confirmButtonColor: '#F07427',
                confirmButtonText: 'ok',
            });
        }
    }
    private swalBootstrapMessage(data: any) {
        return data?.action
            ? `<span><strong>Action</strong>: ${data?.['action']}</span>`
            : ``;
    }

    private selectProduit(selectedProduit: Object): void {
        this.selectedProduit = selectedProduit;
    }

    OnShowTraitement(demande: Object): void {
        // this.selectProduit(demande)
        // this.IsLoading = true;
        // const modalRef = this.ngbModal.open(FormLigneComponent, ModalParams);
        // modalRef.componentInstance.transaction = { ...demande, tenant_code: this.selectedAchat?.["tenant_code"], current_date: demande?.["current_date"], IsLoading: this.IsLoading };
        // modalRef.componentInstance.resultTraitement.subscribe((res) => { this.listProduits = res; });
        // modalRef.componentInstance.IsLoading.subscribe((res) => {
        //     this.IsLoading = res;
        //     modalRef.componentInstance.IsLoadData = !res;
        // });
    }

    showJournal(demande: Object): void {
        // this.selectProduit(demande)
        // const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        // modalRef.componentInstance.libelleModule = "ligne";
        // modalRef.componentInstance.transaction = demande['transaction'];
        // modalRef.componentInstance.tenant_code = this.selectedAchat?.["tenant_code"];
        // modalRef.componentInstance.typeJournal = "transactions"
    }
}

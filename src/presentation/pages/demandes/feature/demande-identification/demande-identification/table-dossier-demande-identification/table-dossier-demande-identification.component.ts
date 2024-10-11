import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { log } from 'console';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { JournalComponent } from 'src/shared/components/journal/journal.component';
import { TransactionShowComponent } from 'src/shared/components/transaction-show/transaction-show.component';
import { BADGE_ETAPE } from 'src/shared/constants/badge-etape.constant';
import { BADGE_ETAT } from 'src/shared/constants/badge-etat.contant';
import { BADGE_STATUT } from 'src/shared/constants/badge-statut.constant';
import { ModalParams } from 'src/shared/constants/modalParams.contant';

@Component({
  selector: 'app-table-dossier-demande-identification',
  templateUrl: './table-dossier-demande-identification.component.html',
})
export class TableDossierDemandeIdentificationComponent {

    @Input() listLignesIdentification: Array<Object>;
    @Input() spinner: boolean;
    @Input() pargination: Object;
    public IsLoading: boolean;
    selectedLignesIntegrations: Object;
    BADGE_ETAPE = BADGE_ETAPE;
    BADGE_ETAT = BADGE_ETAT;
    BADGE_STATUT = BADGE_STATUT;

    constructor(private toastrService: ToastrService, private clipboardService: ClipboardService,
        private ngbModal: NgbModal) {}

    public copyData(data: Object, libelle: "transaction"): void {
        this.toastrService.success('Copié dans le presse papier');
        this.clipboardService.copyFromContent(data?.[libelle]);
    }
    public getStatutBadge(statut: string): string {
        if(statut === BADGE_ETAPE.SOUMISSION || statut === BADGE_STATUT.SOUMIS) {
            return "badge-dark";
        } else if(statut === BADGE_ETAPE.TRAITEMENT) {
            return "badge-warning";
        } else if(statut === BADGE_ETAPE.FINALISATEUR || statut === BADGE_ETAPE.CLOTURE || statut === BADGE_STATUT.CLOTURE) {
            return "badge-success";
        } else if(statut === BADGE_STATUT.TRAITE) {
            return "badge-info";
        }
    }
    public getTraitementBadge(dossier: any): string {
        if (dossier?.traitement === BADGE_ETAT.RECU || (dossier?.statut === BADGE_ETAPE.SOUMISSION && dossier?.traitement === BADGE_ETAT.EN_ATTENTE) || (dossier?.statut === BADGE_ETAPE.TRAITEMENT && dossier?.traitement === BADGE_ETAT.EN_ATTENTE)) {
            return "badge-dark";
        } else if ((dossier?.statut === BADGE_ETAPE.TRAITEMENT && (dossier?.traitement === BADGE_ETAT.PARTIEL || dossier?.traitement === BADGE_ETAT.EN_ATTENTE)) ||
            (dossier?.statut === BADGE_ETAPE.CLOTURE && dossier?.traitement === BADGE_ETAT.ABANDONNE)) {
            return "badge-warning";
        } else if (dossier?.statut === BADGE_ETAPE.TRAITEMENT && dossier?.traitement === BADGE_ETAT.TOTAL) {
            return "badge-info";
        } else if ((dossier?.statut === BADGE_ETAPE.FINALISATEUR && dossier?.traitement === BADGE_ETAT.CLOTURE) ||
            (dossier?.statut === BADGE_ETAPE.CLOTURE && dossier?.traitement === BADGE_ETAT.ACCEPTE) || 
            (dossier?.statut === BADGE_ETAPE.FINALISATEUR && dossier?.traitement === BADGE_ETAT.PARTIEL)) {
            return "badge-success";
        } else if (dossier?.traitement === BADGE_ETAT.REJETE || dossier?.traitement === BADGE_ETAT.REFUSE) {
            return "badge-danger";
        }
    }
    OnShowTraitement(data: any): void {
        this.selectedLignesIntegrations = data;
        this.IsLoading = true;
        const modalRef = this.ngbModal.open(TransactionShowComponent, ModalParams);
        modalRef.componentInstance.transaction = { ...data, current_date: data.current_date, IsLoading: this.IsLoading };
        modalRef.componentInstance.resultTraitement.subscribe((res) => {
            this.listLignesIdentification = res
        })
        modalRef.componentInstance.IsLoading.subscribe((res) => {
            this.IsLoading = res;
            modalRef.componentInstance.IsLoadData = !res;
        })
    }

    showJournal(data: Object): void {
        console.log("Data",data)
        this.selectedLignesIntegrations = data;
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.transaction = data['transaction'];
        modalRef.componentInstance.numero_demande = data['numero_demande'];
        modalRef.componentInstance.typeJournal = "transactions"
    }


}

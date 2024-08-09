import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { Component, Input } from "@angular/core";
import { BADGE_ETAT } from 'src/shared/constants/badge-etat.contant';
import { BADGE_ETAPE } from 'src/shared/constants/badge-etape.constant';
import { TransactionShowComponent } from 'src/shared/components/transaction-show/transaction-show.component';
import { ModalParams } from 'src/shared/constants/modalParams.contant';
import { JournalComponent } from 'src/shared/components/journal/journal.component';
import { BADGE_STATUT } from 'src/shared/constants/badge-statut.constant';

@Component({
    selector: "app-table-dossier-demande-integration",
    templateUrl: "./table-dossier-demande-integration.component.html"
})

export class TableDossierDemandeIntegration {
    @Input() listLignesIntegrations: Array<Object>;
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
        switch (statut) {
            case BADGE_ETAPE.SOUMISSION: return "badge-dark";
            case BADGE_ETAPE.TRAITEMENT: return "badge-warning";
            case BADGE_ETAPE.FINALISATEUR:
            case BADGE_ETAPE.CLOTURE: return "badge-success";
        }
    }

    public getTraitementBadge(data: Object): string {
        if (data?.['traitement'] === BADGE_ETAT.RECU || (data?.['statut'] === BADGE_ETAPE.SOUMISSION && data?.['traitement'] === BADGE_ETAT.EN_ATTENTE)) {
            return "badge-dark";
        } else if ((data?.['statut'] === BADGE_ETAPE.TRAITEMENT && (data?.['traitement'] === BADGE_ETAT.PARTIEL || data?.['traitement'] === BADGE_ETAT.EN_ATTENTE)) || (data?.['statut'] === BADGE_ETAPE.CLOTURE && data?.['traitement'] === BADGE_ETAT.ABANDONNE)) {
            return "badge-warning";
        } else if (data?.['statut'] === BADGE_ETAPE.TRAITEMENT && data?.['traitement'] === BADGE_ETAT.TOTAL) {
            return "badge-info";
        } else if ((data?.['statut'] === BADGE_ETAPE.FINALISATEUR && data?.['traitement'] === BADGE_ETAT.CLOTURE) || (data?.['statut'] === BADGE_ETAPE.CLOTURE && data?.['traitement'] === BADGE_ETAT.ACCEPTE)) {
            return "badge-success";
        } else if (data?.['traitement'] === BADGE_ETAT.REJETE || data?.['traitement'] === BADGE_ETAT.REFUSE) {
            return "badge-danger";
        }
    }
    OnShowTraitement(data: any): void {
        this.selectedLignesIntegrations = data;
        this.IsLoading = true;
        const modalRef = this.ngbModal.open(TransactionShowComponent, ModalParams);
        modalRef.componentInstance.transaction = { ...data, current_date: data.current_date, IsLoading: this.IsLoading };
        modalRef.componentInstance.resultTraitement.subscribe((res) => {
            this.listLignesIntegrations = res
        })
        modalRef.componentInstance.IsLoading.subscribe((res) => {
            this.IsLoading = res;
            modalRef.componentInstance.IsLoadData = !res;
        })
    }

    showJournal(data: Object): void {
        this.selectedLignesIntegrations = data;
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.transaction = data['transaction'];
        modalRef.componentInstance.typeJournal = "transactions"
    }

}
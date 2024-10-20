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
import { BADGE_TRAITEMENT } from 'src/shared/constants/badge-traitement.constant';

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

    
    public getStatutBadge(data: any): string {
        switch (data?.statut) {
          case BADGE_STATUT.SOUMIS:
            return "badge-dark";
        
            case BADGE_STATUT.TRAITE:
              return "badge-success";
    
            case BADGE_STATUT.CLOTURE:
              return "badge-success";
        }
    }
    
    public getTraitementBadge(data: any): string {
      switch (data?.statut) {
        case BADGE_STATUT.SOUMIS:
          if(data?.traitement  === BADGE_TRAITEMENT.RECU || data?.traitement  === BADGE_TRAITEMENT.EN_ATTENTE) {
            return "badge-dark";
          }
          break;
      
          case BADGE_STATUT.TRAITE:
            if(data?.traitement  === BADGE_TRAITEMENT.ACCEPTE) {
              return "badge-success";
            }
            if(data?.traitement  === BADGE_TRAITEMENT.REFUSE) {
              return "badge-danger";
            }
            if(data?.traitement  === BADGE_TRAITEMENT.REJETE) {
              return "badge-danger";
            }
          break;
    
          case BADGE_STATUT.CLOTURE:
            if(data?.traitement  === BADGE_TRAITEMENT.ACCEPTE) {
              return "badge-success";
            }
            if(data?.traitement  === BADGE_TRAITEMENT.ABANDONNE) {
              return "badge-warning";
            }
            if(data?.traitement  === BADGE_TRAITEMENT.REFUSE) {
              return "badge-danger";
            }
            if(data?.traitement  === BADGE_TRAITEMENT.REJETE) {
              return "badge-danger";
            }
          break;
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
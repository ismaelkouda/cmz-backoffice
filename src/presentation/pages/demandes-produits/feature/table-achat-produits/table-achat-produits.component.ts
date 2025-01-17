import { SharedDataService } from 'src/shared/services/shared-data.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { JournalComponent } from 'src/shared/components/journal/journal.component';
import { ModalParams } from 'src/shared/constants/modalParams.contant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BADGE_ETAT } from '../../../../../shared/constants/badge-etat.contant';
import { BADGE_ETAPE } from '../../../../../shared/constants/badge-etape.constant';
import { ClipboardService } from 'ngx-clipboard';
import { DemandeMasseComponent } from '../../../supervision-operations/feature/demande-masse/demande-masse.component';
import { DemandesProduitsService } from '../../data-access/demandes-produits.service';
import { TypePaiementComponent } from '../../../demandes/feature/type-paiement/type-paiement.component';

type Action = PageAction | ModalAction;
type PageAction = { data: Object, action: 'détails', view: 'page' };
type ModalAction = { data: Object, action: 'editer' | 'journal', view: 'modal' };

@Component({
    selector: "app-table-achat-produits",
    templateUrl: "./table-achat-produits.component.html"
})

export class TableAchatProduitsComponent {

    @Output() interfaceUser = new EventEmitter<PageAction>();
    @Input() listAchatProduits: Array<Object>;
    @Input() listTypeProduits: Array<string>;
    @Input() spinner: boolean;
    @Input() pargination: Object;
    public IsLoading: boolean;
    @Input() selectedAchat: Object;
    public displayEditForm: boolean = false;
    public submitted: boolean = false;
    public msisdn: string;
    readonly BADGE_ETAT = BADGE_ETAT;
    readonly BADGE_ETAPE = BADGE_ETAPE;

    constructor(private sharedDataService: SharedDataService, private ngbModal: NgbModal,
        private toastrService: ToastrService, private modalService: NgbModal,
        private clipboardService: ClipboardService, private demandesProduitsService: DemandesProduitsService) { }

    copyToClipboard(data: string): void {
        this.clipboardService.copyFromContent(data);
        this.toastrService.success('Copié dans le presse-papier');
    }

      OnShowModalPaiement(data: any): void {
        let action: string;
        if (data?.statut === this.BADGE_ETAPE.SOUMISSION && data.traitement === this.BADGE_ETAT.EN_ATTENTE) {
          action = "Abandonner";
        } else {
          action = "Identifier";
        }
        this.IsLoading = true;
        const modalRef = this.modalService.open(TypePaiementComponent, ModalParams);
        modalRef.componentInstance.params = { vue: "SIM blanche", action: action };
        modalRef.componentInstance.demandeSelected = { ...data, current_date: data?.current_date, IsLoading: this.IsLoading };
        modalRef.componentInstance.resultTraitement = this.demandesProduitsService.postCommandeProduitCommandesAll({}, 1);
        modalRef.componentInstance.IsLoading.subscribe((res) => { this.IsLoading = res; modalRef.componentInstance.IsLoadData = !res });
      }

    public onAction(params: Action): void {
        this.selectAchatProduits(params.data);
        switch (params.view) {
            case "page":
                this.interfaceUser.emit(params);
                break;

            case "modal":
                this.onOpenModal(params);
                break;
        }
    }

    private onOpenModal(params: ModalAction): void {
        // if (params.action === "editer") this.openEditForm();
        if (params.action === "journal") this.showJournal(params.data);
    }
    OnShowModalTraitement(data: any): void {
      let action: string;
      if (data?.statut === this.BADGE_ETAPE.SOUMISSION && data.traitement === this.BADGE_ETAT.EN_ATTENTE) {
        action = "Abandonner";
      } else {
        action = "Identifier";
      }
      this.IsLoading = true;
      const modalRef = this.modalService.open(DemandeMasseComponent, ModalParams);
      modalRef.componentInstance.params = { vue: "SIM blanche", action: action };
      modalRef.componentInstance.demande = { ...data, current_date: data?.current_date, IsLoading: this.IsLoading };
      modalRef.componentInstance.resultTraitement = this.demandesProduitsService.postCommandeProduitCommandesAll({}, 1);
      modalRef.componentInstance.IsLoading.subscribe((res) => { this.IsLoading = res; modalRef.componentInstance.IsLoadData = !res });
    }
    public getStyleButtonTraitement(data: any): Object {
        return { class: 'p-button-secondary', icon: 'pi pi-eye', tooltip: 'Détails demande' };
    }

    public showJournal(selectedAchat: Object): void {
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.numero_demande = selectedAchat['numero_demande'];
        modalRef.componentInstance.libelleModule = "commandes-produits";
    }

    private selectAchatProduits(selectedAchat: Object): void {
        this.selectedAchat = selectedAchat;
    }

    public getEtapeBadge(data: any): string|undefined {
        switch (data?.statut) {
          case BADGE_ETAPE.SOUMISSION: return "badge-dark";
          case BADGE_ETAPE.TRAITEMENT: return "badge-warning";
          case BADGE_ETAPE.FINALISATEUR: return "badge-info";
          case BADGE_ETAPE.CLOTURE: return "badge-success";
        }
      }
    
      public getEtatBadge(data: any): string|undefined {
        switch (data?.statut) {
          case BADGE_ETAPE.SOUMISSION:
            if (data?.traitement === BADGE_ETAT.EN_ATTENTE) return "badge-dark";
            if (data?.traitement === BADGE_ETAT.APPROUVE) return "badge-success";
            if (data?.traitement === BADGE_ETAT.REJETE) return "badge-danger";
            if (data?.traitement === BADGE_ETAT.EN_COURS) return "badge-warning";
            if (data?.traitement === BADGE_ETAT.RECU) return "badge-dark";
            break;
    
          case BADGE_ETAPE.TRAITEMENT:
            if (data?.traitement === BADGE_ETAT.EN_COURS) return "badge-warning";
            if (data?.traitement === BADGE_ETAT.TERMINE) return "badge-success";
            break;
    
          case BADGE_ETAPE.FINALISATEUR:
            if (data?.traitement === BADGE_ETAT.EN_ATTENTE) { return "badge-warning"; }
            if (data?.traitement === BADGE_ETAT.EFFECTUE) { return "badge-warning"; }
            if (data?.traitement === BADGE_ETAT.LIVRE) { return "badge-primary"; }
            break;
    
          case BADGE_ETAPE.CLOTURE:
            if (data?.traitement === BADGE_ETAT.TERMINE) { return "badge-success"; }
            if (data?.traitement === BADGE_ETAT.REFUSE) { return "badge-danger"; }
            if (data?.traitement === BADGE_ETAT.ABANDONNE) { return "badge-warning"; }
            if (data?.traitement === BADGE_ETAT.REJETE) { return "badge-danger"; }
            break;
        }
      }

      public getColorActionButton(facture: Object): Object {
        if(!!facture?.["type_paiement"]) {
          return {style: 'badge-success', value: facture?.["etat_facture"]};
        } else {
          return {style: 'badge-danger', value: facture?.["etat_facture"]};
        }
      }
}
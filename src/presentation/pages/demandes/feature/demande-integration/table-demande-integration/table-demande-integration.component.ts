import { Component, Input, Output, EventEmitter } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ClipboardService } from "ngx-clipboard";
import { ToastrService } from "ngx-toastr";
import { JournalComponent } from "src/shared/components/journal/journal.component";
import { BADGE_ETAPE } from "src/shared/constants/badge-etape.constant";
import { BADGE_ETAT } from "src/shared/constants/badge-etat.contant";
import { DemandeIntegrationStateService } from "../../../data-access/demande-integration/demande-integration-state.service";
import { DemandeMasseComponent } from "src/presentation/pages/supervision-operations/feature/demande-masse/demande-masse.component";
import { ModalParams } from "src/shared/constants/modalParams.contant";
import { BADGE_STATUT } from "src/shared/constants/badge-statut.constant";

type TYPEFORM = "détails" | "editer" | "traitement" | "dossier" ;

@Component({
    selector: "app-table-demande-integration",
    templateUrl: "./table-demande-integration.component.html",
    styles: [`.actions_width { min-width: 200px; max-width: 200px; display: flex; gap: 3px;} .numero_demande_width { min-width: 250px; max-width: 250px; }`]
})

export class TableDemandeIntegrationComponent {

    @Output() interfaceUser = new EventEmitter<{ data: any, paramUrl: TYPEFORM }>();
    @Input() spinner: boolean;
    @Input() listDemandesIntegrations: Array<Object>;
    @Input() pargination: Object;
    @Input() firstLevelLibelle: string;
    @Input() secondLevelLibelle: string;
    @Input() thirdLevelLibelle: string;
    selectedDemandeIntegration: Object;
    BADGE_ETAPE = BADGE_ETAPE;
    BADGE_ETAT = BADGE_ETAT;
    public IsLoading: boolean;

    constructor(private toastrService: ToastrService, private clipboardService: ClipboardService,
        private ngbModal: NgbModal, private demandeIntegrationStateService: DemandeIntegrationStateService,) { }

    public copyData(data: Object, libelle: "numero_demande"): void {
        this.toastrService.success('Copié dans le presse papier');
        this.clipboardService.copyFromContent(data?.[libelle]);
    }
    
    public getStatutBadge(data: any): string {
        switch (data?.statut) {
          case BADGE_ETAPE.SOUMISSION:
            return "badge-dark";
        
            case BADGE_ETAPE.TRAITEMENT:
              return "badge-warning";
        
              case BADGE_ETAPE.FINALISATEUR:
                return "badge-info";
    
            case BADGE_ETAPE.CLOTURE:
              return "badge-success";
        }
    }
    
    public getTraitementBadge(data: any): string {
      switch (data?.statut) {
        case BADGE_ETAPE.SOUMISSION:
          if(data?.traitement  === BADGE_ETAT.RECU || data?.traitement  === BADGE_ETAT.EN_ATTENTE) {
            return "badge-dark";
          }
          break;
      
          case BADGE_ETAPE.TRAITEMENT:
            if(data?.traitement  === BADGE_ETAT.PARTIEL) {
              return "badge-warning";
            }
            if(data?.traitement  === BADGE_ETAT.COMPLET) {
              return "badge-danger";
            }
          break;
      
          case BADGE_ETAPE.FINALISATEUR:
            if(data?.traitement  === BADGE_ETAT.PARTIEL) {
              return "badge-warning";
            }
            if(data?.traitement  === BADGE_ETAT.CLOTURE) {
              return "badge-success";
            }

            if(data?.traitement  === BADGE_ETAT.ABANDONNE) {
              return "badge-danger";
            }
          break;
    
          case BADGE_ETAPE.CLOTURE:
            if(data?.traitement  === BADGE_ETAT.PARTIEL) {
              return "badge-warning";
            }
            if(data?.traitement  === BADGE_ETAT.CLOTURE) {
              return "badge-success";
            }

            if(data?.traitement  === BADGE_ETAT.ABANDONNE) {
              return "badge-danger";
            }
          break;
      }
    }

    public isDisableEditButton(data: Object): boolean {
        return data?.['statut'] === BADGE_ETAPE.SOUMISSION && data?.['traitement'] === BADGE_ETAT.EN_ATTENTE;
    }

    public onAction(data: Object, action: TYPEFORM, type: "page" | "modal"): void {
        this.selectDemandeIntegration(data);
        switch (type) {
            case "page":
                this.interfaceUser.emit({ data: data, paramUrl: action });
                // garder l'etat du tableau
                this.demandeIntegrationStateService.setTableState(this.listDemandesIntegrations);
                break;
                
            case "modal":
                this.onOpenModal(data, action);
                break;
        }
    }

    // public onOpenEdit(data: any, typeForm: TYPEFORM): void {
    //     this.interfaceUser.emit({ data: any, paramUrl: typeForm });
    //     this.onSelectedSeniorManager(seniorManager);
    // }

    onOpenModal(data: any, libelle): void {
        let action: string;
        if (data?.statut === this.BADGE_ETAPE.SOUMISSION && data.traitement === this.BADGE_ETAT.EN_ATTENTE) {
            action = "Abandonner";
        } else {
            action = "Identifier";
        }
        //   this.IsLoading = true;
        //   const modalRef = this.ngbModal.open(DemandeMasseComponent, ModalParams);
        //   modalRef.componentInstance.params = { vue: "demande", action: action };
        //   modalRef.componentInstance.demande = { ...data, current_date: data?.current_date, IsLoading: this.IsLoading };
        //   modalRef.componentInstance.resultTraitement = this.demandeService.GetDemandeServiceByTransaction(this.demandesFilterStateService.getFilterState(), this.p);
        //   modalRef.componentInstance.IsLoading.subscribe((res) => { this.IsLoading = res; modalRef.componentInstance.IsLoadData = !res });
    }

    public getStyleButtonTraitement(data: any): Object {
        if (data?.statut === BADGE_ETAPE.SOUMISSION && data.traitement === BADGE_ETAT.EN_ATTENTE) {
            return { class: 'p-button-danger', icon: 'pi pi-times', tooltip: 'Abandonner' };
        } else if ((data?.statut === BADGE_ETAPE.FINALISATEUR || data?.statut === BADGE_ETAPE.CLOTURE) && 
            !(data?.statut === BADGE_ETAPE.CLOTURE && data.traitement === BADGE_ETAT.ABANDONNE)) {
            return { class: 'p-button-success', icon: 'pi pi-check', tooltip: 'Identifier' };
        } else {
            return { class: 'p-button-secondary', icon: 'pi pi-eye', tooltip: 'Détails demande' };
        }
    }

    private selectDemandeIntegration(selectedDemandeIntegration: Object): void {
        this.selectedDemandeIntegration = selectedDemandeIntegration;
        this.demandeIntegrationStateService.setTableItemSelectedState(selectedDemandeIntegration);
    }

    OnShowModalTraitement(data: any): void {
        console.log('data', data)
      let action: string;
      if (data?.statut === this.BADGE_ETAPE.SOUMISSION && data.traitement === this.BADGE_ETAT.EN_ATTENTE) {
        action = "Abandonner";
      } else {
        action = "Identifier";
      }
      this.IsLoading = true;
      const modalRef = this.ngbModal.open(DemandeMasseComponent, ModalParams);
      modalRef.componentInstance.params = { vue: "demande", action: action };
      modalRef.componentInstance.demande = { ...data, current_date: data?.current_date, IsLoading: this.IsLoading };
      modalRef.componentInstance.IsLoading.subscribe((res) => { this.IsLoading = res; modalRef.componentInstance.IsLoadData = !res });
    }

    showJournal(data: Object): void {
        this.selectDemandeIntegration(data);
        const modalRef = this.ngbModal.open(JournalComponent, {
            ariaLabelledBy: "modal-basic-title",
            backdrop: "static",
            keyboard: false,
            centered: true,
        });
        modalRef.componentInstance.numero_demande = data['numero_demande'];
        modalRef.componentInstance.typeJournal = "demandes-services"
    }

}
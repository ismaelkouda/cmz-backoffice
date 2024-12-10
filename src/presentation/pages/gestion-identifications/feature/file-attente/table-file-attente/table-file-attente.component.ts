import { SupervisionOperationService } from 'src/presentation/pages/supervision-operations/data-access/supervision-operation.service';
import { Input } from "@angular/core";
import { Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ClipboardService } from 'ngx-clipboard';
import { BADGE_ETAPE } from 'src/shared/constants/badge-etape.constant';
import { BADGE_ETAT } from 'src/shared/constants/badge-etat.contant';

type Action = PageAction;
type PageAction = { data: Object, action: 'détails', view: 'modal' } | { data: Object, action: 'prendre-en-charge', view: 'modal' };
export interface Dossier {
  id: number;
  created_at: string;
  operation?: string;
  numero_demande: string;
  nb_demande_soumises?: number;
  nb_demande_traitees?: number;
  nb_demande_echouees?: number;
  statut: string;
  traitement: string;
  acquitte_a?: string;
  traite_a?: string;
  demandeur_nom: string;
  demandeur_prenoms: string;
  tenant_code?: string;
}
export interface TraitementAction {
  module: "suivi-traitement";
  editer: boolean
}
@Component({
  selector: `app-table-file-attente`,
  templateUrl: `./table-file-attente.component.html`
})

export class TableFileAttenteComponent {

  public BADGE_ETAT = BADGE_ETAT;
  public BADGE_ETAPE = BADGE_ETAPE;
  @Input() pargination: any;
  @Input() listSim: Array<Object>;
  @Input() spinner: boolean;
  @Input() selectedSim: Object;
  public IsLoading: boolean;
  @Input() userRole: string;
  @Input() startedDay: string;
  public visibleForm: boolean = false;
  public typeTraitement: { module: "personne-physique", visualiser: boolean};

  constructor(public toastrService: ToastrService, private clipboardService: ClipboardService,
    private supervisionOperationService: SupervisionOperationService) { }

  public copyTransaction(demande: any): void {
    this.toastrService.success("Copié dans le presse papier");
    this.clipboardService.copyFromContent(demande);
  }
  public getStyleButtonTraitement(sim: any): Object|void {
    return { class: 'p-button-success', icon: 'pi pi-check-circle', tooltip: 'identifier', typeTraitement: { module: "file-attente", visualiser: true } };
  }

  getTreatmentButtonStyle(dossier?: Dossier): any {
    if (!dossier) return null;
    
    const baseAction: TraitementAction = {
      module: "suivi-traitement",
      editer: false
    };

    const treatmentStyles = {
      [BADGE_ETAPE.SOUMISSION]: {
        
        [BADGE_ETAT.RECU]: {
          icon: 'pi pi-eye',
          tooltip: 'Détails demande',
          typeTraitement: baseAction
        },
        [BADGE_ETAT.EN_COURS]: {
          class: 'p-button-success',
          icon: 'pi pi-check-circle',
          tooltip: 'Editer',
          typeTraitement: { ...baseAction, editer: true }
        }
      },
      [BADGE_ETAPE.TRAITEMENT]: {
        [BADGE_ETAT.REJETE]: {
          class: 'p-button-success',
          icon: 'pi pi-check-circle',
          tooltip: 'Editer',
          typeTraitement: { ...baseAction, editer: true }
        }
      }
    };

    return treatmentStyles[dossier.statut]?.[dossier.traitement] || null;
  }

  public formatTitle(title: string) {
    return this.supervisionOperationService.HandleFormatTitle(title);
  }

  hideDialog() {
    this.visibleForm = false;
  }

  public getEtapeBadge(data: any): string {
    switch (data?.statut) {
      case BADGE_ETAPE.SOUMISSION: return "badge-dark";
      case BADGE_ETAPE.TRAITEMENT: return "badge-warning";
    }
  }

  public getEtatBadge(data: any): string {
    switch (data?.statut) {
      case BADGE_ETAPE.SOUMISSION:
        if (data?.traitement === BADGE_ETAT.EN_ATTENTE) return "badge-dark";
        if (data?.traitement === BADGE_ETAT.RECU) return "badge-dark";
        break;

        case BADGE_ETAPE.TRAITEMENT:
          if (data?.traitement === BADGE_ETAT.REJETE) return "badge-danger";
          break;
    }
  }

  OnShowModalTraitement(data: any, typeTraitement: { module: "personne-physique", visualiser: boolean }): void {
    this.onSelectTableSim(data);
    this.visibleForm = true;
    this.typeTraitement = typeTraitement;
  }

  private onSelectTableSim(selectedSim: Object): void {
    this.selectedSim = selectedSim;
  }

}
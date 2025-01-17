import { TableConfig, TableExportExcelFileService } from './../../../../../shared/services/table-export-excel-file.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Input } from "@angular/core";
import { Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ClipboardService } from 'ngx-clipboard';
// import { TypeTraitement, createButtonStyle } from '../../../data-access/traitement';
import { TranslateService } from '@ngx-translate/core';
import { SupervisionOperationService } from '../../../supervision-operations/data-access/supervision-operation.service';
import { SharedDataService } from '../../../../../shared/services/shared-data.service';
import { TABLE_FACTURE } from '../../../../../shared/data/table';
import { BADGE_ETAT_FACTURE, T_BADGE_ETAT_FACTURE } from '../../../../../shared/constants/badge-etat-facture.contant';

// const INIT_TYPE_TRAITEMENT: TypeTraitement = { module: "facture", approuver: false, prendre: false, creer_taches: false, finaliser: false }
type TYPE_COLOR_ETAT_BADGE = 'badge-warning' | 'badge-dark' | 'badge-success' | 'badge-danger' | 'badge-primary';
type TYPE_ACTION = {data: Object, action: "prendre", view: 'modal'};

@Component({
  selector: `app-table-facture`,
  templateUrl: `./table-facture.component.html`
})

export class TableFactureComponent {

  public readonly BADGE_ETAT_FACTURE = BADGE_ETAT_FACTURE;
  @Input() pagination: any;
  @Input() listFactures: Array<Object> = [];
  @Input() spinner: boolean;
  @Input() selectedFacture: Object = {};
  @Input() userRole: string;
  @Input() startedDay: string;
  // public typeTraitement: TypeTraitement = INIT_TYPE_TRAITEMENT;
  public visibleFormDossier: boolean = false;
  public table: TableConfig = TABLE_FACTURE;

  constructor(public toastrService: ToastrService, private clipboardService: ClipboardService,
    private supervisionOperationService: SupervisionOperationService,
    private sharedDataService: SharedDataService, private loadingBarService: LoadingBarService,
    private tableExportExcelFileService: TableExportExcelFileService, private translate: TranslateService) { }

  public pageCallback() {
    this.sharedDataService.sendComptabiliteFacture();
  }

  public onExportExcel(): void {
    this.tableExportExcelFileService.exportAsExcelFile(this.listFactures, this.table, "liste_dossiers_a_prendre_charge");
  }

  public copyToClipboard(demande: any): void {
    this.toastrService.success("Copié dans le presse papier");
    this.clipboardService.copyFromContent(demande);
  }

  public formatTitle(title: string): string {
    return this.supervisionOperationService.HandleFormatTitle(title);
  }

  public hideDialog(): void {
    this.visibleFormDossier = false;
  }

  getEtatBadge(dossier?: { etat_facture?: T_BADGE_ETAT_FACTURE }): TYPE_COLOR_ETAT_BADGE {
    if (!dossier || !dossier.etat_facture) {
      return 'badge-dark';
    }
  
    const stateMap: Record<T_BADGE_ETAT_FACTURE, TYPE_COLOR_ETAT_BADGE> = {
        [BADGE_ETAT_FACTURE.EN_ATTENTE]: 'badge-dark',
        [BADGE_ETAT_FACTURE.ANNULEE]: 'badge-danger',
        [BADGE_ETAT_FACTURE.EN_COURS]: 'badge-warning',
        [BADGE_ETAT_FACTURE.SOLDEE]: 'badge-success',
        [BADGE_ETAT_FACTURE.NON_SOLDEE]: 'badge-danger',
        [BADGE_ETAT_FACTURE.RATTACHEE]: 'badge-primary',
        [BADGE_ETAT_FACTURE.IMPAYEE]: 'badge-danger',
        [BADGE_ETAT_FACTURE.REJETEE]: 'badge-danger',
        [BADGE_ETAT_FACTURE.REPORTEE]: 'badge-warning',
    };
  
    return stateMap[dossier.etat_facture] || 'badge-dark';
  }

  // public getStyleButtonTraitement(dossier: any): { class: string, icon: string, tooltip: string, typeTraitement: TypeTraitement } {
  //   switch (dossier?.statut) {
  //     case BADGE_ETAPE.SOUMISSION: {
  //       if (dossier?.traitement === BADGE_ETAT.EN_ATTENTE) {
  //         if (this.userRole !== 'superviseur') {
  //           return createButtonStyle('p-button-success', 'pi pi-check-circle', 'Approuver', this.typeTraitement, { approuver: true });
  //         }
  //         return createButtonStyle('p-button-secondary', 'pi pi-eye', 'Détails demande', this.typeTraitement);
  //       }
  //       if (dossier?.traitement === BADGE_ETAT.APPROUVE) {
  //         if (this.userRole === 'superviseur') {
  //           return createButtonStyle('p-button-helf', 'pi pi-tag', 'Prendre en charge', this.typeTraitement, { prendre: true });
  //         }
  //         return createButtonStyle('p-button-success', 'pi pi-check-circle', 'Approuver', this.typeTraitement, { approuver: true });
  //       }
  //     }
  //   }
  //   return createButtonStyle('p-button-secondary', 'pi pi-eye', 'Détails demande', this.typeTraitement);
  // }

  // public onAction(params: TYPE_ACTION): void {
  //   this.onSelectTableDemande(params.data);
  //   if (params.view === 'modal') {
  //     switch (params.action) {
  //       case "voir":
  //           this.OnShowModalTraitement(params.data, params.)
  //           break;
  //       case "prendre":
  //           this.OnShowModalTraitement(params.data)
  //           break;
  //     }
  //   }
  // }

  // OnShowModalTraitement(demande: any, typeTraitement: TypeTraitement): void {
  //   this.onSelectTableDemande(demande);
  //   this.visibleFormDossier = true;
  //   this.typeTraitement = typeTraitement;
  // }

  private onSelectTableDemande(selectedFacture: Object): void {
    this.selectedFacture = selectedFacture;
  }

  public isDisabledActionButton(): boolean {
    return (this.startedDay !== 'démarré' && (this.userRole === 'gestionnaire'));
  }

}
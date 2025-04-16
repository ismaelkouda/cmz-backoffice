import { TableConfig, TableExportExcelFileService } from './../../../../../shared/services/table-export-excel-file.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { EventEmitter, Input, Output } from "@angular/core";
import { Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ClipboardService } from 'ngx-clipboard';
// import { TypeTraitement, createButtonStyle } from '../../../data-access/traitement';
import { TranslateService } from '@ngx-translate/core';
import { SupervisionOperationService } from '../../../supervision-operations/data-access/supervision-operation.service';
import { SharedDataService } from '../../../../../shared/services/shared-data.service';
import { TABLE_FACTURE } from '../../../../../shared/data/table';
import { BADGE_ETAT_FACTURE, T_BADGE_ETAT_FACTURE } from '../../../../../shared/constants/badge-etat-facture.contant';
import { DemandeMasseComponent } from '../../../supervision-operations/feature/demande-masse/demande-masse.component';
import { ModalParams } from '../../../../../shared/constants/modalParams.contant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// const INIT_TYPE_TRAITEMENT: TypeTraitement = { module: "facture", approuver: false, prendre: false, creer_taches: false, finaliser: false }
type TYPE_COLOR_ETAT_BADGE = 'badge-warning' | 'badge-dark' | 'badge-success' | 'badge-danger' | 'badge-primary';
type TYPE_ACTION = { data: Object, action: "prendre", view: 'modal' };
type Action = PageAction | ModalAction;
type PageAction = { data: Object, action: 'détails', view: 'page' } | { data: Object, action: 'facture', view: 'page' };
type ModalAction = { data: Object, action: 'form-dossier', view: 'modal' };
@Component({
  selector: `app-table-facture`,
  templateUrl: `./table-facture.component.html`
})

export class TableFactureComponent {

  public readonly BADGE_ETAT_FACTURE = BADGE_ETAT_FACTURE;
  @Output() interfaceUser = new EventEmitter<PageAction>();
  @Input() pagination: any;
  @Input() listFactures: Array<Object> = [];
  @Input() spinner: boolean;
  @Input() selectedFacture: Object = {};
  @Input() userRole: string;
  @Input() startedDay: string;
  // public typeTreatment: TypeTraitement = INIT_TYPE_TRAITEMENT;
  public visibleFormDossier: boolean = false;
  public table: TableConfig = TABLE_FACTURE;

  constructor(public toastrService: ToastrService, private clipboardService: ClipboardService,
    private supervisionOperationService: SupervisionOperationService, private modalService: NgbModal,
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

  public getColorActionButton(selectedFacture: Object): Object {
    if (!!selectedFacture?.["type_paiement"]) {
      return { style: 'badge-success', value: selectedFacture?.["etat_facture"] };
    } else {
      return { style: 'badge-danger', value: selectedFacture?.["etat_facture"] };
    }
  }

  getStatutBadge(dossier?: { statut?: T_BADGE_ETAT_FACTURE }): TYPE_COLOR_ETAT_BADGE {
    if (!dossier || !dossier.statut) {
      return 'badge-dark';
    }

    const stateMap: Record<T_BADGE_ETAT_FACTURE, TYPE_COLOR_ETAT_BADGE> = {
      [BADGE_ETAT_FACTURE.EN_ATTENTE]: 'badge-dark',
      [BADGE_ETAT_FACTURE.POSTEE]: 'badge-warning',
      [BADGE_ETAT_FACTURE.REPORTEE]: 'badge-primary',
      [BADGE_ETAT_FACTURE.SOLDEE]: 'badge-success',
      [BADGE_ETAT_FACTURE.REJETEE]: 'badge-danger',
    };

    return stateMap[dossier.statut];
  }

  public onAction(params: Action): void {
    this.onSelectTableDemande(params.data);
    switch (params.view) {
      case "page": this.interfaceUser.emit(params); break;
      case "modal": this.onOpenModal(params); break;
    }
  }

  private onOpenModal(params: ModalAction): void {
    if (params.action === "form-dossier") this.OnShowModalTraitement(params.data);
  }
  OnShowModalTraitement(data: any): void {
    let action: string;
    // if (data?.statut === this.BADGE_ETAPE.SOUMISSION && data.traitement === this.BADGE_ETAT.EN_ATTENTE) {
    //   action = "Abandonner";
    // } else {
    //   action = "Identifier";
    // }
    const modalRef = this.modalService.open(DemandeMasseComponent, ModalParams);
    modalRef.componentInstance.params = { vue: data.operation, action: 'voir' };
    modalRef.componentInstance.demande = { ...data, current_date: data?.current_date};
    modalRef.componentInstance.resultTraitement = this.pageCallback();
  }

  // public getStyleButtonTraitement(dossier: any): { class: string, icon: string, tooltip: string, typeTreatment: TypeTraitement } {
  //   switch (dossier?.statut) {
  //     case BADGE_ETAPE.SOUMISSION: {
  //       if (dossier?.traitement === BADGE_ETAT.EN_ATTENTE) {
  //         if (this.userRole !== 'superviseur') {
  //           return createButtonStyle('p-button-success', 'pi pi-check-circle', 'Approuver', this.typeTreatment, { approuver: true });
  //         }
  //         return createButtonStyle('p-button-secondary', 'pi pi-eye', 'Détails demande', this.typeTreatment);
  //       }
  //       if (dossier?.traitement === BADGE_ETAT.APPROUVE) {
  //         if (this.userRole === 'superviseur') {
  //           return createButtonStyle('p-button-helf', 'pi pi-tag', 'Prendre en charge', this.typeTreatment, { prendre: true });
  //         }
  //         return createButtonStyle('p-button-success', 'pi pi-check-circle', 'Approuver', this.typeTreatment, { approuver: true });
  //       }
  //     }
  //   }
  //   return createButtonStyle('p-button-secondary', 'pi pi-eye', 'Détails demande', this.typeTreatment);
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

  // OnShowModalTraitement(demande: any, typeTreatment: TypeTraitement): void {
  //   this.onSelectTableDemande(demande);
  //   this.visibleFormDossier = true;
  //   this.typeTreatment = typeTreatment;
  // }

  private onSelectTableDemande(selectedFacture: Object): void {
    this.selectedFacture = selectedFacture;
  }

  public isDisabledActionButton(): boolean {
    return (this.startedDay !== 'démarré' && (this.userRole === 'gestionnaire'));
  }

}
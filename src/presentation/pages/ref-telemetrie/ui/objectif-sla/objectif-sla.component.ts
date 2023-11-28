import { ExcelService } from './../../../../../shared/services/excel.service';
import { ToastrService } from 'ngx-toastr';
import { TelemetrieService } from './../../data-access/telemetrie.service';
import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/shared/services/setting.service';
@Component({
  selector: 'app-objectif-sla',
  templateUrl: './objectif-sla.component.html',
  styleUrls: ['./objectif-sla.component.scss']
})
export class ObjectifSlaComponent implements OnInit {

  public listObjectifs: Array<any> = [];
  public clonedMetrique: { [s: string]: any } = {};
  public currentMetrique: any;
  public globalMetriquesEditRow: Array<any> = [];
  public currentTabsIndex: number;

  constructor(
    private telemetrieService: TelemetrieService,
    private toastrService: ToastrService,
    private settingService: SettingService,
    private excelService: ExcelService

  ) {
    this.listObjectifs = [
      {
        id: 1,
        nom_service: 'Achat de Services',
        description_service: "Services de traitement des demandes d'activation de P & S",
        delai_akc: 4,
        delai_traitement: 24,
        delai_cloture: 48,
        statut: "actif"
      },
      {
        id: 2,
        nom_service: 'Activation de SIM',
        description_service: "Services d'activation de carte SIM",
        delai_akc: 4,
        delai_traitement: 8,
        delai_cloture: 16,
        statut: "actif"
      },
      {
        id: 3,
        nom_service: 'Changement de SIM',
        description_service: "Services de traitement des demandes de changement de SIM",
        delai_akc: 4,
        delai_traitement: 8,
        delai_cloture: 16,
        statut: "inactif"
      },
      {
        id: 4,
        nom_service: 'Suspension de SIM',
        description_service: "Services de suspensin de carte SIM",
        delai_akc: 4,
        delai_traitement: 8,
        delai_cloture: 16,
        statut: "actif"
      },
      {
        id: 5,
        nom_service: 'Résiliation de SIM',
        description_service: "Services de traitement de résiliation de SIM",
        delai_akc: 8,
        delai_traitement: 16,
        delai_cloture: 24,
        statut: "inactif"
      },
      {
        id: 7,
        nom_service: 'Depot de volume',
        description_service: "Services de provisionning de volume Data",
        delai_akc: 2,
        delai_traitement: 4,
        delai_cloture: 8,
        statut: "actif"
      },
      {
        id: 8,
        nom_service: 'Ligne de credit',
        description_service: "Services de traitement de provisionning de ligne de crédit",
        delai_akc: 4,
        delai_traitement: 8,
        delai_cloture: 16,
        statut: "actif"
      }
    ]
  }

  ngOnInit() {
    //this.GetAllReferentielTelemetrie();
    this.disableAction()
  }

  public GetAllReferentielTelemetrie(): void {
    this.telemetrieService
      .GetAllReferentielTelemetrie({})
      .subscribe({
        next: (response) => {
          this.listObjectifs = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public OnEditOneRowMetrique(item: any) {
    this.currentMetrique = item;
    this.clonedMetrique[item.id] = { ...item };
  }

  public onRowEditMetriqueSave(metrique: any) {
    const currentMetrique = this.clonedMetrique[metrique.id];
    const data = {
      metrique_id: currentMetrique.id,
      ...(metrique.seuil === null ? { seuil: currentMetrique.seuil } : { seuil: metrique.seuil }),
      ...(metrique.statut === null ? { statut: currentMetrique.statut } : { statut: metrique.statut })
    };
    this.globalMetriquesEditRow.push(data);
    this.toastrService.info('Enregistrement en attente !', 'EDITION');
  }
  public onCancelRowMetrique(metrique: any, index: number) {
    this.listObjectifs[index] = this.clonedMetrique[metrique.id];
    delete this.clonedMetrique[metrique.id];
    this.globalMetriquesEditRow.forEach((index) => {
      this.globalMetriquesEditRow.splice(index, 1);
    });
  }

  public handleUpdateReferentielTelemetrie() {
    const data = {
      metriques: [...this.globalMetriquesEditRow],
    };
    this.telemetrieService
      .handleUpdateReferentielTelemetrie(data)
      .subscribe({
        next: (response) => {
          this.GetAllReferentielTelemetrie()
          this.toastrService.success(response.message);
          this.globalMetriquesEditRow = [];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  handleChangeTabviewIndex(e) {
    this.currentTabsIndex = e.index;
    if (this.currentTabsIndex === 1) {
      console.log("data");
      this.settingService.statutSubject.next(true);
    }
  }

  public disableAction(): boolean {
    return this.listObjectifs?.length === 0 ? true : false
  }

  public OnExportExcel(): void {
    const data = this.listObjectifs.map((item: any) => ({
      'Nom Service': item?.nom_service,
      'Description': item?.description_service,
      'ACK (h)': item?.delai_akc,
      'Traitement (h)': item?.delai_traitement,
      'Clôture(h)': item?.delai_cloture,
      'Statut': item?.statut,
      'Date création': item?.created_at
    }));
    this.excelService.exportAsExcelFile(data, 'Liste des Objectifs SLA');
  }
}


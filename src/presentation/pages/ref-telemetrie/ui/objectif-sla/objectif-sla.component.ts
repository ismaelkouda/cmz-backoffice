import { ExcelService } from './../../../../../shared/services/excel.service';
import { ToastrService } from 'ngx-toastr';
import { TelemetrieService } from './../../data-access/telemetrie.service';
import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/shared/services/setting.service';
import { ApplicationType } from 'src/shared/enum/ApplicationType.enum';
import { MappingService } from 'src/shared/services/mapping.service';
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
  public applicationType: string;

  constructor(
    private telemetrieService: TelemetrieService,
    private toastrService: ToastrService,
    private settingService: SettingService,
    private excelService: ExcelService,
    private mappingService: MappingService,

  ) {
    this.applicationType = this.mappingService.applicationType;
    this.listObjectifs = mappingService.listObjectifSla
  }

  ngOnInit() {
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
      'Statut': item?.statut
    }));
    this.excelService.exportAsExcelFile(data, 'Liste des Objectifs SLA');
  }
}


import { ToastrService } from 'ngx-toastr';
import { TelemetrieService } from './../../data-access/telemetrie.service';
import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/shared/services/setting.service';
import { ExcelService } from 'src/shared/services/excel.service';

@Component({
  selector: 'app-seuil-alarmes',
  templateUrl: './seuil-alarmes.component.html',
  styleUrls: ['./seuil-alarmes.component.scss']
})
export class SeuilAlarmesComponent implements OnInit {

  public listTelemetries: Array<any> = [];
  public clonedMetrique: { [s: string]: any } = {};
  public currentMetrique: any;
  public globalMetriquesEditRow: Array<any> = [];
  public currentTabsIndex: number;

  constructor(
    private telemetrieService: TelemetrieService,
    private toastrService: ToastrService,
    private settingService: SettingService,
    private excelService: ExcelService

  ) { }

  ngOnInit() {
    this.GetAllReferentielTelemetrie();
    this.disableAction();
    this.isValidate()
  }

  public GetAllReferentielTelemetrie(): void {
    this.telemetrieService
      .GetAllReferentielTelemetrie({})
      .subscribe({
        next: (response) => {
          this.listTelemetries = response['data'];
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
      ...(metrique.unite === null ? { unite: currentMetrique.unite } : { unite: metrique.unite }),
    };
    const checkValue = metriqueParam => this.globalMetriquesEditRow.some(({ metrique_id }) => metrique_id == metriqueParam);
    if (data?.unite === null) {
      const indexOfItemInArray = this.globalMetriquesEditRow.findIndex(q => q.metrique_id === data.metrique_id);
      this.globalMetriquesEditRow.splice(indexOfItemInArray, 1);
      this.toastrService.warning("Veuillez activez l'alarme ou Configurer l'unité");
      return;
    } else {
      if (checkValue(data.metrique_id) === false) {
        this.globalMetriquesEditRow.push(data);
        this.toastrService.info('Enregistrement en attente !', 'EDITION');
      } else {
        const indexOfItemInArray = this.globalMetriquesEditRow.findIndex(q => q.metrique_id === data.metrique_id);
        this.globalMetriquesEditRow.splice(indexOfItemInArray, 1, data);
      }
    }
  }
  public onCancelRowMetrique(metrique: any, index: number) {
    this.listTelemetries[index] = this.clonedMetrique[metrique.id];
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
    return (this.listTelemetries === undefined || this.listTelemetries?.length === 0) ? true : false
  }
  public OnExportExcel(): void {
    const data = this.listTelemetries.map((item: any) => ({
      'Services': item?.classification,
      'Description': item?.description,
      'Type Mesure': item?.type_mesure,
      'Unité': item?.unite
    }));
    this.excelService.exportAsExcelFile(data, 'Liste des Métriques et Alarmes');
  }
  isValidate(): boolean {
    return (this.globalMetriquesEditRow.length === 0) ? true : false
  }
}

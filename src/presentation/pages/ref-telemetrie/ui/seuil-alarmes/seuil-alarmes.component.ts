import { ToastrService } from 'ngx-toastr';
import { TelemetrieService } from './../../data-access/telemetrie.service';
import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/shared/services/setting.service';

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
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.GetAllReferentielTelemetrie();
    this.disableAction()
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
      ...(metrique.seuil === null ? { seuil: currentMetrique.seuil } : { seuil: metrique.seuil }),
      ...(metrique.statut === null ? { statut: currentMetrique.statut } : { statut: metrique.statut })
    };
    this.globalMetriquesEditRow.push(data);
    this.toastrService.info('Enregistrement en attente !', 'EDITION');
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
    return this.listTelemetries?.length === 0 ? true : false
  }
}


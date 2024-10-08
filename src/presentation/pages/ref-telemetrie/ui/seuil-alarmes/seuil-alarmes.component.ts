import { ToastrService } from 'ngx-toastr';
import { TelemetrieService } from './../../data-access/telemetrie.service';
import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/shared/services/excel.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-seuil-alarmes',
  templateUrl: './seuil-alarmes.component.html',
  styleUrls: ['./seuil-alarmes.component.scss']
})
export class SeuilAlarmesComponent implements OnInit {

  public listTelemetries: Array<any> = [];
  public clonedMetrique: { [s: string]: any } = {};
  public currentMetrique: any;
  public page: number = 0;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public globalMetriquesEditRow: Array<any> = [];
  public currentTabsIndex: number = 0;
  public title = 'Seuil alarmes - Système de Gestion de Collecte Centralisée';
  constructor(
    private telemetrieService: TelemetrieService,
    private toastrService: ToastrService,
    private excelService: ExcelService,
    private titleService: Title
  ) {
    this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit() {
    this.GetAllReferentielTelemetrie();
  }

  public GetAllReferentielTelemetrie(): void {
    this.telemetrieService
      .GetAllReferentielTelemetrie({})
      .subscribe({
        next: (response) => {
          this.listTelemetries = response['data'];
          console.log("indicateur data", response.data);
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.page = response.data?.current_page;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }


  handleChangeTabviewIndex(e) {
    console.log('e', e)
    this.currentTabsIndex = e.index;
  }

}

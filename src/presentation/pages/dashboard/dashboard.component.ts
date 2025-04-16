import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { IStatistiquesBox } from '../../../shared/interfaces/statistiquesBox.interface';
import { EncodingDataService } from '../../../shared/services/encoding-data.service';
import { Observable } from 'rxjs';
import { SimStatut } from '../../../shared/enum/SimStatut.enum';
import { PATRIMONY } from '../../../shared/routes/routes';
import { DashboardApiService } from './data-access/services/dashboard-api.service';
import { SIM_CARD } from '../patrimony/patrimony-routing.module';
import { StoreCurrentUserService } from '../../../shared/services/store-current-user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [`.col-md-3:hover { transform: scale(1.1); }
    .col-md-3 { transition: transform 0.5s; }
    .iframe__constainer {
      margin-top: 10px; appearance: none;
      -webkit-appearance: none; width: 100%;
      border: none; height: 100vh;
    }
  `]
})

export class DashboardComponent implements OnInit {

  public loading: boolean = true;
  public currrentDate: string;
  public nom_tenant: string;
  public title = 'Tableau de bord - Système de Gestion de Collecte Centralisée';
  public listStatisticsBox: Array<IStatistiquesBox> = [];

  simIcon = '../../../assets/svg/sim_loc_noir_white.png';
  totalSimIcon = '../../../assets/svg/sim_loc_noir.svg';
  simNormale = '../../../assets/svg/normal_dark.png';
  simMineure = '../../../assets/svg/mineure.png';
  simMajeure = '../../../assets/svg/majeure_white.png';
  simCrique = '../../../assets/svg/critique_white.png';

  public isMaximized: boolean = false;
  public showIframe: boolean = false;
  public iframeLink: string|undefined;

  public listDashboardStatistic$: Observable<Array<any>>;

  constructor(public router: Router, private titleService: Title,
    private dashboardApiService: DashboardApiService, private storage: EncodingDataService,
    private storeCurrentUserService: StoreCurrentUserService
  ) {
    this.titleService.setTitle(`${this.title}`);
    const currentUser = this.storeCurrentUserService.getCurrentUser;
    this.nom_tenant = currentUser?.tenant.nom_tenant as string;
  }

  ngOnInit() {
    localStorage.setItem('layout', 'Paris');
    this.dashboardApiService.getDashboardStatistic().subscribe(statistic => {
      this.handleSuccessful(statistic)
    })
    this.dashboardApiService.fetchDashboardStatistic();
  }

  public refreshStatic(): void {
    this.dashboardApiService.fetchDashboardStatistic();
  }

  private handleSuccessful(statistic: Object): void {
    this.loading = false;
    this.currrentDate = statistic?.['date_derniere_maj'];
    this.loadingBoxValues(statistic)
  }

  private loadingBoxValues(rapport: Object = {}): void {
    const variables = JSON.parse(this.storage.getData('variables') ?? null)
    this.listStatisticsBox = [
      {
        cardBgColor: '#3498db',
        cardBorderColor: '#FFF',
        legendColor: '#FFF',
        countColor:"#FFF",
        legend: 'Total SIM',
        count: rapport?.['totalSim'] || '0',
        width: "col-md-3",
        icon: this.simIcon,
        routerFilter: () => this.router.navigateByUrl(`${PATRIMONY}/${SIM_CARD}`)
      },
      {
        cardBgColor:"#27ae60",
        cardBorderColor:"#FFF",
        legendColor:"#FFF",
        countColor:"#FFF",
        legend: '# SIM Actives',
        count: rapport?.["totalSimActives"] || '0',
        width: "col-md-3",
        icon: this.simIcon,
        routerFilter: () => this.router.navigateByUrl(`${PATRIMONY}/${SIM_CARD}`, { state: { statut: SimStatut.ACTIF } })
      },
      {
        cardBgColor:"#000000",
        cardBorderColor:"#000000",
        legendColor:"#ff7f50",
        countColor:"#ff7f50",
        legend: '# SIM Suspendues',
        count: rapport?.["totalSimSuspendues"] || '0',
        width: "col-md-3",
        icon: this.simIcon,
        routerFilter: () => this.router.navigateByUrl(`${PATRIMONY}/${SIM_CARD}`, { state: { statut: SimStatut.SUSPENDU } })
      },
      {
        cardBgColor: '#e74c3c',
        cardBorderColor:"#FFF",
        legendColor:"#FFF",
        countColor:"#FFF",
        legend: '# SIM Resiliées',
        count: rapport?.["totalSimResiliees"] || '0',
        width: "col-md-3",
        icon: this.simIcon,
        routerFilter: () => this.router.navigateByUrl(`${PATRIMONY}/${SIM_CARD}`, { state: { statut: SimStatut.RESILIE } })
      },
      {
        cardBgColor: '#FFF',
        cardBorderColor:"#27ae60",
        legendColor:"#27ae60",
        countColor:"#27ae60",
        legend: '# SIM Alarmes Normales',
        count: rapport?.["totalAlarmesNormales"] || '0',
        width: "col-md-3",
        icon: this.simNormale,
        iframeLink: variables?.analyseAlarmeNormales ?? ''
      },
      {
        cardBgColor: '#FFFF00',
        cardBorderColor:"#FFF",
        legendColor:"#130f40",
        countColor:"#130f40",
        legend: '# SIM Alarmes Mineures',
        count: rapport?.["totalAlarmesMineures"] || '0',
        width: "col-md-3",
        icon: this.simMineure,
        iframeLink: variables?.analyseAlarmeMineures ?? ''
      },
      {
        cardBgColor: '#FE9A2E',
        cardBorderColor:"#FFF",
        legendColor:"#FFF",
        countColor:"#FFF",
        legend: '# SIM Alarmes Majeures',
        count: rapport?.["totalAlarmesMajeures"] || '0',
        width: "col-md-3",
        icon: this.simMajeure,
        iframeLink: variables?.analyseAlarmeMajeures ?? ''
      },
      {
        cardBgColor: '#e74c3c',
        cardBorderColor:"#FFF",
        legendColor:"#FFF",
        countColor:"#FFF",
        legend: '# SIM Alarmes Critiques',
        count: rapport?.["totalAlarmesCritiques"] || '0',
        width: "col-md-3",
        icon: this.simCrique,
        iframeLink: variables?.analyseAlarmeCritiques ?? ''
      },
    ];
  }
  public onVisualiserAlarme(statisticsBox: IStatistiquesBox) {
    this.iframeLink = statisticsBox?.iframeLink;
    this.showIframe = true;
    this.onDialogMaximized(true);
  }
  public hideDialog() {
    this.showIframe = false;
  }
  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }
}

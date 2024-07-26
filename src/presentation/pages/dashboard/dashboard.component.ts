import { DashboardService } from './data-access/dashboard.service';
import { CARTES_SIM, ETAT_SOLDE } from './../patrimoine/patrimoine-routing.module';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationType } from 'src/shared/enum/ApplicationType.enum';
import { SimStatut } from 'src/shared/enum/SimStatut.enum';
import { TypeAlarme } from 'src/shared/enum/TypeAlarme.enum';
import { PATRIMOINE, SUPERVISION_OPERATIONS } from 'src/shared/routes/routes';
import { MappingService } from 'src/shared/services/mapping.service';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';
import { SUIVIE_TRAITEMENT_ROUTE } from '../supervision-operations/supervision-operations-routing.module';
import { Title } from '@angular/platform-browser';
import { handle } from 'src/shared/functions/api.function';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [`
    .col-md-3:hover {
      transform: scale(1.1);
    }
    .col-md-3 {
      transition: transform 0.5s;
    }
  `]
})

export class DashboardComponent implements OnInit {

  public dataResponse: any;
  public countTotalSim: number = 0;
  public countSimActive: number = 0;
  public countSimSuspendu: number = 0;
  public countSimResilie: number = 0;
  public countSoumis: number = 0;
  public countTraiter: number = 0;
  public countCloture: number = 0;
  public countAttente: number = 0;

  public countAlarmeNormal: number = 0;
  public countAlarmeMineure: number = 0;
  public countAlarmeMajeure: number = 0;
  public countAlarmeCritique: number = 0;
  public currrentDate: string;
  public baseUrl: string
  public applicationType: string;
  public patrimoineType: string;
  public appName: string;
  public response: any;


  simIcon = '../../../assets/svg/sim_loc_noir_white.png';
  totalSimIcon = '../../../assets/svg/sim_loc_noir.svg';
  simNormale = '../../../assets/svg/normal_dark.png';
  simMineure = '../../../assets/svg/mineure.png';
  simMajeure = '../../../assets/svg/majeure_white.png';
  simCrique = '../../../assets/svg/critique_white.png';
  public title = 'Tableau de bord - Système de Gestion de Collecte Centralisée';

  constructor(public mappingService: MappingService,
    public router: Router, private titleService: Title,
    private dashboardService: DashboardService, private toastrService: ToastrService,
    private loadingBarService: LoadingBarService
  ) {
    this.titleService.setTitle(`${this.title}`);
    this.baseUrl = this.mappingService.baseUrl
    this.applicationType = this.mappingService.applicationType;
    this.appName = this.mappingService.appName
    this.patrimoineType = ApplicationType.PATRIMOINESIM;
  }

  ngOnInit() {
    localStorage.setItem('layout', 'Paris');
    this.onDashboard();
  }

  async onDashboard(): Promise<void> {
    this.response = await handle(() => this.dashboardService.GetDashboardStatistique(), this.toastrService, this.loadingBarService);
    if(this.response) this.handleSuccessful(this.response);
  }
  private handleSuccessful(response: any): void {
    this.dataResponse = response['data'];
    this.countTotalSim = this.dataResponse?.total;
    this.countSimActive = response['data'].actif;
    this.countSimSuspendu = this.dataResponse?.suspendu;
    this.countSimResilie = this.dataResponse?.resilie;
    this.countAlarmeNormal = this.dataResponse?.['alarme_normal'];
    this.countAlarmeMineure = this.dataResponse?.['alarme_mineur'];
    this.countAlarmeMajeure = this.dataResponse?.['alarme_majeur'];
    this.countAlarmeCritique = this.dataResponse?.['alarme_critique'];
    this.countSoumis = this.dataResponse?.['nb_demandes_soumises'];
    this.countTraiter = this.dataResponse?.['nb_demandes_traitees'];
    this.countCloture = this.dataResponse?.['nb_demandes_cloturees'];
    this.countAttente = this.dataResponse?.['nb_demandes_attentes'];
    this.currrentDate = this.dataResponse?.['date_derniere_maj'];
  }
  public OnFilterByLegend(legend: string): void {
    switch (legend) {
      // SIMS FILTER
      case 'Total SIM':
        this.router.navigateByUrl(`${PATRIMOINE}/${CARTES_SIM}`);
        break;
      case 'SIM Actives':
        this.router.navigateByUrl(`${PATRIMOINE}/${CARTES_SIM}`, { state: { statut: SimStatut.ACTIF } });
        break;
      case 'SIM Suspendues':
        this.router.navigateByUrl(`${PATRIMOINE}/${CARTES_SIM}`, { state: { statut: SimStatut.SUSPENDU } });
        break;
      case 'SIM Resiliées':
        this.router.navigateByUrl(`${PATRIMOINE}/${CARTES_SIM}`, { state: { statut: SimStatut.RESILIE } });
        break;

      // SOLDES ETAT SIM  
      case 'SIM Alarmes Normales':
        this.router.navigateByUrl(`${PATRIMOINE}/${ETAT_SOLDE}`, { state: { statut: TypeAlarme.NORMAL } });
        break;
      case 'SIM Alarmes Mineures':
        this.router.navigateByUrl(`${PATRIMOINE}/${ETAT_SOLDE}`, { state: { statut: TypeAlarme.MINEUR } });
        break;
      case 'SIM Alarmes Majeures':
        this.router.navigateByUrl(`${PATRIMOINE}/${ETAT_SOLDE}`, { state: { statut: TypeAlarme.MAJEUR } });
        break;
      case 'SIM Alarmes Critiques':
        this.router.navigateByUrl(`${PATRIMOINE}/${ETAT_SOLDE}`, { state: { statut: TypeAlarme.CRITIQUE } });
        break;

      //DEMANDES  

      case '# Demandes Soumises':
        this.router.navigateByUrl(`${SUPERVISION_OPERATIONS}/${SUIVIE_TRAITEMENT_ROUTE}`);
        break;
      case '# Demandes en Attentes':
        this.router.navigateByUrl(`${SUPERVISION_OPERATIONS}/${SUIVIE_TRAITEMENT_ROUTE}`, { state: { statut: StatutTransaction.SOUMIS, traitement: TraitementTransaction.EN_ENTENTE } });
        break;
      case '# Demandes Traitées':
        this.router.navigateByUrl(`${SUPERVISION_OPERATIONS}/${SUIVIE_TRAITEMENT_ROUTE}`, { state: { statut: StatutTransaction.TARITER } });
        break;
      case '# Demandes Clôturées':
        this.router.navigateByUrl(`${SUPERVISION_OPERATIONS}/${SUIVIE_TRAITEMENT_ROUTE}`, { state: { statut: StatutTransaction.CLOTURER } });
        break;

      default:
        break;
    }
  }

}

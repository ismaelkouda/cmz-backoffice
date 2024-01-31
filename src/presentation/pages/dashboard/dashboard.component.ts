import { CARTES_SIM, ETAT_SOLDE, TRANSACTION_SIM } from './../patrimoine/patrimoine-routing.module';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationType } from 'src/shared/enum/ApplicationType.enum';
import { SimStatut } from 'src/shared/enum/SimStatut.enum';
import { TypeAlarme } from 'src/shared/enum/TypeAlarme.enum';
import { PATRIMOINE } from 'src/shared/routes/routes';
import { MappingService } from 'src/shared/services/mapping.service';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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
  public countCancel: number = 0;

  public countVolumeData: number = 0;
  public countLigneCredit: number = 0;
  public countAlarmeNormal: number = 0;
  public countAlarmeMineure: number = 0;
  public countAlarmeMajeure: number = 0;
  public countAlarmeCritique: number = 0;
  public currrentDate: string;
  public baseUrl: string
  public applicationType: string;
  public patrimoineType: string;
  public appName: string;


  simIcon = '../../../assets/svg/sim_loc_noir_white.png';
  totalSimIcon = '../../../assets/svg/sim_loc_noir.svg';
  simNormale = '../../../assets/svg/normal_dark.png';
  simMineure = '../../../assets/svg/mineure.png';
  simMajeure = '../../../assets/svg/majeure_white.png';
  simCrique = '../../../assets/svg/critique_white.png';
  dataIcon = '../../../assets/svg/data.png';
  creditIcon = '../../../assets/svg/credit.png';


  constructor(
    private htpp: HttpClient,
    public mappingService: MappingService,
    public router: Router
  ) {
    this.baseUrl = this.mappingService.baseUrl
    this.applicationType = this.mappingService.applicationType;
    this.appName = this.mappingService.appName
    this.patrimoineType = ApplicationType.PATRIMOINESIM;
  }

  ngOnInit() {
    localStorage.setItem('layout', 'Paris');
    this.onDashboard();
  }

  onDashboard() {
    this.htpp.get(`${this.baseUrl}dashboard/statistiques`)
      .subscribe({
        next: (res) => {
          this.dataResponse = res['data'];
          this.countTotalSim = this.dataResponse?.total;
          this.countSimActive = res['data'].actif;
          this.countSimSuspendu = this.dataResponse?.suspendu;
          this.countSimResilie = this.dataResponse?.resilie;
          this.countAlarmeNormal = this.dataResponse?.['alarme_normal'];
          this.countAlarmeMineure = this.dataResponse?.['alarme_mineur'];
          this.countAlarmeMajeure = this.dataResponse?.['alarme_majeur'];
          this.countAlarmeCritique = this.dataResponse?.['alarme_critique'];
          this.countSoumis = this.dataResponse?.['nb_demandes_soumises'];
          this.countTraiter = this.dataResponse?.['nb_demandes_traitees'];
          this.countCloture = this.dataResponse?.['nb_demandes_cloturees'];
          this.countCancel = this.dataResponse?.['nb_demandes_abandonnees'];
          this.currrentDate = this.dataResponse?.['date_derniere_maj'];
        },
        error: (error) => {

        }
      })
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

      case '# Demandes en Attentes':
        this.router.navigateByUrl(`${PATRIMOINE}/${TRANSACTION_SIM}`, { state:{ statut: StatutTransaction.SOUMIS,traitement: TraitementTransaction.EN_ENTENTE}});
        break;
      case '# Demandes Traitées':
          this.router.navigateByUrl(`${PATRIMOINE}/${TRANSACTION_SIM}`, { state: { statut: StatutTransaction.TARITER} });
        break;
      case '# Demandes Clôturées':
        this.router.navigateByUrl(`${PATRIMOINE}/${TRANSACTION_SIM}`, { state: { statut: StatutTransaction.CLOTURER } });
        break;  
      case '# Demandes Abandonnées':
        this.router.navigateByUrl(`${PATRIMOINE}/${TRANSACTION_SIM}`, { state: { traitement: TraitementTransaction.ABANDONNER } });
        break;

        default:
        console.warn('Légende non prise en charge');
        break;
    }
  }

}

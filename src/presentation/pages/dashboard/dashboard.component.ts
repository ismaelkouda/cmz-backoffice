import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApplicationType } from 'src/shared/enum/ApplicationType.enum';
import { MappingService } from 'src/shared/services/mapping.service';

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
    public mappingService: MappingService
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

}

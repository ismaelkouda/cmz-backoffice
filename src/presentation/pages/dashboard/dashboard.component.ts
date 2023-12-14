import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApplicationType } from 'src/shared/enum/ApplicationType.enum';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { MappingService } from 'src/shared/services/mapping.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public dataResponse: any;
  public countSimActive: number = 0;
  public countSimInactive: number = 0;
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

  simIcon = '../../../assets/svg/sim_loc_noir_white.png';
  simNormale = '../../../assets/svg/normal_white.png';
  simMineure = '../../../assets/svg/mineure.png';
  simMajeure = '../../../assets/svg/majeure_white.png';
  simCrique = '../../../assets/svg/critique_white.png';


  constructor(
    private storage: EncodingDataService,
    private htpp: HttpClient,
    public mappingService: MappingService
  ) {
    const data = JSON.parse(this.storage.getData('user'))
    this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`
    this.applicationType = this.mappingService.applicationType;
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
          // console.log("resresres", res);
          this.dataResponse = res['data'];
          this.countSimActive = res['data'].actif;
          this.countSimInactive = this.dataResponse?.inactif;
          this.countAlarmeNormal = this.dataResponse?.['alarme_normal'];
          this.countAlarmeMineure = this.dataResponse?.['alarme_mineur'];
          this.countAlarmeMajeure = this.dataResponse?.['alarme_majeur'];
          this.countAlarmeCritique = this.dataResponse?.['alarme_critique'];
          this.currrentDate = this.dataResponse?.['date_derniere_maj'];

          this.countVolumeData = this.dataResponse?.['volume_data'];
          this.countLigneCredit = this.dataResponse?.['ligne_credit'];
        },
        error: (error) => {

        }
      })
  }

}

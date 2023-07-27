import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';


// @ts-ignore
import appConfig from '../../../assets/config/app-config.json';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  simOnline = {
    label: "#SIM Online",
    font: "secondary",
    value: "50",
  };
  simOffline = {
    label: "#SIM Offline",
    font: "secondary",
    value: "100",
  };

  public BASE_URL: any = appConfig.serverUrl;


  dataResponse: any;
  countSimActive: number = 0;
  countSimInactive: number = 0;
  countVolumeData: number = 0;
  countLigneCredit: number = 0;

  constructor(
    private storage: EncodingDataService,
    private htpp: HttpClient
  ) { }

  ngOnInit() {
    localStorage.setItem('layout', 'Paris');
    this.onDashboard();
  }

  onDashboard() {
    this.htpp.get(`${this.BASE_URL}dashboard/statistiques`)
      .subscribe({
        next: (res) => {
          // console.log("resresres", res);
          this.dataResponse = res['data'];
          this.countSimActive = res['data'].actif;
          this.countSimInactive = this.dataResponse?.inactif;
          this.countVolumeData = this.dataResponse?.['volume_data'];
          this.countLigneCredit = this.dataResponse?.['ligne_credit'];
        },
        error: (error) => {

        }
      })
  }

}

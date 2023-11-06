import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';

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

  public dataResponse: any;
  public countSimActive: number = 0;
  public countSimInactive: number = 0;
  public countVolumeData: number = 0;
  public countLigneCredit: number = 0;
  public baseUrl: string

  constructor(
    private storage: EncodingDataService,
    private htpp: HttpClient
  ) {
    const data = JSON.parse(this.storage.getData('user'))
    this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`
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
          this.countVolumeData = this.dataResponse?.['volume_data'];
          this.countLigneCredit = this.dataResponse?.['ligne_credit'];
        },
        error: (error) => {

        }
      })
  }

}

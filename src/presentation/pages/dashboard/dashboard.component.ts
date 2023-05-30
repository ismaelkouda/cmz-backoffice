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
  constructor(
    private storage: EncodingDataService
  ) { }

  ngOnInit() {
    localStorage.setItem('layout', 'Paris');
  }

}

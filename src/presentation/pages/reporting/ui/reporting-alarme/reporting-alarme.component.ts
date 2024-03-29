import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-reporting-alarme',
  templateUrl: './reporting-alarme.component.html',
  standalone: true,
  styleUrls: ['./reporting-alarme.component.scss'],
})
export class ReportingAlarmeComponent implements OnInit {
  public title = 'Reporting alarmes - Système de Gestion de Collecte Centralisée';
  constructor(private titleService: Title) {
    this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit() {
  }

}

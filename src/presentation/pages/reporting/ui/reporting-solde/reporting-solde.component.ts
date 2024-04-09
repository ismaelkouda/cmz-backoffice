import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-reporting-solde',
  templateUrl: './reporting-solde.component.html',
  standalone: true,
  styleUrls: ['./reporting-solde.component.scss'],
})
export class ReportingSoldeComponent implements OnInit {
  public title = 'Reporting soldes - Système de Gestion de Collecte Centralisée';
  constructor(private titleService: Title) {
    this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit() {
  }

}

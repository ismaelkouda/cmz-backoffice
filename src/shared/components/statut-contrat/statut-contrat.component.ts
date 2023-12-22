import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-statut-contrat',
  templateUrl: './statut-contrat.component.html',
  styleUrls: ['./statut-contrat.component.scss']
})
export class StatutContratComponent implements OnInit {

  @Input() statut: any = 'actif';
  @Input() badge: any = '';

  constructor() {}

  ngOnInit() {
    if (this.statut === 'actif') {
      this.badge = 'success';
    } else if (this.statut === 'suspendu') {
      this.badge = 'dark';
    } else if (this.statut === 'resilié') {
      this.badge = 'danger';
    }
  }

}

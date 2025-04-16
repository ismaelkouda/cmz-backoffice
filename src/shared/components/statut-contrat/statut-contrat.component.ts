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
    console.log('this.statut', this.statut)
    switch (this.statut) {
      case 'actif':
      case 'fiable':
        this.badge = 'success';
        break;
    
      case 'suspendu':
        this.badge = 'dark';
        break;

        case 'resilié':
          case 'non-fiable':
        this.badge = 'danger';
        break;
    }
    // if (this.statut === 'actif') {
    //   this.badge = 'success';
    // } else if (this.statut === 'suspendu') {
    //   this.badge = 'dark';
    // } else if (this.statut === 'resilié') {
    //   this.badge = 'danger';
    // }
  }

}

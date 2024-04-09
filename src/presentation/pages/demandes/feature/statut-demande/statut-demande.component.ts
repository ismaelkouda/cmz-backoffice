import { Component, Input, OnInit } from '@angular/core';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';

@Component({
  selector: 'app-statut-demande',
  templateUrl: './statut-demande.component.html',
  styleUrls: ['./statut-demande.component.scss']
})
export class StatutDemandeComponent implements OnInit {

  @Input() statut: any = 'actif';
  @Input() badge: any = '';
  public stateSoumis: string = StatutTransaction.SOUMIS;
  public stateTraite: string = 'en-traitement';
  public stateCloture: string = StatutTransaction.CLOTURER;

  constructor() {}

  ngOnInit() {
    if (this.statut === StatutTransaction.CLOTURER) {
      this.badge = 'success';
    } else if (this.statut === StatutTransaction.SOUMIS) {
      this.badge = 'dark';
    } else if (this.statut === this.stateTraite) {
      this.badge = 'warning';
    }
  }

}

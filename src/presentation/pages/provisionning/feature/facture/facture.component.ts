import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent implements OnInit {

  @Input() currentObjectTwo;
  @Output() factureView = new EventEmitter();
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  public onToBack(): void {
    this.factureView.emit(false);
  }

  public close(): void {
    this.factureView.emit({ statut: false, type: 'fermer' });
  }
  public onValidate() {

  }
}

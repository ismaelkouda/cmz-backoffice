import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sites-wrapper',
  templateUrl: './sites-wrapper.component.html',
  styleUrls: ['./sites-wrapper.component.scss']
})
export class SitesWrapperComponent implements OnInit {

  @Input() currentObject;
  @Output() formsView = new EventEmitter();
  currentFirstLevel: any;
  currentSecondLevel: any;

  constructor() { }

  ngOnInit() {
    this.currentFirstLevel = this.currentObject.departement?.libelle;
    this.currentSecondLevel = this.currentObject.commune?.libelle;
  }
  public close(): void {
    this.formsView.emit(false);
  }
}

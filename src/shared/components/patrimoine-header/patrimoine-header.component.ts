import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-patrimoine-header',
  templateUrl: './patrimoine-header.component.html',
  styleUrls: ['./patrimoine-header.component.scss']
})
export class PatrimoineHeaderComponent implements OnInit {

  @Input() count: [];
  @Input() legende: string;
  @Input() total: number;
  @Input() showDate: boolean = false;
  @Input() showListe: boolean = true;
  @Input() showTotal: boolean = true;
  currentDate: string

  constructor() {

    const dateActuelle = moment();
    this.currentDate = dateActuelle.format('DD/MM/YYYY HH:mm:ss');
  }

  ngOnInit() {
    this.count
    console.log('this.count', this.count)
  }

}

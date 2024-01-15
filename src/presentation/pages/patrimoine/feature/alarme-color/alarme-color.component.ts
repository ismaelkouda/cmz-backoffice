import { Component, Input, OnInit } from '@angular/core';
import { TypeAlarme } from 'src/shared/enum/TypeAlarme.enum';

@Component({
  selector: 'app-alarme-color',
  templateUrl: './alarme-color.component.html',
  styleUrls: ['./alarme-color.component.scss']
})
export class AlarmeColorComponent implements OnInit {

  @Input() alarme: any;
  public alarmeNormale: string = TypeAlarme.NORMAL
  public alarmeMineure: string = TypeAlarme.MINEUR
  public alarmeMajeure: string = TypeAlarme.MAJEUR
  public alarmeCritique: string = TypeAlarme.CRITIQUE

  constructor() { }

  ngOnInit() {
  }

}

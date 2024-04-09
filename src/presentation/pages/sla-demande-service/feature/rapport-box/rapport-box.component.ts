import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rapport-box',
  templateUrl: './rapport-box.component.html',
  styleUrls: ['./rapport-box.component.scss']
})
export class RapportBoxComponent implements OnInit {

  @Input() cardBgColor: any;
  @Input() cardBorderColor: any;
  @Input() legendColor: any;
  @Input() countColor: any;
  @Input() legend: string;
  @Input() count: any;
  @Input() taux: any;
  @Input() icon: any;


  constructor() { }

  ngOnInit(): void {
  }

  pipeValue(number: any) {
    return new Intl.NumberFormat('fr-FR').format(number);
  }
}

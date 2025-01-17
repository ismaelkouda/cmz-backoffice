import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-box-container',
  templateUrl: './box-container.component.html',
  styleUrls: ['./box-container.component.scss']
})
export class BoxContainerComponent {
  @Input() cardBgColor: any;
  @Input() cardBorderColor: any;
  @Input() legendColor: any;
  @Input() countColor: any;
  @Input() legend: string;
  @Input() count: any;
  @Input() taux: any;
  @Input() icon: any;
  pipeValue(number: any) {
    return new Intl.NumberFormat("fr-FR").format(number);
  }
}

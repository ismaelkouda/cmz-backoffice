import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-statistique-box',
    templateUrl: './statistique-box.component.html',
    styleUrls: ['./statistique-box.component.scss'],
})
export class StatistiqueBoxComponent {
    @Input() cardBgColor: any;
    @Input() cardBorderColor: string;
    @Input() legendColor: any;
    @Input() countColor: any;
    @Input() legend: string;
    @Input() count: any;
    @Input() taux: any;
    @Input() icon: any;

    pipeValue(number: any) {
        return new Intl.NumberFormat('fr-FR').format(number);
    }
}

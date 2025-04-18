import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-message-box',
    templateUrl: './message-box.component.html',
    styleUrls: ['./message-box.component.scss'],
})
export class MessageBoxComponent implements OnInit {
    @Input() cardBgColor: any;
    @Input() cardBorderColor: any;
    @Input() legendColor: any;
    @Input() countColor: any;
    @Input() legend: string;
    @Input() count: any;
    @Input() taux: any;
    @Input() icon: any;

    constructor() {}

    ngOnInit(): void {}

    pipeValue(number: any) {
        return new Intl.NumberFormat('fr-FR').format(number);
    }
}

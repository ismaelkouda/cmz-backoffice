import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-card-stock',
    templateUrl: './card-stock.component.html',
    styleUrls: ['./card-stock.component.scss'],
})
export class CardStockComponent implements OnInit {
    @Input() cardBgColor: any;
    @Input() cardBorderColor: any;
    @Input() legendColor: any;
    @Input() countColor: any;
    @Input() legend: string;
    @Input() count: any;

    constructor() {}

    ngOnInit(): void {}

    pipeValue(number: any) {
        return new Intl.NumberFormat('fr-FR').format(number);
    }
}

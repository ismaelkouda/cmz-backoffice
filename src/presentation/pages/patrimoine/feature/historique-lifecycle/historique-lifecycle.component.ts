import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-historique-lifecycle',
    templateUrl: './historique-lifecycle.component.html',
    styleUrls: ['./historique-lifecycle.component.scss'],
})
export class HistoriqueLifecycleComponent implements OnInit {
    @Input() currentEvent: any;
    @Input() maxi: boolean;

    constructor() {}

    ngOnInit() {}
}

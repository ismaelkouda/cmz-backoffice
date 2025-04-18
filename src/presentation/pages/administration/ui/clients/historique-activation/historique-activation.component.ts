import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-historique-activation',
    templateUrl: './historique-activation.component.html',
    styleUrls: ['./historique-activation.component.scss'],
})
export class HistoriqueActivationComponent implements OnInit {
    public module: string;
    public subModule: string;
    public initialView: boolean = true;
    public formsView: boolean = false;
    public currentObject: any;
    public listHistoriques: Array<any> = [];
    public totalPage: 0;
    public totalRecords: 0;
    public recordsPerPage: 0;
    public offset: any;
    public p: number = 1;
    public filterDateStart: Date;
    public filterDateEnd: Date;
    public selectDateStart: any;
    public selectDateEnd: any;
    public title =
        'Historique activations - Système de Gestion de Collecte Centralisée';
    constructor(private route: ActivatedRoute, private titleService: Title) {
        this.titleService.setTitle(`${this.title}`);
    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[5];
        });
    }

    changeDateStart(e) {
        this.selectDateStart = moment(this.filterDateStart).format(
            'YYYY-MM-DD'
        );
    }
    changeDateEnd(e) {
        this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
    }
}

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { EncodingDataService } from '../../../../../shared/services/encoding-data.service';
@Component({
    selector: 'app-dashboard-demands',
    templateUrl: './dashboard-demands.component.html',
    styleUrls: ['./dashboard-demands.component.scss'],
})
export class DashboardDemandsComponent implements OnInit {
    public module: string;
    public subModule: string;
    public isMaximized: boolean = false;
    public showIframe: boolean = false;
    public visualUrl: string;
    public title = 'Dashboard SLA - Système de Gestion de Collecte Centralisée';

    constructor(
        private activatedRoute: ActivatedRoute,
        private encodingService: EncodingDataService,
        private titleService: Title
    ) {
        this.visualUrl =
            this.encodingService.getData('dashboard_links')?.[
                'dashboardDemandes'
            ];
        this.titleService.setTitle(`${this.title}`);
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.onSeeStatics();
    }

    public onSeeStatics() {
        this.showIframe = true;
        this.onDialogMaximized(true);
    }

    public hideDialog() {
        this.showIframe = false;
    }

    public onDialogMaximized(event) {
        event.maximized
            ? (this.isMaximized = true)
            : (this.isMaximized = false);
    }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EncodingDataService } from '../../../../../shared/services/encoding-data.service';

@Component({
    selector: 'app-detection-appro-sms',
    templateUrl: './detection-appro-sms.component.html',
    styleUrls: ['./detection-appro-sms.component.scss'],
})
export class DetectionApproSmsComponent implements OnInit {
    public module: string;
    public subModule: string;
    public isMaximized: boolean = false;
    public showIframe: boolean = false;
    public visualUrl: string;
    public title =
        'Détection appro sms - Système de Gestion de Collecte Centralisée';

    constructor(
        private activatedRoute: ActivatedRoute,
        private encodingService: EncodingDataService,
        private titleService: Title
    ) {
        this.titleService.setTitle(`${this.title}`);
        this.visualUrl =
            this.encodingService.getData('dashboard_links')?.[
                'dashboardApproSms'
            ];
        // this.visualUrl = JSON.parse(
        //     this.storage.getData('variables')
        // ).dashboardAppro;
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[3];
        });
        this.onSeeStatics();
    }

    public onSeeStatics() {
        this.showIframe = true;
        this.onDialogMaximized(true);
    }

    public hideDialog() {
        // this.router.navigateByUrl('/zone-trafic/zone-exploitation')
        this.showIframe = false;
    }

    public onDialogMaximized(event) {
        event.maximized
            ? (this.isMaximized = true)
            : (this.isMaximized = false);
    }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MappingService } from '../../../../../shared/services/mapping.service';
import { EncodingDataService } from '../../../../../shared/services/encoding-data.service';

@Component({
    selector: 'app-detection-appro',
    templateUrl: './detection-appro.component.html',
    styleUrls: ['./detection-appro.component.scss'],
})
export class DetectionApproComponent implements OnInit {
    public module: string;
    public subModule: string;
    public isMaximized: boolean = false;
    public showIframe: boolean = false;
    public visualUrl: string;
    public title =
        'Détection appro - Système de Gestion de Collecte Centralisée';

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private encodingService: EncodingDataService,
        private titleService: Title
    ) {
        this.titleService.setTitle(`${this.title}`);
        // this.visualUrl = JSON.parse(
        //     this.encodingService.getData('variables')
        // ).dashboardApproData;
        this.visualUrl =
            this.encodingService.getData('dashboard_links')?.['dashboardAppro'];
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[2];
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

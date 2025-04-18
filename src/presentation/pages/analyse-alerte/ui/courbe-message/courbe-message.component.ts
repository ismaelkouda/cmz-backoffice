import { MappingService } from './../../../../../shared/services/mapping.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EncodingDataService } from '../../../../../shared/services/encoding-data.service';
@Component({
    selector: 'app-courbe-message',
    templateUrl: './courbe-message.component.html',
    styleUrls: ['./courbe-message.component.scss'],
})
export class CourbeMessageComponent implements OnInit {
    public module: string;
    public subModule: string;
    public isMaximized: boolean = false;
    public showIframe: boolean = false;
    public visualUrl: string;
    public title =
        'Courbe message - Système de Gestion de Collecte Centralisée';
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private storage: EncodingDataService,
        private titleService: Title
    ) {
        this.visualUrl = JSON.parse(
            this.storage.getData('variables')
        ).dashboardGrafana;
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
        // this.router.navigateByUrl('/zone-trafic/zone-exploitation')
        this.showIframe = false;
    }

    public onDialogMaximized(event) {
        event.maximized
            ? (this.isMaximized = true)
            : (this.isMaximized = false);
    }
}

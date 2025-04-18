import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RAPPORT_CONFORMITE } from '../../sla-demande-service-routing.module';
import { SLA_DEMANDE_SERVICE } from 'src/shared/routes/routes';
import { MappingService } from 'src/shared/services/mapping.service';
import { Title } from '@angular/platform-browser';
@Component({
    selector: 'app-dashboard-sla',
    templateUrl: './dashboard-sla.component.html',
    styleUrls: ['./dashboard-sla.component.scss'],
})
export class DashboardSlaComponent implements OnInit {
    public isMaximized: boolean = false;
    public showIframe: boolean = false;
    public visualUrl: string;
    public title = 'Dashboard SLA - Système de Gestion de Collecte Centralisée';

    constructor(
        private router: Router,
        private mappingService: MappingService,
        private titleService: Title
    ) {
        this.titleService.setTitle(`${this.title}`);
        this.visualUrl = this.mappingService.dashbordTransactionSLa;
        this.showIframe = true;
    }

    ngOnInit() {
        this.onVisualiserAlarme();
    }

    public onVisualiserAlarme() {
        this.showIframe = true;
        this.onDialogMaximized(true);
    }

    public hideDialog() {
        this.router.navigateByUrl(
            `/${SLA_DEMANDE_SERVICE}/${RAPPORT_CONFORMITE}`
        );
    }

    public onDialogMaximized(event) {
        event.maximized
            ? (this.isMaximized = true)
            : (this.isMaximized = false);
    }
}

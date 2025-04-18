import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-reporting-sla',
    templateUrl: './reporting-sla.component.html',
    standalone: true,
    styleUrls: ['./reporting-sla.component.scss'],
})
export class ReportingSlaComponent implements OnInit {
    public title = 'Reporting SLA - Système de Gestion de Collecte Centralisée';
    constructor(private titleService: Title) {
        this.titleService.setTitle(`${this.title}`);
    }

    ngOnInit() {}
}

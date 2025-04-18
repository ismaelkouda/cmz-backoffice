import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-data-polling',
    templateUrl: './data-polling.component.html',
    standalone: true,
    styleUrls: ['./data-polling.component.scss'],
})
export class DataPollingComponent {
    public title = 'Data polling - Système de Gestion de Collecte Centralisée';
    constructor(private titleService: Title) {
        this.titleService.setTitle(`${this.title}`);
    }
}

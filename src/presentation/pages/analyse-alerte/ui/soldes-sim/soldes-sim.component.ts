import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-soldes-sim',
    templateUrl: './soldes-sim.component.html',
    styleUrls: ['./soldes-sim.component.scss'],
})
export class SoldesSimComponent implements OnInit {
    public title = 'Soldes SIM - Système de Gestion de Collecte Centralisée';

    constructor(private titleService: Title) {
        this.titleService.setTitle(`${this.title}`);
    }

    ngOnInit() {}
}

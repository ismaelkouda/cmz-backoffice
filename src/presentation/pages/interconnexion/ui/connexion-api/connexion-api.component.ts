import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-connexion-api',
    templateUrl: './connexion-api.component.html',
    styleUrls: ['./connexion-api.component.scss'],
})
export class ConnexionApiComponent implements OnInit {
    public initialView: boolean = true;
    public formsView: boolean = false;
    public currentObject: any;
    public title = 'Connexion API - Système de Gestion de Collecte Centralisée';
    constructor(private titleService: Title) {
        this.titleService.setTitle(`${this.title}`);
    }

    ngOnInit() {}

    public onInitForm(): void {
        this.initialView = false;
        this.formsView = true;
        this.currentObject = undefined;
    }
    public pushStatutView(event: boolean): void {
        this.formsView = event;
        this.initialView = !event;
    }
}

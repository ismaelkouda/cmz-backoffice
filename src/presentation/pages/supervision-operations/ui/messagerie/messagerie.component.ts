import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-messagerie',
    templateUrl: './messagerie.component.html',
    styleUrls: ['./messagerie.component.scss'],
})
export class MessagerieComponent implements OnInit {
    public module: string;
    public subModule: string;
    public rapport: any;
    public initialView: boolean = true;
    public formsView: boolean = false;
    public currentObject: any;
    public currentTabsIndex: number = 0;
    public title = 'Messagerie - Système de Gestion de Collecte Centralisée';

    constructor(
        private titleService: Title,
        private activatedRoute: ActivatedRoute
    ) {
        this.titleService.setTitle(`${this.title}`);
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[4];
        });
        if (!this.formsView) {
            this.currentTabsIndex = 0;
        }
    }

    public onInitForm(): void {
        this.initialView = false;
        this.formsView = true;
    }
    handleChangeTabviewIndex(e) {
        this.currentTabsIndex = e.index;
        for (const key in this.rapport) {
            if (this.rapport.hasOwnProperty(key)) {
                this.rapport[key] = '0';
            }
        }
    }
    public OnPushRapport(event: any): void {
        this.rapport = event;
    }

    public pushStatutView(event: boolean): void {
        if (event === false) {
            this.currentTabsIndex = 0;
        }
        this.formsView = event;
        this.initialView = !event;
    }
    public pushCurrentObject(event: any): void {
        this.currentObject = event;
    }
}

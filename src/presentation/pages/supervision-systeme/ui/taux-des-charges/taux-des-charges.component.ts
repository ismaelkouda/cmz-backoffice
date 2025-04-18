import { Component, OnInit } from '@angular/core';
import { SupervisionSystemeService } from '../../data-access/supervision-systeme.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-taux-des-charges',
    templateUrl: './taux-des-charges.component.html',
    styleUrls: ['./taux-des-charges.component.scss'],
})
export class TauxDesChargesComponent implements OnInit {
    listeTaux: Array<any> = [];
    showIframe: boolean = false;
    url: string;
    nom: any;
    public title =
        'Taux des charges - Système de Gestion de Collecte Centralisée';

    constructor(
        private supervisionSystemeService: SupervisionSystemeService,
        private toastrService: ToastrService,
        private titleService: Title
    ) {
        this.titleService.setTitle(`${this.title}`);
    }

    ngOnInit() {
        this.GetAllTauxCharges();
    }

    public GetAllTauxCharges() {
        this.supervisionSystemeService.GetAllTauxCharges({}).subscribe({
            next: (response) => {
                this.listeTaux = response['data'];
            },
            error: (error) => {
                this.toastrService.error(error.message);
            },
        });
    }

    visualiser(url: string, nom: string): void {
        this.url = url;
        this.showIframe = true;
        this.nom = nom;
    }
}

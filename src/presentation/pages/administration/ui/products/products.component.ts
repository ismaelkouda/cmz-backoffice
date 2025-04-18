import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
    public title = 'Produits - Système de Gestion de Collecte Centralisée';

    constructor(private titleService: Title) {
        this.titleService.setTitle(`${this.title}`);
    }

    ngOnInit() {}
}

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-point-ventes',
  templateUrl: './point-ventes.component.html',
  styleUrls: ['./point-ventes.component.scss']
})
export class PointVentesComponent implements OnInit {
  public title = 'Points de ventes - Système de Gestion de Collecte Centralisée';

  constructor(private titleService: Title) {
    this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit() {
  }

}

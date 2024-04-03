import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MappingService } from 'src/shared/services/mapping.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-analyse-rejet',
  templateUrl: './analyse-rejet.component.html',
  styleUrls: ['./analyse-rejet.component.scss']
})
export class AnalyseRejetComponent implements OnInit {

  public isMaximized: boolean = false;
  public showIframe: boolean = false;
  public visualUrl: string;
  public title = 'Analyse rejet - Système de Gestion de Collecte Centralisée';

  constructor(
    private router: Router,
    private mappingService: MappingService,
    private titleService: Title
  ) {
    this.visualUrl = this.mappingService.rejetLink;
    this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit() {
    this.onVisualiserAlarme();
  }

  public onVisualiserAlarme() {
    this.showIframe = true;
    this.onDialogMaximized(true);
  }

  public hideDialog() {
    this.router.navigateByUrl('/zone-trafic/zone-exploitation')
  }

  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }

}

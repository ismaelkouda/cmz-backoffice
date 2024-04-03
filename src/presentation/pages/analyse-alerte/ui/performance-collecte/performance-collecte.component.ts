import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MappingService } from 'src/shared/services/mapping.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-performance-collecte',
  templateUrl: './performance-collecte.component.html',
  styleUrls: ['./performance-collecte.component.scss']
})
export class PerformanceCollecteComponent implements OnInit {

  public isMaximized: boolean = false;
  public showIframe: boolean = false;
  public visualUrl: string;
  public title = 'Performance collecte - Système de Gestion de Collecte Centralisée';
  constructor(
    private router: Router,
    private titleService: Title,
    private mappingService: MappingService
  ) {
    this.visualUrl = this.mappingService.approLink;
    this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit() {
    this.onVisualiserTrafic();
  }


  public onVisualiserTrafic() {
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MappingService } from 'src/shared/services/mapping.service';
@Component({
  selector: 'app-courbe-message',
  templateUrl: './courbe-message.component.html',
  styleUrls: ['./courbe-message.component.scss']
})
export class CourbeMessageComponent implements OnInit {

  public isMaximized: boolean = false;
  public showIframe: boolean = false;
  public visualUrl: string;
  public grafanaLink: string;


  constructor(
    private router: Router,
    private mappingService: MappingService
  ) {
    this.visualUrl = this.mappingService.grafanaLink;
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

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
  ) { }

  ngOnInit() {
    this.onVisualiserAlarme();
  }

  public onVisualiserAlarme() {
    this.showIframe = true;
    this.onDialogMaximized(true);
    this.visualUrl = "http://160.120.143.6:50300/d/fUHASnXVk/tb-analyse-des-alarmes-actives?orgId=1&refresh=10m"
  }

  public hideDialog() {
    this.router.navigateByUrl('/zone-trafic/zone-exploitation')
  }

  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }

}

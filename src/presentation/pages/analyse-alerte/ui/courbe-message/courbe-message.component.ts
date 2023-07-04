import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Dialog } from 'primeng/dialog';
import { SettingService } from 'src/shared/services/setting.service';

@Component({
  selector: 'app-courbe-message',
  templateUrl: './courbe-message.component.html',
  styleUrls: ['./courbe-message.component.scss']
})
export class CourbeMessageComponent implements OnInit {

  public isMaximized: boolean = false;
  public showIframe: boolean = false;
  public visualUrl: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.onVisualiserAlarme();
  }

  public onVisualiserAlarme() {
    this.showIframe = true;
    this.onDialogMaximized(true);
    this.visualUrl = "http://10.10.10.93:50200/d/fUHASnXVk/tb-analyse-des-alarmes-actives?orgId=1&refresh=10m"
  }

  public hideDialog() {
    this.router.navigateByUrl('/zone-trafic/zone-exploitation')
  }

  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }

}

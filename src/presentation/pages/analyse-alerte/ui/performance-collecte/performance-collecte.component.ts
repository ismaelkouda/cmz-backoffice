import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-performance-collecte',
  templateUrl: './performance-collecte.component.html',
  styleUrls: ['./performance-collecte.component.scss']
})
export class PerformanceCollecteComponent implements OnInit {

  public isMaximized: boolean = false;
  public showIframe: boolean = false;
  public visualUrl: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {

    this.onVisualiserTrafic();

  }


  public onVisualiserTrafic() {
    this.showIframe = true;
    this.onDialogMaximized(true);
    this.visualUrl = "http://10.10.10.83:3000/d/106TI5w4k/tb-analyse-du-trafic-par-sim-orange?orgId=1&from=now-6h&to=now&var-zone=a&var-apn=cie"
  }

  public hideDialog() {
    this.router.navigateByUrl('/zone-trafic/zone-exploitation')
  }

  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }

}

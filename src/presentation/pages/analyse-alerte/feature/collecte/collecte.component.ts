import { SettingService } from 'src/shared/services/setting.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { COURBE_MESSAGE, ETAT_LIAISON, PERFORMANCE_COLLECTE } from '../../analyse-alerte-routing.module';

// @ts-ignore
import appConfig from '../../../../../assets/config/app-config.json';
import { EndPointUrl } from '../../data-access/api.enum';
import { SUPERVISION_SIM } from 'src/shared/routes/routes';

@Component({
  selector: 'app-collecte',
  templateUrl: './collecte.component.html',
  styleUrls: ['./collecte.component.scss']
})
export class CollecteComponent implements OnInit {

  public BASE_URL: any = appConfig.serverUrl;
  public listFluxCollecte: any[] = [];
  public listDirectionRegionales: Array<any> = [];
  public listExploitations: Array<any> = [];
  public showIframe: boolean = false;
  public current: string;
  public title: string;
  public visualUrl: string;
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedSim: any;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;


  readonly SUPERVISION_SIM = SUPERVISION_SIM;
  readonly PERFORMANCE_COLLECTE = PERFORMANCE_COLLECTE;
  readonly COURBE_MESSAGE = COURBE_MESSAGE;
  readonly ETAT_LIAISON = ETAT_LIAISON;


  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private router: Router,
    private settingService: SettingService
  ) {
  }

  ngOnInit() {
    this.onGetAllFluxCollecte();
    this.getAllDirectionRegionales();
    this.isFilter();
    this.disableAction();
    this.dialogHeader(this.router.url);

  }

  public onGetAllFluxCollecte() {
    let baseUrl;
    if (this.router.url === `/${SUPERVISION_SIM}/${PERFORMANCE_COLLECTE}`) {
      baseUrl = `${this.BASE_URL}${EndPointUrl.PERFORMANCES_COLLECTE}`
    } else if (this.router.url === `/${SUPERVISION_SIM}/${COURBE_MESSAGE}`) {
      baseUrl = `${this.BASE_URL}${EndPointUrl.PERFORMANCES_COLLECTE}`
    } else if (this.router.url === `/${SUPERVISION_SIM}/${ETAT_LIAISON}`) {
      baseUrl = `${this.BASE_URL}${EndPointUrl.ANALYSE_ALERTES}`
    }
    this.http.post(`${baseUrl}?page=${this.p}`, {})
      .subscribe({
        next: (response: any) => {
          this.listFluxCollecte = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public onPageChange(event) {
    this.p = event;
    this.onGetAllFluxCollecte()
  }

  public onFilter() {
    let baseUrl;
    if (this.router.url === `/${SUPERVISION_SIM}/${PERFORMANCE_COLLECTE}`) {
      baseUrl = `${this.BASE_URL}${EndPointUrl.PERFORMANCES_COLLECTE}`
    } else if (this.router.url === `/${SUPERVISION_SIM}/${COURBE_MESSAGE}`) {
      baseUrl = `${this.BASE_URL}${EndPointUrl.PERFORMANCES_COLLECTE}`
    } else if (this.router.url === `/${SUPERVISION_SIM}/${ETAT_LIAISON}`) {
      baseUrl = `${this.BASE_URL}${EndPointUrl.ANALYSE_ALERTES}`
    }
    this.http.post(`${baseUrl}?page=1`, {
      niveau_un_id: this.selectedDirection?.id,
      exploitation: this.selectedExploitation?.code,
      msisdn: this.selectedSim
    })
      .subscribe({
        next: (response: any) => {
          this.listFluxCollecte = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public getAllDirectionRegionales(): void {
    this.settingService
      .getAllDirectionRegionales({})
      .subscribe({
        next: (response) => {
          this.listDirectionRegionales = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.message)
        }
      })
  }
  public onVisualiserAlarme(data) {
    //2250788856624
    //this.visualUrl = `http://10.10.10.83:3000/d/cs8d-C8Vk/tb-analyse-des-alarmes-data-tracking?orgId=1&refresh=15m&from=now-1h&to=now&var-zone=&var-number=${data.msisdn}&var-apni=`
    //this.visualUrl = `http://10.10.10.83:3000`
    this.dialogHeader(this.router.url);
    this.showIframe = true;
    this.visualUrl = "http://10.10.10.93:30031/d/fUHASnXVk/tb-analyse-des-alarmes-actives?orgId=1"
  }
  public onVisualiserTrafic(data) {
    //2250788856624
    this.visualUrl = `http://10.10.10.83:3000/d/106TI5w4k/tb-analyse-du-trafic-par-sim-orange?orgId=1&from=now-6h&to=now&var-zone=a&var-number=${data.msisdn}&var-apn=cie`
    //this.visualUrl = `http://10.10.10.83:3000`
    this.dialogHeader(this.router.url);
    this.showIframe = true;
  }
  dialogHeader(link) {
    switch (link) {
      case `/${SUPERVISION_SIM}/${PERFORMANCE_COLLECTE}`:
        this.title = 'Analyses du trafic'
        break;
      case `/${SUPERVISION_SIM}/${COURBE_MESSAGE}`:
        this.title = 'Analyses Alarmes'
        break
      case `/${SUPERVISION_SIM}/${ETAT_LIAISON}`:
        this.title = 'Statuts des Services'
    }
  }


  public onChangeItem(event: any) {
    this.selectedDirection = event.value;
    this.listExploitations = this.selectedDirection?.niveaux_deux.map(element => {
      return { ...element, fullName: `${element.nom} [${element.code}]` }
    });
  }
  isFilter(): boolean {
    return (!this.selectedDirection && !this.selectedSim) ? true : false
  }

  public disableAction(): boolean {
    return this.listFluxCollecte?.length === 0 ? true : false
  }
}



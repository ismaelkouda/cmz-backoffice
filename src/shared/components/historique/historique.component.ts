import { SettingService } from './../../services/setting.service';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss']
})
export class HistoriqueComponent implements OnInit {

  @Input() module: string;
  @Input() sous_module: string;
  @Input() modele: string;
  @Input() modele_id: any

  public listUsers: Array<any> = [];
  public exportList: Array<any> = [];
  public listHistoriques: Array<any> = [];
  public currentEventParseBeforeKeys: Array<any> = [];
  public currentEventParseBeforeValues: Array<any> = [];
  public currentEventParseAfterValues: Array<any> = [];
  public currentEventParseAfter: Array<any> = [];
  public filterDateStart: Date;
  public filterDateEnd: Date;
  public selectDateStart: any;
  public selectDateEnd: any;
  public currentUser: any;
  public currentEvent: any;
  public currentEventParse;
  public display: boolean = false;
  public isMaximized: boolean = false;


  constructor(
    private loadingBar: LoadingBarService,
    private toastService: ToastrService,
    private settingService: SettingService
  ) {
    this.filterDateStart = new Date();
    this.filterDateEnd = new Date();
  }

  ngOnInit(): void {
    this.getAllUsers();
    //this.refreshHistorique()
    this.getAllHistoriques()
  }

  showHistorique(data: any) {
    if (data?.event === 'Mise à jour') {
      this.currentEventParse = JSON.parse(data?.data);    
      Object.values(this.currentEventParse?.before).map((value, i) => {
        this.currentEventParseBeforeValues.push(value);
        this.currentEventParseBeforeKeys.push(Object.keys(this.currentEventParse?.before)[i]);
        this.currentEventParseAfter.push(Object.values(this.currentEventParse?.after)[i]);
        this.currentEventParseAfterValues = this.currentEventParseAfter.map((item, index) => {
          if (item === this.currentEventParseBeforeValues[index]) {
            return { item, isIdentique: true }
          } else {
            return { item, isIdentique: false }
          }
        });
      });
    }
    this.display = true;
    this.currentEvent = data;
  }
  getAllUsers() {
    this.loadingBar.start();
    this.settingService
      .getAllUsers({})
      .subscribe(
        (response: any) => {
          const users = response['data'];
          this.listUsers = users.map((el) => {
            const data = { ...el, fullName: el.nom + ' ' + el.prenoms };
            return data;
          });
          this.loadingBar.stop();
        },
        (error) => {
          this.loadingBar.stop();
          this.toastService.error(error.error.message);
        }
      );

  }
  getAllHistoriques() {
    const data = {
      module: this.module,
      sous_module: this.sous_module,
      modele: this.modele,
      date_debut: this.selectDateStart,
      date_fin: this.selectDateEnd,
      modele_id: this.modele_id,
      user_id: this.currentUser?.id,
    };
    this.settingService.
      getHistoriques(data)
      .subscribe(
        (response: any) => {
          this.listHistoriques = response['data'];
          this.exportList = this.listHistoriques.map((el) => {
            const data = {
              SourceUtilisteur: el.ip + '[' + el.nom + ' ' + el.prenoms + ']',
              Module: el.module,
              sousModule: el.sous_module,
              action: el.action,
              date: el.created_at,
            };
            return data;
          });
          //response.data.length === 0 ? this.toastrService.info('Historique vide !') : this.toastrService.success(response.message);
        },
        (error) => {
          this.toastService.error(error.error.message);
        }
      );
  }


  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }

  hideDialog() {
    this.display = false;
  }
  refreshHistorique() {
    this.settingService.statutSubject$.subscribe((response: any) => {
      if (response === true) {
        this.getAllHistoriques();
      }
    });
  }
  exportTable() { }
  changeDateStart(e) {
    this.selectDateStart = moment(this.filterDateStart).format('YYYY-MM-DD');
  }
  changeDateEnd(e) {
    this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
  }

  filterHistoriques() {
    if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
      this.toastService.error('Plage de date invalide');
      return;
    }
    this.getAllHistoriques();
  }


}

import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { ParametreSecuriteService } from '../../data-access/parametre-securite.service';
import { Title } from '@angular/platform-browser';
import { handle } from 'src/shared/functions/api.function';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-journal-authentication',
  templateUrl: './journal-authentication.component.html',
  styleUrls: ['./journal-authentication.component.scss']
})
export class JournalAuthenticationComponent implements OnInit {
  private response: any;
  public listNotifications: Array<any>;
  public listUsers: Array<any> = [];
  public selectedUser: any;
  public filterDateStart: Date;
  public filterDateEnd: Date;
  public selectDateStart: any;
  public selectDateEnd: any;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number = 1;
  public title = 'Journal authentification - Système de Gestion de Collecte Centralisée';
  constructor(
    private parametreSecuriteService: ParametreSecuriteService,
    private toastrService: ToastrService,
    private settingService: SettingService,
    private toastService: ToastrService,
    private titleService: Title,
    private loadingBarService: LoadingBarService
  ) {
    this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit() {
    this.GetAllJournal()
    this.GetAllUsers()
    this.isFilter()
  }

  OnRefresh() {
    this.selectedUser = null
    this.selectDateStart = null
    this.selectDateEnd = null
    this.filterDateStart = null
    this.filterDateEnd = null
    this.GetAllJournal()
  }

  async GetAllJournal(): Promise<void> {
    this.response = await handle(() => this.parametreSecuriteService.GetAllJournal({}), this.toastrService, this.loadingBarService);
    if(this.response) this.handleSuccessfulJournal(this.response);
  }
  private handleSuccessfulJournal(response: any): void {
    this.listNotifications = response.data.map((item) => {
      const parseData = JSON.parse(item.data);            
     return {...item, data: parseData};
    })  
    console.log('this.listNotifications', this.listNotifications)
  }
  onFilter() {
    if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
      this.toastService.error('Plage de date invalide');
      return;
    }
    this.parametreSecuriteService
      .GetAllJournal({
        date_debut: this.selectDateStart,
        date_fin: this.selectDateEnd,
        auth_user_id: this.selectedUser?.id,
      })
      .subscribe(
        (response: any) => {
          const datas = response['data'];
          this.listNotifications = datas.map((item) => {
            const parseData = JSON.parse(item.data);            
           return {...item, data: parseData};
          });          
        },
        (error) => {
          this.toastrService.error(error.error.message);
        }
      );
  }
  GetAllUsers() {
    this.settingService
      .getAllUsers({})
      .subscribe(
        (response: any) => {
          const users = response['data'];
          this.listUsers = users.map((el) => {
            const data = { ...el, fullName: el.nom + ' ' + el.prenoms };
            return data;
          });
        },
        (error) => {
          this.toastrService.error(error.error.message);
        }
      );
  }
  changeDateStart(e) {
    if ( moment(this.filterDateStart).isValid()) {
      this.selectDateStart = moment(this.filterDateStart).format('YYYY-MM-DD');
    }else{
      this.selectDateStart = null
    }
  }
  changeDateEnd(e) { 
    if ( moment(this.filterDateEnd).isValid()) {
      this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
    }else{
      this.selectDateEnd = null
    }
  }
  public isFilter(): boolean {
    return (!this.selectedUser && !this.selectDateStart && !this.selectDateEnd) ? true : false
  }
}

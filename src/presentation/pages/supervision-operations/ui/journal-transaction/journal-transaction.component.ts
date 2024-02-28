import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'
import { ToastrService } from 'ngx-toastr';
import { ParametreSecuriteService } from 'src/presentation/pages/parametre-securite/data-access/parametre-securite.service';
import { SettingService } from 'src/shared/services/setting.service';

@Component({
  selector: 'app-journal-transaction',
  templateUrl: './journal-transaction.component.html',
  styleUrls: ['./journal-transaction.component.scss']
})
export class JournalTransactionComponent implements OnInit {

  public listNotifications: Array<any> = [];
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

  constructor(
    private parametreSecuriteService: ParametreSecuriteService,
    private toastrService: ToastrService,
    private settingService: SettingService,
    private toastService: ToastrService
  ) { }

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

  GetAllJournal() {
    this.parametreSecuriteService
      .GetAllJournal({})
      .subscribe(
        (response: any) => {
          this.listNotifications = response['data'];
        },
        (error) => {
          this.toastrService.error(error.error.message);
        }
      );
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
          this.listNotifications = response['data'];
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

import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ProvisionningService } from '../../data-access/provisionning.service';
import { ClipboardService } from 'ngx-clipboard';


@Component({
  selector: 'app-stock-produit',
  templateUrl: './stock-produit.component.html',
  styleUrls: ['./stock-produit.component.scss']
})
export class StockProduitComponent implements OnInit {

  public listStocks: Array<any> = [];
  public filterDateStart: Date;
  public filterDateEnd: Date;
  public selectDateStart: any;
  public selectDateEnd: any;
  public selectedTransaction: string;
  public selectedReference: string;
  public selectedImsi: string;
  public selectedMsisdn: string;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public soldeData: number = 0;
  public soldeSimA: number = 0;
  public soldeSimB: number = 0;

  constructor(
    
    private toastrService: ToastrService,
    private provisionningService: ProvisionningService,
    private clipboardApi: ClipboardService,
  ) {}

  ngOnInit() {
    this.GetAllStocks()
    this.isFilter()
  }

  public GetAllStocks() {
    this.provisionningService
      .GetAllStocks({}, this.p)
      .subscribe({
        next: (response) => {
          this.listStocks = response['data']['data'];
          this.totalPage = response['data'].last_page;
          this.totalRecords = response['data'].total;
          this.recordsPerPage = response['data'].per_page;
          this.offset = (response['data'].current_page - 1) * this.recordsPerPage + 1;
          this.OnStatAchat()
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
 
  public onFilter() {
    if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
      this.toastrService.error('Plage de date invalide');
      return;
    }
    this.provisionningService
      .GetAllStocks({
        transaction: this.selectedTransaction,
        numero_commande: this.selectedReference,
        imsi: this.selectedImsi,
        msisdn: this.selectedMsisdn,
        date_debut: this.selectDateStart,
        date_fin: this.selectDateEnd,
      }, this.p)
      .subscribe({
        next: (response) => {
          this.listStocks = response['data']['data'];
          this.totalPage = response['data'].last_page;
          this.totalRecords = response['data'].total;
          this.recordsPerPage = response['data'].per_page;
          this.offset = (response['data'].current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public OnRefresh(){
    this.GetAllStocks();
    this.selectedTransaction = null
    this.selectedReference = null
    this.selectedImsi = null
    this.selectedMsisdn = null
    this.selectDateStart = null
    this.selectDateEnd = null
    this.filterDateStart = null
    this.filterDateEnd = null
  }
  public OnStatAchat() {
    this.provisionningService
      .OnStatAchat({})
      .subscribe({
        next: (response) => {
          this.soldeData = response['data']?.solde_data;
          this.soldeSimA = response['data']?.solde_sim_a;
          this.soldeSimB = response['data']?.solde_sim_b
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  public onPageChange(event) {
    this.p = event;
    if (this.isFilter()) {
      this.GetAllStocks()
    } else {
      this.onFilter()
    }
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
    return (!this.selectedTransaction && !this.selectedReference && !this.selectedImsi && !this.selectedMsisdn && !this.selectDateStart  && !this.selectDateEnd) ? true : false
  }
}

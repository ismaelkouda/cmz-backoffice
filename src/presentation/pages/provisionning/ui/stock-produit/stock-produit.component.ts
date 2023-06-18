import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-stock-produit',
  templateUrl: './stock-produit.component.html',
  styleUrls: ['./stock-produit.component.scss']
})
export class StockProduitComponent implements OnInit {

  listStocks: any;

  public filterDateStart: Date;
  public filterDateEnd: Date;
  public selectDateStart: any;
  public selectDateEnd: any;
  public selectedTransaction: string;
  public selectedType: string;
  public selectedImsi: string;
  public selectedMsisdn: string;

  public listTypes: Array<any> = [];
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;

  constructor(
    private toastService: ToastrService
  ) {
    this.filterDateStart = new Date();
    this.filterDateEnd = new Date();
    this.selectDateStart = moment(this.filterDateStart).format('YYYY-MM-DD');
    this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
    this.listTypes = ['enlevement', 'provisionnement']
  }

  ngOnInit() {
  }


  public onFilter() {

    if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
      this.toastService.error('Plage de date invalide');
      return;
    }

  }

  changeDateStart(e) {
    this.selectDateStart = moment(this.filterDateStart).format('YYYY-MM-DD');
  }
  changeDateEnd(e) {
    this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
  }

  public isFilter(): boolean {
    return true;
  }
}

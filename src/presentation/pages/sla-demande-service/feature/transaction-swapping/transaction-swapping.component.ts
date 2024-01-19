import { SlaDemandeService } from '../../data-access/sla-demande.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import * as moment from 'moment'
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { LoadingBarService } from '@ngx-loading-bar/core';
const Swal = require('sweetalert2');


@Component({
  selector: 'app-transaction-swapping',
  templateUrl: './transaction-swapping.component.html',
  styleUrls: ['./transaction-swapping.component.scss']
})
export class TransactionSwappingComponent implements OnInit {

  public module: string;
  public subModule: string;
  public listTransactions: Array<any> = [];
  public listTenants: Array<any> = [];
  public listStatutTransactions: Array<any> = [];
  public selectedTransaction: any;
  public selectedStatut: any;
  public selectedTenant: any;
  public selectedMsisdn: string;
  public selectedSla: string;
  public currentTransactionId: string;
  public filterDateStart: Date;
  public filterDateEnd: Date;
  public selectDateStart: any;
  public selectDateEnd: any;
  public secondFilter: boolean = false;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number = 1;
  public stateSoumis: string = StatutTransaction.SOUMIS;
  public stateTraite: string = StatutTransaction.TARITER;
  public stateCloture: string = StatutTransaction.CLOTURER;

  constructor(
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private clipboardApi: ClipboardService,
    private loadingBar: LoadingBarService,
    private slaDemandeService: SlaDemandeService

  ) {
    Object.values(StatutTransaction).forEach(item => {
      this.listStatutTransactions.push(item);
    });
  }

  ngOnInit() {
    this.isFilter();
    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[0];
    });
  }

  public onFilter(): void {
    if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
      this.toastrService.error('Plage de date invalide');
      return;
    }
    const data = {
      tenant_code: this.selectedTenant?.code,
      transaction: this.selectedTransaction,
      msisdn: this.selectedMsisdn,
      statut: this.selectedStatut,
      date_debut: this.selectDateStart,
      date_fin: this.selectDateEnd,
    };
    this.slaDemandeService
      .GetAllSwappingTransactions(data, this.p)
      .subscribe({
        next: (response) => {
          this.listTransactions =  response['data']['data'].map((data) => {
            if (data?.statut === StatutTransaction.TARITER) {
              return {...data,current_date: data?.date_traitement,current_dure: data?.duree_traitement, current_sla: data?.sla_traitement}
            }else if (data?.statut === StatutTransaction.CLOTURER) {
              return {...data,current_date: data?.date_cloture,current_dure: data?.duree_cloture, current_sla: data?.sla_cloture}
            }else if ((data?.statut === StatutTransaction.SOUMIS)) {
              return {...data,current_date: data?.date_acquittement ?? 'N/A',current_dure: data?.duree_acquittement ?? 'N/A', current_sla: data?.sla_acquittement ?? 'N/A'}
            } else{
              return {...data,current_date: 'N/A', current_dure: 'N/A',current_sla: 'N/A' }
            }
          });
          this.totalPage = response['data'].last_page;
          this.totalRecords = response['data'].total;
          this.recordsPerPage = response['data'].per_page;
          this.page = response.data?.current_page;
          this.offset = (response['data'].current_page - 1) * this.recordsPerPage + 1;
          this.listTransactions.length === 0 ?
            Swal.fire('PATRIMOINE SIM', 'Aucune donnée pour cet Tenant', 'error')
            : ''
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      });
  }
  OnRefresh() {
    if (this.selectedTenant) {
      this.selectedTransaction = null;
      this.selectedStatut = null;
      this.selectedSla = null;
      this.selectDateStart = null;
      this.selectDateEnd = null;
      this.filterDateStart = null;
      this.filterDateEnd = null;
      this.onFilter()
    }else{
      this.loadingBar.start()
      setTimeout(() => {
        this.listTransactions.splice(0, this.listTransactions.length);
        this.selectedTransaction = null;
        this.selectedStatut = null;
        this.selectedSla = null;
        this.selectDateStart = null;
        this.selectDateEnd = null;
        this.filterDateStart = null;
        this.filterDateEnd = null;
        this.loadingBar.stop()
      }, 1000);
    }
  }
  onPageChange(event: any) {
    this.p = event.pageCount;
    this.onFilter()
  }

  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }

  public showSecondFilter() {
    this.secondFilter = !this.secondFilter;
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
    return (!this.selectedTenant) ? true : false
  }

}

import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { SettingService } from 'src/shared/services/setting.service';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { ClipboardService } from 'ngx-clipboard';
import { ActivatedRoute } from '@angular/router';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JournalComponent } from 'src/shared/components/journal/journal.component';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';
import { ExcelService } from 'src/shared/services/excel.service';
import { TransactionShowComponent } from 'src/shared/components/transaction-show/transaction-show.component';

@Component({
  selector: 'app-transaction-sim',
  templateUrl: './transaction-sim.component.html',
  styleUrls: ['./transaction-sim.component.scss']
})
export class TransactionSimComponent implements OnInit {

  public module: string;
  public subModule: string;
  public listTransactions: Array<any> = [];
  public listTypeOperations: Array<any> = [];
  public listStatuts: Array<any> = [];
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentObject: any;
  public selectedSim: string;
  public selectedimsi: string;
  public selectedOperation: string;
  public selectedTransaction: string;
  public selectedStatut: string;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public display: boolean = false;
  public isMaximized: boolean = false;
  public secondFilter: boolean = false;
  public filterDateStart: Date;
  public filterDateEnd: Date;
  public selectDateStart: any;
  public selectDateEnd: any;
  public stateSoumis: string = StatutTransaction.SOUMIS;
  public stateTraite: string = StatutTransaction.TARITER;
  public stateCloture: string = StatutTransaction.CLOTURER;
  public treatmenEntente: string = TraitementTransaction.EN_ENTENTE;
  public treatmenAcquiter: string = TraitementTransaction.ACQUITER;
  public treatmenAccepter: string = TraitementTransaction.ACCEPTER;
  public treatmenRejeter: string = TraitementTransaction.REJETER;
  public treatmenCancel: string = TraitementTransaction.ABANDONNER;

  constructor(
    public settingService: SettingService,
    public patrimoineService: PatrimoineService,
    public toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private excelService: ExcelService

  ) {
    this.listTypeOperations = [
      OperationTransaction.ACTIVATION,
      OperationTransaction.RESILIATION,
      OperationTransaction.SUSPENSION,
      OperationTransaction.SWAP,
      OperationTransaction.VOLUME_DATA,
      OperationTransaction.RE_ACTIVATION
    ],
      Object.values(TraitementTransaction).forEach(item => {
        this.listStatuts.push(item);
      });
  }

  ngOnInit() {
    this.GetAllTransactions();
    this.isFilter();
    this.disableAction()
    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[3];
    });
    if (history.state.patrimoine) {
      this.onInitForm()
    }
  }

  public GetAllTransactions() {
    this.patrimoineService
      .GetAllTransactions({}, this.p)
      .subscribe({
        next: (response) => {
          this.listTransactions = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public onPageChange(event) {
    this.p = event;
    this.GetAllTransactions()
  }

  public onFilter() {
    if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
      this.toastrService.error('Plage de date invalide');
      return;
    }
    this.patrimoineService
      .GetAllTransactions({
        operation: this.selectedOperation,
        transaction: this.selectedTransaction,
        msisdn: this.selectedSim,
        imsi: this.selectedimsi,
        statut: this.selectedStatut,
        date_debut: this.selectDateStart,
        date_fin: this.selectDateEnd,
      }, this.p)
      .subscribe({
        next: (response) => {
          this.listTransactions = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public OnRefresh(){
    this.GetAllTransactions()
    this.selectedOperation =null
    this.selectedTransaction = null
    this.selectedSim = null
    this.selectedimsi = null
    this.selectedStatut = null
    this.selectDateStart = null
    this.selectDateEnd = null
    this.filterDateStart = null
    this.filterDateEnd = null
    
  }
  showJournal(data: Object): void {
    const modalRef = this.modalService.open(JournalComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    modalRef.componentInstance.transaction = data;
    modalRef.componentInstance.type = data['ouvrage'];
  }

  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }

  public hideDialog(data) {
    this.display = false;
  }
  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }
  public onInitForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;
  }

  public showSecondFilter() {
    this.secondFilter = !this.secondFilter;
  }
  public onHistorique(data): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = data;
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
  public pushListTransactions(event: any): void {
    this.listTransactions = event;
  }
  public disableAction(): boolean {
    return (this.listTransactions === undefined || this.listTransactions?.length === 0) ? true : false
  }
  OnShowTraitement(data: Object): void {
    const modalRef = this.modalService.open(TransactionShowComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    modalRef.componentInstance.transaction = data;
    modalRef.componentInstance.resultTraitement.subscribe((res) => {
      this.listTransactions = res
    })
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
    return (!this.selectedSim && !this.selectedimsi && !this.selectedOperation && !this.selectedStatut && !this.selectedTransaction) ? true : false
  }
  public OnExportExcel(): void {
    const data = this.listTransactions.map((item: any) => ({
      'Numero transaction': item?.transaction,
      'Type Transaction': item?.operation,
      'IMSI': item?.imsi,
      'MSISDN': item?.msisdn,
      'Statut': item?.statut,
      'Date création': item?.created_at
    }));
    this.excelService.exportAsExcelFile(data, 'Liste des transactions');
  }

}

import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { SettingService } from 'src/shared/services/setting.service';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { ClipboardService } from 'ngx-clipboard';
import { ActivatedRoute } from '@angular/router';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JournalComponent } from 'src/shared/components/journal/journal.component';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';
import { ExcelService } from 'src/shared/services/excel.service';
import { TransactionShowComponent } from 'src/shared/components/transaction-show/transaction-show.component';
import { MappingService } from 'src/shared/services/mapping.service';
import { Title } from '@angular/platform-browser';
import { ModalParams } from 'src/shared/constants/modalParams.contant';

@Component({
  selector: 'app-transaction-sim',
  templateUrl: './transaction-sim.component.html',
  styleUrls: ['./transaction-sim.component.scss']
})
export class TransactionSimComponent implements OnInit {

  public module: string;
  public subModule: string;
  public listTransactions: Array<any> = [];
  public listOperations: Array<any> = [];
  public listStatuts: Array<any> = [];
  public listTraitementTransactions: Array<any> = [];
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentObject: any;
  public typeDemande: string = 'simple';
  public selectedSim: string;
  public selectedimsi: string;
  public selectedOperation: string;
  public selectedTransaction: string;
  public selectedStatut: string;
  public selectedTraitement: string;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number = 0
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
  public treatmenRefuser: string = TraitementTransaction.REFUSER;
  public treatmenCancel: string = TraitementTransaction.ABANDONNER;
  public title = 'Transactions SIM - Système de Gestion de Collecte Centralisée';
  constructor(
    public settingService: SettingService,
    public patrimoineService: PatrimoineService,
    public toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    private mappingService: MappingService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private excelService: ExcelService,
    private titleService: Title

  ) {
    this.titleService.setTitle(`${this.title}`);
    this.listOperations = this.mappingService.listOperations
      Object.values(StatutTransaction).forEach(item => {
        this.listStatuts.push(item);
      });
      Object.values(TraitementTransaction).forEach(item => {
        this.listTraitementTransactions.push(item);
      });  
  }

  ngOnInit() {
    this.GetAllTransactions()
    this.isFilter();
    this.disableAction()
    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[3];
    });
    if (history.state.patrimoine) {
      this.onInitForm(this.typeDemande)
    }
    if (history.state?.statut  || history.state?.traitement) {
      this.selectedStatut = history.state?.statut
      this.selectedTraitement = history.state?.traitement
    }
  }

  public GetAllTransactions() {
    this.patrimoineService
      .GetAllTransactions({
        ...(history.state?.statut ? { statut: history.state?.statut } : {}),
        ...(history.state?.traitement ? { traitement: history.state?.traitement } : {})
      }, this.p)
      .subscribe({
        next: (response) => {
          this.listTransactions =  response['data']['data'].map((data) => {
            if (data?.statut === StatutTransaction.TARITER) {
              return {...data,current_date: data?.date_traitement}
            }else if (data?.statut === StatutTransaction.CLOTURER) {
              return {...data,current_date: data?.date_cloture}
            }else if ((data?.statut === StatutTransaction.SOUMIS) && (data?.traitement === TraitementTransaction.ACQUITER)) {
              return {...data,current_date: data?.date_acquittement}
            } else{
              return {...data,current_date: 'N/A'}
            }
          });
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.page = response.data?.current_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  
  public onPageChange(event) {
    this.p = event;
    if (this.isFilter()) {
      this.GetAllTransactions()
    } else {
      this.onFilter()
    }
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
        traitement: this.selectedTraitement,
        date_debut: this.selectDateStart,
        date_fin: this.selectDateEnd,
      }, this.p)
      .subscribe({
        next: (response) => {
          this.listTransactions =  response['data']['data'].map((data) => {
            if (data?.statut === StatutTransaction.TARITER) {
              return {...data,current_date: data?.date_traitement}
            }else if (data?.statut === StatutTransaction.CLOTURER) {
              return {...data,current_date: data?.date_cloture}
            }else if ((data?.statut === StatutTransaction.SOUMIS) && (data?.traitement === TraitementTransaction.ACQUITER)) {
              return {...data,current_date: data?.date_acquittement}
            } else{
              return {...data,current_date: 'N/A'}
            }
          });
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.page = response.data?.current_page;
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
    this.selectedTraitement = null
    this.selectDateStart = null
    this.selectDateEnd = null
    this.filterDateStart = null
    this.filterDateEnd = null
  }
  showJournal(data: Object): void {
    const modalRef = this.modalService.open(JournalComponent, ModalParams);
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
  public onInitForm(type: string): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;    
    this.typeDemande = type;
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
    const modalRef = this.modalService.open(TransactionShowComponent, ModalParams);
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
  public OnChangeStatut(event){
    const currentStatut = event.value
    if (currentStatut === StatutTransaction.SOUMIS) {
      this.listTraitementTransactions.splice(0,this.listTraitementTransactions.length);
      this.listTraitementTransactions = [
        TraitementTransaction.EN_ENTENTE,
        TraitementTransaction.ACQUITER
      ]
    }else if (currentStatut === StatutTransaction.TARITER) {
      this.listTraitementTransactions.splice(0,this.listTraitementTransactions.length);
      this.listTraitementTransactions = [
        TraitementTransaction.ACCEPTER,
        TraitementTransaction.REJETER
      ]
    }else if (currentStatut === StatutTransaction.CLOTURER) {
      this.listTraitementTransactions.splice(0,this.listTraitementTransactions.length);
      this.listTraitementTransactions = [
        TraitementTransaction.REFUSER,
        TraitementTransaction.ACCEPTER
      ]
    }else{
      Object.values(TraitementTransaction).forEach(item => {
        this.listTraitementTransactions.push(item);
      });
    }
  }
  public isFilter(): boolean {
    return (!this.selectedSim && !this.selectedimsi && !this.selectedOperation && !this.selectedStatut && !this.selectedTraitement && !this.selectedTransaction) ? true : false
  }
  public OnExportExcel(): void {
    const data = this.listTransactions.map((item: any) => ({
      'N° transaction': item?.transaction,
      'Type Transaction': item?.operation,
      'Statut': item?.statut,
      'IMSI': item?.imsi,
      'MSISDN': item?.msisdn,
      'Traitement': item?.traitement,
      'Date création': item?.created_at
    }));
    this.excelService.exportAsExcelFile(data, 'Liste des transactions');
  }

}

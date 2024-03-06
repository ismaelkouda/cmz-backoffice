
import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { SettingService } from 'src/shared/services/setting.service';
import { ClipboardService } from 'ngx-clipboard';
import { ActivatedRoute } from '@angular/router';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JournalComponent } from 'src/shared/components/journal/journal.component';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';
import { ExcelService } from 'src/shared/services/excel.service';
import { TransactionShowComponent } from 'src/shared/components/transaction-show/transaction-show.component';
import { MappingService } from 'src/shared/services/mapping.service';
import { PatrimoineService } from 'src/presentation/pages/patrimoine/data-access/patrimoine.service';
import { DemandeService } from '../../data-access/demande.service';

@Component({
  selector: 'app-demande-wrapper',
  templateUrl: './demande-wrapper.component.html',
  styleUrls: ['./demande-wrapper.component.scss']
})
export class DemandeWrapperComponent implements OnInit {

  public module: string;
  public subModule: string;
  @Input() selectedOperation: string;
  @Input() wrapperLabel: string;
  @Input() isMasse: boolean;
  @Input() listTransactions: any;
  @Output() formsView = new EventEmitter();
  @Output() typeDemande = new EventEmitter<string>();
  @Output() transactionId = new EventEmitter();


  public selectedTransaction: string;
  public listOperations: Array<any> = [];
  public listStatuts: Array<any> = [];
  public listTraitementTransactions: Array<any> = [];
  public initialView: boolean = true;
  public currentObject: any;
  public selectedSim: string;
  public selectedimsi: string;
  public selectedStatut: string;
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

  constructor(
    public settingService: SettingService,
    public demandeService: DemandeService,
    public toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    public mappingService: MappingService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private excelService: ExcelService

  ) {
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
      this.onInitForm('simple')
    }
    if (history.state?.statut  || history.state?.traitement) {
      this.selectedStatut = history.state?.statut
    }
  }

  public GetAllTransactions() {
    this.demandeService
      .GetDemandeServiceByTransaction({
        operation: this.selectedOperation,
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
    this.demandeService
      .GetDemandeServiceByTransaction({
        numero_demande: this.selectedTransaction,
        operation: this.selectedOperation,
        msisdn: this.selectedSim,
        imsi: this.selectedimsi,
        statut: this.selectedStatut,
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
  public onInitForm(type: string): void {    
    this.formsView.emit(true);
    this.typeDemande.emit(type);
    this.currentObject = undefined;    
  }

  public showSecondFilter() {
    this.secondFilter = !this.secondFilter;
  }
  public onHistorique(data): void {
    this.initialView = false;
   // this.formsView = true;
    this.currentObject = data;
  }
  public pushStatutView(event: boolean): void {
   // this.formsView = event;
    this.initialView = !event;
  }
  public pushListTransactions(event: any): void {
    this.listTransactions = event;
  }
  public disableAction(): boolean {
    return (this.listTransactions === undefined || this.listTransactions?.length === 0) ? true : false
  }
  OnShowTraitement(data: any): void {
    this.totalPage = 0;
    this.totalRecords = 0;
    this.recordsPerPage = 0;
    this.page = 1;
     this.transactionId.emit(data)
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
    return (!this.selectedSim && !this.selectedimsi && !this.selectedOperation && !this.selectedStatut && !this.selectedTransaction) ? true : false
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

import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { SettingService } from 'src/shared/services/setting.service';
import { ClipboardService } from 'ngx-clipboard';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';
import { ExcelService } from 'src/shared/services/excel.service';
import { TransactionShowComponent } from 'src/shared/components/transaction-show/transaction-show.component';
import { MappingService } from 'src/shared/services/mapping.service';
import { Title } from '@angular/platform-browser';
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
import { DemandeMasseComponent } from '../../feature/demande-masse/demande-masse.component';
import { ModalParams } from 'src/shared/constants/modalParams.contant';
import { BADGE_ETAPE } from 'src/shared/constants/badge-etape.constant';
import { BADGE_ETAT } from 'src/shared/constants/badge-etat.contant';
import { OperationTransaction } from '../../../../../shared/enum/OperationTransaction.enum';

@Component({
  selector: 'app-alarmes',
  templateUrl: './alarmes.component.html',
  styleUrls: ['./alarmes.component.scss']
})
export class AlarmesComponent implements OnInit {

  public module: string;
  public subModule: string;
  public listTransactions: Array<any> = [];
  public listOperations: Array<any> = [];
  public listUsers: Array<any> = [];
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentObject: any;
  public selectedSim: string;
  public selectedimsi: string;
  public selectedOperation: string;
  public selectedTransaction: string;
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
  public currentUser: any;
  public stateSoumis: string = StatutTransaction.SOUMIS;
  public stateTraite: string = StatutTransaction.TARITER;
  public stateCloture: string = StatutTransaction.CLOTURER;
  public treatmenEntente: string = TraitementTransaction.EN_ENTENTE;
  public treatmenAcquiter: string = TraitementTransaction.ACQUITER;
  public treatmenAccepter: string = TraitementTransaction.ACCEPTER;
  public treatmenRejeter: string = TraitementTransaction.REJETER;
  public treatmenRefuser: string = TraitementTransaction.REFUSER;
  public treatmenCancel: string = TraitementTransaction.ABANDONNER;
  public IsLoading: boolean;
  public title = 'File attente - Système de Gestion de Collecte Centralisée';

  constructor(
    public settingService: SettingService,
    public supervisionOperationService: SupervisionOperationService,
    public toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    private modalService: NgbModal,
    private mappingService: MappingService,
    private excelService: ExcelService,
    private titleService: Title

  ) {
    this.titleService.setTitle(`${this.title}`);
    this.listOperations = this.mappingService.listOperations;
  }

  ngOnInit() {
    this.GetAllTransactions();
    this.getAllUsers()
    this.isFilter();
  }

  public GetAllTransactions() {
    this.supervisionOperationService
      .GetAllDemandes({}, this.p)
      .subscribe({
        next: (response) => {
          this.listTransactions =  response['data']['data'];
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
    this.supervisionOperationService
      .GetAllDemandes({
        operation: this.selectedOperation,
        numero_demande: this.selectedTransaction,
        msisdn: this.selectedSim,
        imsi: this.selectedimsi,
        initie_par: this.currentUser?.id,
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
    this.p = 1;
    this.GetAllTransactions()
    this.selectedOperation =null
    this.selectedTransaction = null
    this.selectedSim = null
    this.selectedimsi = null
    this.currentUser = null
    this.selectDateStart = null
    this.selectDateEnd = null
    this.filterDateStart = null
    this.filterDateEnd = null
    this.secondFilter = false;
  }
  getAllUsers() {
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

  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }

  public formatTitle(title: string) {
    switch (title) {
      case OperationTransaction.ACHAT_SERVICE: {
        return "Achat de Services";
      }
      case OperationTransaction.ACTIVATION: {
        return "Activation de SIM";
      }
      case OperationTransaction.SWAP: {
        return "Changement de SIM";
      }
      case OperationTransaction.SUSPENSION: {
        return "Suspension de SIM";
      }
      case OperationTransaction.CHANGEMENT_FORMULE: {
        return "Changement de Formule";
      }
      case OperationTransaction.RESILIATION: {
        return "Résiliation de SIM";
      }
      case OperationTransaction.SIM_BLANCHE: {
        return "SIM Blanche";
      }
      case OperationTransaction.VOLUME_DATA: {
        return "Depot de volume	";
      }
      case 'provisionning': {
        return 'Ligne de Credit';
      }
      default:
        return 'N/A'
    }
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
    
  public getEtapeBadge(data: any): string {
    switch (data?.statut) {
      case BADGE_ETAPE.SOUMISSION: return "badge-dark";
      case BADGE_ETAPE.TRAITEMENT: return "badge-warning";
      case BADGE_ETAPE.FINALISATEUR: return "badge-info";
      case BADGE_ETAPE.CLOTURE: return "badge-success";
    }
  }

  public getEtatBadge(data: any): string {
    switch (data?.statut) {
      case BADGE_ETAPE.SOUMISSION:
        if (data?.traitement === BADGE_ETAT.EN_ATTENTE) return "badge-dark";
        if (data?.traitement === BADGE_ETAT.PARTIEL) return "badge-warning";
        if (data?.traitement === BADGE_ETAT.RECU) return "badge-dark";
        if (data?.traitement === BADGE_ETAT.APPROUVE) return "badge-success";
        if (data?.traitement === BADGE_ETAT.REJETE) return "badge-danger";
        break;

      case BADGE_ETAPE.TRAITEMENT:
        if (data?.traitement === BADGE_ETAT.EN_COURS) return "badge-warning";
        if (data?.traitement === BADGE_ETAT.TERMINE) return "badge-success";
        break;

      case BADGE_ETAPE.FINALISATEUR:
        if (data?.traitement === BADGE_ETAT.EN_ATTENTE) { return "badge-warning"; }
        if (data?.traitement === BADGE_ETAT.EFFECTUE) { return "badge-warning"; }
        if (data?.traitement === BADGE_ETAT.LIVRE) { return "badge-primary"; }
        break;

      case BADGE_ETAPE.CLOTURE:
        if (data?.traitement === BADGE_ETAT.EFFECTUE) { return "badge-success"; }
  if (data?.traitement === BADGE_ETAT.TERMINE) { return "badge-success"; }
        if (data?.traitement === BADGE_ETAT.REFUSE) { return "badge-danger"; }
        if (data?.traitement === BADGE_ETAT.ABANDONNE) { return "badge-warning"; }
        if (data?.traitement === BADGE_ETAT.REJETE) { return "badge-danger"; }
        break;
    }
  }
  OnShowTraitement(data: any): void {
    // this.IsLoading = true;
    // const modalRef = this.modalService.open(TransactionShowComponent, {
    //   ariaLabelledBy: "modal-basic-title",
    //   backdrop: "static",
    //   keyboard: false,
    //   centered: true,
    // });
    // modalRef.componentInstance.transaction = {...data,current_date: data.current_date,IsLoading: this.IsLoading};
    // modalRef.componentInstance.resultTraitement.subscribe((res) => {
    //   this.listTransactions = res
    // })
    // modalRef.componentInstance.IsLoading.subscribe((res) => {
    //   this.IsLoading = res;
    //   modalRef.componentInstance.IsLoadData = !res;
    // })   
    // let action: string;
    // if (this.canClose(data)) {
    //   action = "Clôturer";
    // }
    this.IsLoading = true;
    const modalRef = this.modalService.open(DemandeMasseComponent, ModalParams);
    modalRef.componentInstance.params = {vue: "traitement"};
    modalRef.componentInstance.demande = { ...data, current_date: data?.current_date, IsLoading: this.IsLoading };
    modalRef.componentInstance.resultTraitement = this.supervisionOperationService.GetAllDemandes({}, this.p);
    modalRef.componentInstance.IsLoading.subscribe((res) => { this.IsLoading = res;  modalRef.componentInstance.IsLoadData = !res }); 
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
  public disableAction(): boolean {
    return (this.listTransactions === undefined || this.listTransactions?.length === 0) ? true : false
  }
  public isFilter(): boolean {
    return (!this.selectedSim && !this.selectedimsi && !this.selectedOperation && !this.selectedTransaction && !this.currentUser && !this.selectDateStart && !this.selectDateEnd) ? true : false
  }
  public OnExportExcel(): void {
    const data = this.listTransactions.map((item: any) => ({
      'Date création': item?.created_at,
      'Type Opération': item?.operation,
      'N° Dossier': item?.numero_demande,
      '# Cycles': item?.nb_cycle,
      '# Lignes': item?.nb_demande_soumises,
      'Etape': item?.statut,
      'Traitement': item?.traitement,
      'Demandeur': `${item.demandeur_nom} ${item.demandeur_prenoms}`,
    }));
    this.excelService.exportAsExcelFile(data, "File d'attente");
   }

}

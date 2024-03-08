import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TraitementShowComponent } from '../../../../../shared/components/traitement-show/traitement-show.component';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { StatutTransaction } from './../../../../../shared/enum/StatutTransaction.enum';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';
import * as moment from 'moment';
import { ExcelService } from 'src/shared/services/excel.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-suivie-traitement',
  templateUrl: './suivie-traitement.component.html',
  styleUrls: ['./suivie-traitement.component.scss']
})
export class SuivieTraitementComponent implements OnInit {

  public listTraitemants: Array<any> = [];
  public listOperations: Array<any> = [];
  public listStatutTransactions: Array<any> = [];
  public listTraitementTransactions: Array<any> = [];
  public listIntervenants: Array<any> = [];
  public listTraitements: Array<any> = [];
  public listUsers: Array<any> = [];
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number = 0
  public selectedTypeOperation: any;
  public selectedTransaction: any;
  public selectedStatut: any;
  public selectedTraitement: any;
  public secondFilter: boolean = false;
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public filterDateStart: Date;
  public filterDateEnd: Date;
  public selectDateStart: any;
  public selectDateEnd: any;
  public currentUser: any;
  public activationTransaction: string = OperationTransaction.ACTIVATION
  public stateSoumis: string = StatutTransaction.SOUMIS;
  public stateTraite: string = StatutTransaction.TARITER;
  public stateCloture: string = StatutTransaction.CLOTURER;
  public treatmenEntente: string = TraitementTransaction.EN_ENTENTE;
  public treatmenAcquiter: string = TraitementTransaction.ACQUITER;
  public treatmenAccepter: string = TraitementTransaction.ACCEPTER;
  public treatmenRejeter: string = TraitementTransaction.REJETER;
  public treatmenRefuser: string = TraitementTransaction.REFUSER;
  public treatmenCancel: string = TraitementTransaction.ABANDONNER;
  public historie: any;

  constructor(
    private supervisionOperationService: SupervisionOperationService,
    private toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    private modalService: NgbModal,
    private settingService: SettingService,
    private mappingService: MappingService,
    private excelService: ExcelService

  ) {
    this.listOperations = this.mappingService.listOperationTraitementVue;
    Object.values(StatutTransaction).forEach(item => {
      this.listStatutTransactions.push(item);
    });
    Object.values(TraitementTransaction).forEach(item => {
      this.listTraitementTransactions.push(item);
    });
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }

  ngOnInit() {
    this.isFilter();
    this.getAllUsers()
    if (history.state) {
      this.historie = history.state;
      this.selectedStatut = this.historie?.statut;
      this.selectedTraitement = this.historie?.traitement;
    }
    this.GetAllTransactions();
  }

  public GetAllTransactions() {
    this.supervisionOperationService
      .GetAllTransactions({
        ...(this.historie?.statut ? { statut: this.selectedStatut } : {}),
        ...(this.historie?.traitement ? { traitement: this.selectedTraitement } : {})
      }, this.p)
      .subscribe({
        next: (response) => {
          this.listTraitemants =  response['data']['data'].map((data) => {
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
  public onFilter(): void {
    if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
      this.toastrService.error('Plage de date invalide');
      return;
    }
    const data = {
      operation: this.selectedTypeOperation,
      transaction: this.selectedTransaction,
      statut: this.selectedStatut,
      traitement: this.selectedTraitement,
      initie_par: this.currentUser?.id,
      date_debut: this.selectDateStart,
      date_fin: this.selectDateEnd,
    };
    this.supervisionOperationService
      .GetAllTransactions(data, this.p)
      .subscribe({
        next: (response) => {
          this.listTraitemants = response['data']['data'];
          this.totalPage = response['data'].last_page;
          this.totalRecords = response['data'].total;
          this.recordsPerPage = response['data'].per_page;
          this.page = response.data?.current_page;
          this.offset = (response['data'].current_page - 1) * this.recordsPerPage + 1;
          this.listTraitemants.length === 0 ?
            Swal.fire('PATRIMOINE SIM', 'Aucune donnée pour cet Tenant', 'error')
            : ''
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      });
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
  public onPageChange(event) {
    this.p = event;
    if (this.isFilter()) {
      this.GetAllTransactions()
    } else {
      this.onFilter()
    }
  }
  OnRefresh() {
    this.historie = null;
    this.selectedTypeOperation = null
    this.selectedTransaction = null;
    this.selectedStatut = null;
    this.selectedTraitement = null;
    this.currentUser = null;
    this.selectDateStart = null;
    this.selectDateEnd = null;
    this.filterDateStart = null;
    this.filterDateEnd = null;
    this.GetAllTransactions();
    this.secondFilter = false;
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
  public copyTransaction(data: any): void {
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
      case OperationTransaction.RESILIATION: {
        return "Résiliation de SIM";
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
  public getCodeRapport(value: string): string {
    const code = value?.split("-");
    if (code[1] === "102") {
      return "102";
    } else if (code[1] === "100") {
      return "100";
    } else if (code[1] === "200") {
      return "200";
    } else {
      return "false";
    }
  }

  public showDialog(data: Object): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
      icon: "info",
      html: `<strong>Message</strong> : ${data["message"]} <br><br> <strong>Action</strong> : ${data['action']}`,
      confirmButtonColor: "#F07427",
      confirmButtonText: "ok",
    });
  }

  public truncateString(str: string, num: number = 20): string {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  }

  OnShowTraitement(data: any): void {
    const modalRef = this.modalService.open(TraitementShowComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    modalRef.componentInstance.transaction = {...data,current_date: data.current_date};
    modalRef.componentInstance.resultTraitement.subscribe((res) => {
      this.listTraitemants = res
    })
  }
  public showSecondFilter() {
    this.secondFilter = !this.secondFilter;
  }

  public isFilter(): boolean {
    return (
      !this.selectedTypeOperation &&
      !this.selectedTransaction &&
      !this.selectedStatut &&
      !this.currentUser &&
      !this.selectedTraitement &&
      !this.filterDateStart && 
      !this.filterDateStart
    ) ? true : false
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
  public OnExportExcel(): void {
    const data = this.listTraitemants.map((item: any) => ({
      'Date création': item?.created_at,
      'N° transaction': item?.transaction,
      'Type Transaction': item?.operation,
      'Service': [this.formatTitle(item?.operation)],
      'Rapport': item?.code_rapport,
      'Statut': item?.statut,
      'Traitement': item?.traitement,
      'Demandeur': `${item.agent_nom} ${item.agent_prenoms}`,
    }));
    this.excelService.exportAsExcelFile(data, 'Liste de suivie et traitements');
  }
}


import { ProvisionningService } from './../../data-access/provisionning.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-commande-sim',
  templateUrl: './commande-sim.component.html',
  styleUrls: ['./commande-sim.component.scss']
})
export class CommandeSimComponent implements OnInit {

  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentObject: any;
  public listTypeSims: Array<any> = [];
  public listCommandes: Array<any> = [];
  public listStatuts: Array<any> = [];
  public selectedTranaction: string;
  public selectedReference: string;
  public selectedImsi: string;
  public selectedMsisdn: string;
  public selectedStatut: string;
  public filterDateStart: Date;
  public filterDateEnd: Date;
  public selectDateStart: any;
  public selectDateEnd: any;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public stateSoumis: string = StatutTransaction.SOUMIS;
  public stateTraite: string = StatutTransaction.TARITER;
  public stateCloture: string = StatutTransaction.CLOTURER;
  public treatmenEntente: string = TraitementTransaction.EN_ENTENTE;
  public treatmenAcquiter: string = TraitementTransaction.ACQUITER;
  public treatmenAccepter: string = TraitementTransaction.ACCEPTER;
  public treatmenRejeter: string = TraitementTransaction.REJETER;
  public treatmenCancel: string = TraitementTransaction.ABANDONNER;
  public creditDisponible: number = 0;
  public soldeData: number = 0;
  public soldeSimA: number = 0;
  public soldeSimB: number = 0;

  constructor(
    private provisionningService: ProvisionningService,
    private toastService: ToastrService,
    private clipboardApi: ClipboardService,

  ) {
    this.listTypeSims = ['SIM Blanche', 'SIM MSISDN'];
    Object.values(TraitementTransaction).forEach(item => {
      this.listStatuts.push(item);
    });
  }

  ngOnInit() {
    this.GetAllAchats();
    this.isFilter();

  }

  public GetAllAchats() {
    this.provisionningService
      .GetAllAchats({}, this.p)
      .subscribe({
        next: (response) => {
          this.listCommandes = response['data'];
          this.totalPage = response.last_page;
          this.totalRecords = response.total;
          this.recordsPerPage = response.per_page;
          this.offset = (response.current_page - 1) * this.recordsPerPage + 1;
          this.OnStatAchat()
        },
        error: (error) => {
          this.toastService.error(error.error.message);
        }
      })
  }

  public onFilter() {
    if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
      this.toastService.error('Plage de date invalide');
      return;
    }
    this.provisionningService
      .GetAllAchats({
        transaction: this.selectedTranaction,
        reference: this.selectedReference,
        statut: this.selectedStatut,
        date_debut: this.selectDateStart,
        date_fin: this.selectDateEnd,
      }, this.p)
      .subscribe({
        next: (response) => {
          this.listCommandes = response['data'];
          this.totalPage = response.last_page;
          this.totalRecords = response.total;
          this.recordsPerPage = response.per_page;
          this.offset = (response.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastService.error(error.error.message);
        }
      })
  }
  public OnRefresh(){
    this.GetAllAchats();
    this.selectedTranaction = null
    this.selectedReference = null
    this.selectedStatut = null
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
          this.creditDisponible = response['data']?.credit_disponible;
          this.soldeData = response['data']?.solde_data;
          this.soldeSimA = response['data']?.solde_sim_a;
          this.soldeSimB = response['data']?.solde_sim_b
        },
        error: (error) => {
          this.toastService.error(error.error.message);
        }
      })
  }
  copyData(data: any): void {
    this.toastService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  public onPageChange(event) {
    this.p = event;
    if (this.isFilter()) {
      this.GetAllAchats()
    } else {
      this.onFilter()
    }
  }

  public handleCancel() {

  }

  public onInitForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;
  }
  public onShowForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, show: true };
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
  public pushListDatas(event: any): void {
    this.listCommandes = event;
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

  pipeValue(number: any) {
    return new Intl.NumberFormat('fr-FR').format(number);
  }

  public isFilter(): boolean {
    return (!this.selectedTranaction && !this.selectedReference && !this.selectedStatut && !this.selectDateStart && !this.selectDateEnd) ? true : false
  }
}

import { ProvisionningService } from './../../data-access/provisionning.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { TraitementTransaction } from 'src/shared/enum/TraitementTransaction.enum';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
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
  public selectedTranaction: string;
  public selectedReference: string;
  public selectedImsi: string;
  public selectedMsisdn: string;
  public filterDateStart: Date;
  public filterDateEnd: Date;
  public selectDateStart: any;
  public selectDateEnd: any;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public treatmenEntente: string = TraitementTransaction.EN_ENTENTE;
  public treatmenAcquiter: string = TraitementTransaction.ACQUITER;
  public treatmenAccepter: string = TraitementTransaction.ACCEPTER;
  public treatmenRejeter: string = TraitementTransaction.REJETER;
  public treatmenCancel: string = TraitementTransaction.ABANDONNER;

  public creditDisponible: number = 0;
  public achatByyear: number = 0;
  public achatByWeek: number = 0;
  public achatByDay: number = 0;
  public achatByMounth: number = 0;



  constructor(
    private provisionningService: ProvisionningService,
    private toastService: ToastrService,
    private storage: EncodingDataService,
    private clipboardApi: ClipboardService,

  ) {
    this.listTypeSims = ['SIM Blanche', 'SIM MSISDN'];
    this.filterDateStart = new Date();
    this.filterDateEnd = new Date();
    this.selectDateStart = moment(this.filterDateStart).format('YYYY-MM-DD');
    this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
  }

  ngOnInit() {
    this.GetAllAchats();
    this.OnStatAchat();
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
        },
        error: (error) => {
          this.toastService.error(error.message);
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
        imsi: this.selectedImsi,
        msisdn: this.selectedMsisdn,
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
          this.toastService.error(error.message);
        }
      })
  }

  public OnStatAchat() {
    this.provisionningService
      .OnStatAchat({})
      .subscribe({
        next: (response) => {
          const data = response;
          this.creditDisponible = data?.achat_annuel;
          this.achatByDay = data?.achat_journalier;
          this.achatByWeek = data?.achat_hebdomadaire;
          this.achatByMounth = data?.achat_mensuel
          this.achatByyear = data?.achat_annuel;
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
  public handleSolder(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous solder l'achat de Transaction <br> ${data.transaction} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        // this.telemetrieService
        //   .handleActivateProfil(data.id)
        //   .subscribe({
        //     next: (response) => {
        //       this.toastrService.success(response.message);
        //       this.GetAllProfilSupervision();
        //     },
        //     error: (error) => {
        //       this.toastrService.error(error.error.message);
        //     }
        //   })
      }
    });
  }
  changeDateStart(e) {
    this.selectDateStart = moment(this.filterDateStart).format('YYYY-MM-DD');
  }
  changeDateEnd(e) {
    this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
  }

  pipeValue(number: any) {
    return new Intl.NumberFormat('fr-FR').format(number);
  }

  public isFilter(): boolean {
    return (!this.selectedTranaction && !this.selectedReference && !this.selectedImsi && !this.selectedMsisdn && !this.selectDateStart && !this.selectDateEnd) ? true : false
  }
}

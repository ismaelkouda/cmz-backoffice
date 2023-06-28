import { ProvisionningService } from './../../data-access/provisionning.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
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
  public listAchats: any;
  public selectedReference: string;
  public filterDateStart: Date;
  public filterDateEnd: Date;
  public selectDateStart: any;
  public selectDateEnd: any;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;

  public creditDisponible: number = 0;
  public achatByyear: number = 0;
  public achatByWeek: number = 0;
  public achatByDay: number = 0;
  public achatByMounth: number = 0;



  constructor(
    private provisionningService: ProvisionningService,
    private toastService: ToastrService,
    private storage: EncodingDataService

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
    this.isFilter()
  }

  public GetAllAchats() {
    this.provisionningService
      .GetAllAchats({}, this.p)
      .subscribe({
        next: (response) => {
          // this.listAchats = response['data'];
          this.listAchats = response.data;
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

  public GenerateNumeroCommande() {
    this.provisionningService
      .GenerateNumeroCommande()
      .subscribe({
        next: (response) => {
          this.storage.saveData('numero_commande', response['data']);
          this.onInitForm();
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
  }

  public onPageChange(event) {
    this.p = event;
    if (this.isFilter()) {
      this.GetAllAchats()
    } else {
      this.onFilter()
    }
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

  public handleCancel(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Annuler le produit <br> ${data.transaction} ?`,
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
    return true
  }
}

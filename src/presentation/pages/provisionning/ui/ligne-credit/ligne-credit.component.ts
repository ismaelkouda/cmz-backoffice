import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ProvisionningService } from '../../data-access/provisionning.service';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-ligne-credit',
  templateUrl: './ligne-credit.component.html',
  styleUrls: ['./ligne-credit.component.scss']
})
export class LigneCreditComponent implements OnInit {

  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentObject: any;
  public listCredits: any;
  public listTypeSims: Array<any> = [];
  public listStatuts: Array<any> = [];
  public listJournals: Array<any> = [];
  public selectedTransaction: string;
  public selectedReference: string;
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
  public creditDisponible: number;
  public creditAttente: number;
  public provisioncurrentMount: number;
  public provisionLastMount: number;


  constructor(
    private provisionningService: ProvisionningService,
    private toastrService: ToastrService,
    private clipboardApi: ClipboardService,

  ) {
    this.filterDateStart = new Date();
    this.filterDateEnd = new Date();
    this.selectDateStart = moment(this.filterDateStart).format('YYYY-MM-DD');
    this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
    this.listStatuts = ['en-cours', 'annulé'];
  }

  ngOnInit() {
    this.GetAllLigneCredits();
    this.OnStatCredit()
  }


  public GetAllLigneCredits() {
    this.provisionningService
      .GetAllLigneCredits({}, this.p)
      .subscribe({
        next: (res) => {
          this.listCredits = res.data.data;
          this.totalPage = res.data.last_page;
          this.totalRecords = res.data.total;
          this.recordsPerPage = res.data.per_page;
          this.offset = (res.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (err) => {
          this.toastrService.error(err.message);
        }
      })
  }

  public OnStatCredit() {
    this.provisionningService
      .OnStatCredit({})
      .subscribe({
        next: (res) => {
          const data = res['data'];
          this.creditDisponible = data?.credit_disponible;
          this.creditAttente = data?.credit_en_attente;
          this.provisioncurrentMount = data?.provision_mois;
          this.provisionLastMount = data?.provision_mois_m_1;
        },
        error: (err) => {
          this.toastrService.error(err.message);
        }
      })
  }

  public onPageChange(event) {
    this.p = event;
    if (this.isFilter()) {
      this.GetAllLigneCredits()
    } else {
      this.onFilter()
    }
  }
  public onFilter() {
    if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
      this.toastrService.error('Plage de date invalide');
      return;
    }
    this.provisionningService
      .GetAllLigneCredits({
        transaction: this.selectedTransaction,
        reference: this.selectedReference,
        statut: this.selectedStatut,
        date_debut: this.selectDateStart,
        date_fin: this.selectDateEnd,
      }, this.p)
      .subscribe({
        next: (response) => {
          this.listCredits = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }

  public OnCancelCredit(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Annuler la ligne de réference <br> ${data?.reference} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.provisionningService
          .OnCancelCredit({
            transaction: data.transaction
          })
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.GetAllLigneCredits();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })

      }
    });
  }

  showImage(data: any) {
    Swal.fire({
      //text: "<img src='" + data.storage + "' style='width:150px;'>",
      html: "<img src='" + "http://10.10.0.15:8003" + data.justificatif + "' style='width:150px;'>",
      icon: 'info',
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Fermer',
    });
  }
  public copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  public onInitForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;
  }

  public onEditForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = data;
  }

  public onShowForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, show: true };
  }

  public pushListCredits(event: any): void {
    this.listCredits = event;
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
  changeDateStart(e) {
    this.selectDateStart = moment(this.filterDateStart).format('YYYY-MM-DD');
  }
  changeDateEnd(e) {
    this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
  }
  public isFilter(): boolean {
    return (!this.selectedTransaction && !this.selectedReference && !this.selectedStatut && !this.selectDateStart && !this.selectDateEnd) ? true : false
  }


}

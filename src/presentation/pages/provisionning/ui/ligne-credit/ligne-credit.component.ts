import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ProvisionningService } from '../../data-access/provisionning.service';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { StatutTransaction } from 'src/shared/enum/StatutTransaction.enum';
import { MappingService } from 'src/shared/services/mapping.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JournalComponent } from 'src/shared/components/journal/journal.component';
import { TransactionShowComponent } from 'src/shared/components/transaction-show/transaction-show.component';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-ligne-credit',
  templateUrl: './ligne-credit.component.html',
  styleUrls: ['./ligne-credit.component.scss']
})
export class LigneCreditComponent implements OnInit {

  public fileUrl: string;
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
  public ligneCreditStat: any;
  public stateSoumis: string = StatutTransaction.SOUMIS;
  public stateTraite: string = StatutTransaction.TARITER;
  public stateCloture: string = StatutTransaction.CLOTURER;
  public fr: any
  constructor(
    private provisionningService: ProvisionningService,
    private toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    private mappingService: MappingService,
    private modalService: NgbModal,
  ) {
    Object.values(StatutTransaction).forEach(item => {
      this.listStatuts.push(item);
    });
    this.fileUrl = this.mappingService.fileUrl
  }

  ngOnInit() {
    this.GetAllLigneCredits();
    this.fr = {
      dayNames: ["Dimanche", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      dayNamesMin: ["Di","Lu","Ma","Me","Je","Ve","Sa"],
      monthNames: ["janvier","February","March","April","May","June","July","August","September","Octobre","Novembre","December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      today: "AUjourd'hui",
      weekHeader: "Wk"
    }
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
          this.OnStatCredit()
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
          this.ligneCreditStat = res['data'];          
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
          this.toastrService.error(error.error.message);

        }
      })
  }
  public OnRefresh(){
    this.GetAllLigneCredits();
    this.selectedTransaction = null
    this.selectedReference = null
    this.selectedStatut = null
    this.selectDateStart = null
    this.selectDateEnd = null
    this.filterDateStart = null
    this.filterDateEnd = null
  }

    downloadFile(data) {
    window.open(this.fileUrl + data?.justificatif)
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

  public pipeValue(number: any) {
    return new Intl.NumberFormat('fr-FR').format(number);
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
  public pushLigneCreditStat(event: any): void {    
    this.ligneCreditStat = event;
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
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
  OnShowTraitement(data: Object): void {
    const modalRef = this.modalService.open(TransactionShowComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });    
    modalRef.componentInstance.transaction = data;
    modalRef.componentInstance.resultTraitement.subscribe((res) => {
      this.listCredits = res
    })
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
  public isFilter(): boolean {
    return (!this.selectedTransaction && !this.selectedReference && !this.selectedStatut && !this.selectDateStart && !this.selectDateEnd) ? true : false
  }


}

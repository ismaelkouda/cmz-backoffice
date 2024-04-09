import { Component, OnInit,Output,EventEmitter, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import * as moment from 'moment'
import { MappingService } from 'src/shared/services/mapping.service';
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-sender-wrapper',
  templateUrl: './sender-wrapper.component.html',
  styleUrls: ['./sender-wrapper.component.scss']
})
export class SenderWrapperComponent implements OnInit {

  public module: string;
  public subModule: string;
  public selectedSubject: any;
  @Input() selectedTransaction: string;
  @Input() tabsLabel: string;
  @Output() formsView = new EventEmitter();
  @Output() rapport = new EventEmitter();
  public listMessages: Array<any> = [];
  public listStates: Array<any> = [];
  public selectedState: any;
  public currentTransactionId: string;
  public filterDateStart: Date;
  public filterDateEnd: Date;
  public selectDateStart: any;
  public selectDateEnd: any;
  public secondFilter: boolean = false;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number = 1;
  public date: Date | undefined;
  public minDate: Date | undefined
  public maxDate: Date | undefined; 
  public dateToday: Date | undefined;


  constructor(
    private toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    public mappingService: MappingService,
    public supervisionOperationService: SupervisionOperationService,
  ) {
    this.listStates = ['Lu', 'Non lu']
  }

  ngOnInit() {
    this.isFilter();
    this.GetAllMessagesSender()
  }

  
  public GetAllMessagesSender() {
    this.supervisionOperationService
      .GetAllMessagesSender({}, this.p)
      .subscribe({
        next: (res) => {
          this.listMessages = res['data']['data']['data'];
          this.rapport.emit({ 
            total: res['data']['total'],
            total_lus: res['data']['total_lus'],
            total_offres_commerciales: res['data']['total_offres_commerciales'],
            total_contrats: res['data']['total_contrats'],
            total_facture: res['data']['total_facture'],
          })          
          this.totalPage = res['data']['data'].last_page;
          this.totalRecords = res['data']['data'].total;
          this.recordsPerPage = res['data']['data'].per_page;
          this.offset = (res['data']['data'].current_page - 1) * this.recordsPerPage + 1;
        },
        error: (err) => {
          this.toastrService.error(err.message);
        }
      })
  }

  public onFilter(): void {
    if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
      this.toastrService.error('Plage de date invalide');
      return;
    }
    this.supervisionOperationService
      .GetAllMessagesSender({
        sujet: this.selectedSubject,
        lecture_id: this.selectedState,
        date_debut: this.selectDateStart,
        date_fin: this.selectDateEnd
      }, this.p)
      .subscribe({
        next: (res) => {
          this.listMessages = res['data']['data']['data'];
          this.rapport.emit({ 
            total: res['data']['total'],
            total_lus: res['data']['total_lus'],
            total_offres_commerciales: res['data']['total_offres_commerciales'],
            total_contrats: res['data']['total_contrats'],
            total_facture: res['data']['total_facture'],
          })          
          this.totalPage = res['data']['data'].last_page;
          this.totalRecords = res['data']['data'].total;
          this.recordsPerPage = res['data']['data'].per_page;
          this.offset = (res['data']['data'].current_page - 1) * this.recordsPerPage + 1;
        },
        error: (err) => {
          this.toastrService.error(err.message);
        }
      })
  }
  OnRefresh() {
    this.selectedState = null
    this.selectDateStart = null
    this.selectedSubject = null
    this.selectDateEnd = null
    this.filterDateStart = null
    this.filterDateEnd = null
    this.GetAllMessagesSender()
  }

  onPageChange(event: any) {
    this.p = event.pageCount;
    this.onFilter()
  }
  public onInitForm(): void {
    this.formsView.emit(true);
  }
  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  
  public showSecondFilter() {
    this.secondFilter = !this.secondFilter;
  }
  public OnDetailMessagesSender(data: any): void {    
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous lire ce message ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.supervisionOperationService
          .OnDetailMessagesSender({
            message_id: data?.id
          })
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.GetAllMessagesSender();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
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
    return (!this.selectedSubject && !this.selectedState && !this.selectDateStart && !this.selectDateEnd) ? true : false
  }

}

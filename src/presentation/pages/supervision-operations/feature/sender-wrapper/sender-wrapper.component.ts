import { Component, OnInit,Output,EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import * as moment from 'moment'
import { MappingService } from 'src/shared/services/mapping.service';

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
  public listTransactions: Array<any> = [];
  public listStates: Array<any> = [];
  public listStatutTransactions: Array<any> = [];
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
    public mappingService: MappingService
  ) {
    this.listStates = ['Lu', 'Non lu']
  }

  ngOnInit() {
    this.isFilter();
    let currentDate = new Date();
    let prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 90);
    this.minDate = prevDate;
    this.maxDate = currentDate;
    this.dateToday = currentDate;
  }

  public HandleSlaDemandeService(): void {
    
  }
  public onFilter(): void {
    if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
      this.toastrService.error('Plage de date invalide');
      return;
    }
    const data = {
      operation: this.selectedTransaction,
      traite_par: this.selectedState,
      date_debut: this.selectDateStart,
      date_fin: this.selectDateEnd
    };
  }
  OnRefresh() {
    this.onFilter()
    this.selectedState = null
    this.selectDateStart = null
    this.selectedSubject = null
    this.selectDateEnd = null
    this.filterDateStart = null
    this.filterDateEnd = null
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
    return true
  }

}

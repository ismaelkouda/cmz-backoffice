import { Component, OnInit,Output,EventEmitter, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import * as moment from 'moment'
import { SujetEnum } from '../../data-access/sujet.enum';
import { MappingService } from 'src/shared/services/mapping.service';
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
import { SettingService } from 'src/shared/services/setting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowMessageSenderComponent } from '../show-message-sender/show-message-sender.component';
import { ExcelService } from 'src/shared/services/excel.service';
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
  public selectedUser: any;
  @Input() selectedTransaction: string;
  @Input() tabsLabel: string;
  @Output() formsView = new EventEmitter();
  @Output() currentObject = new EventEmitter();
  @Output() rapport = new EventEmitter();
  public listMessages: Array<any> = [];
  public listStates: Array<any> = [];
  public listUsers: Array<any> = [];
  public listSubjects: Array<any> = [];
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
    private modalService: NgbModal,
    private excelService: ExcelService,
    private settingService: SettingService
  ) {
    this.listStates = ['lu', 'non-lu']
    this.listSubjects = [SujetEnum.OFRRE_COMMERCIAL,SujetEnum.CONTRAT,SujetEnum.FACTURE]
  }

  ngOnInit() {
    this.isFilter();
    this.GetAllMessagesSender()
    this.GetAllUsers()
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
            total_factures: res['data']['total_factures'],
           //Taux
            pourcentage_total: res['data']['pourcentage_total'],
            pourcentage_total_lus: res['data']['pourcentage_total_lus'],
            pourcentage_total_offres_commerciales: res['data']['pourcentage_total_offres_commerciales'],
            pourcentage_total_contrats: res['data']['pourcentage_total_contrats'],
            pourcentage_total_factures: res['data']['pourcentage_total_factures']
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
        statut: this.selectedState,
        envoye_par: this.selectedUser,
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
            total_factures: res['data']['total_factures'],
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

OnDownloadMessage(data){    
  this.supervisionOperationService
    .OnDownloadMessage({
      message_id: data.id
    }).subscribe({
      next: (response) => {
        this.toastrService.success(response.message);
        this.GetAllMessagesSender()
      },
      error: (error) => {
        this.toastrService.error(error.error.message);
      }
    })
}
  GetAllUsers() {
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
  public showSecondFilter() {
    this.secondFilter = !this.secondFilter;
  }
  OnShowMessage(data: any): void {
    const modalRef = this.modalService.open(ShowMessageSenderComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });    
    modalRef.componentInstance.transaction = {...data};
    modalRef.componentInstance.resultTraitement.subscribe((res) => {
      this.listMessages = res
    })
  }
  onEditForm(data){
    this.currentObject.emit(data);
  setTimeout(() => {
    this.formsView.emit(data);
  }, 1000);
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
    return (this.listMessages === undefined || this.listMessages?.length === 0) ? true : false
  }
  public isFilter(): boolean {
    return (!this.selectedSubject && !this.selectedState && !this.selectedUser && !this.selectDateStart && !this.selectDateEnd) ? true : false
  }
  public OnExportExcel(): void {
    const data = this.listMessages.map((item: any) => ({
      'Date envoie': item?.created_at,
      'Reference': item?.reference,
      'Sujet': item?.sujet,
      'Objet': item?.objet,
      'Statut': item?.statut,
      'Signature': `${item.signature_nom} ${item.signature_fonction} [${item?.signature_contact}]`,
      'Pièce': item?.piece_jointe ? 'Pièce' : 'Aucune pièce',
      'Demandeur': `${item.demandeur_nom} ${item.signature_fonction} [${item?.signature_contact}]`,
    }));
    this.excelService.exportAsExcelFile(data, 'Liste des Messages envoyés');
  }

}

import { Component, OnInit,Output,EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import * as moment from 'moment'
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
import { SujetEnum } from '../../data-access/sujet.enum';
import { SettingService } from 'src/shared/services/setting.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowMessageRecieveComponent } from '../show-message-recieve/show-message-recieve.component';
import { ExcelService } from 'src/shared/services/excel.service';
import { ModalParams } from 'src/shared/constants/modalParams.contant';

@Component({
  selector: 'app-recipient-wrapper',
  templateUrl: './recipient-wrapper.component.html',
  styleUrls: ['./recipient-wrapper.component.scss']
})
export class RecipientWrapperComponent implements OnInit {

  public module: string;
  public subModule: string;
  public selectedSubject: any;
  @Input() selectedTransaction: string;
  @Input() tabsLabel: string;
  @Output() rapport = new EventEmitter();
  public listMessages: Array<any> = [];
  public listStates: Array<any> = [];
  public listSubjects: Array<any> = [];
  public listUsers: Array<any> = [];
  public selectedState: any;
  public selectedUser: any;
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


  constructor(
    private toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    private settingService: SettingService,
    private supervisionOperationService: SupervisionOperationService,
    private excelService: ExcelService,
    private modalService: NgbModal,
  ) {
    this.listStates = ['lu', 'non-lu']
    this.listSubjects = [SujetEnum.OFRRE_COMMERCIAL,SujetEnum.CONTRAT,SujetEnum.FACTURE]
  }

  ngOnInit() {
    this.isFilter();
    this.GetAllMessagesRecieve()
    this.GetAllUsers()
  }
  public GetAllMessagesRecieve() {
    this.supervisionOperationService
      .GetAllMessagesRecieve({}, this.p)
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
    .GetAllMessagesRecieve({
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
    this.GetAllMessagesRecieve()
  }

  onPageChange(event: any) {
    this.p = event.pageCount;
    this.onFilter()
  }

  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  OnShowMessage(data: any): void {
    const modalRef = this.modalService.open(ShowMessageRecieveComponent, ModalParams);    
    modalRef.componentInstance.transaction = {...data};
    modalRef.componentInstance.IsRead.subscribe(() => {
      this.GetAllMessagesRecieve()
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
      'Référence': item?.reference,
      'Sujet': item?.sujet,
      'Objet': item?.objet,
      'Statut': item?.statut,
      'Signature': `${item?.signature_nom} ${item?.signature_fonction} [${item?.signature_contact}]`,
      'Pièce': item?.piece_jointe ? 'Pièce' : 'Aucune pièce'
    }));
    this.excelService.exportAsExcelFile(data, 'Liste des Messages reçus');
  }

}

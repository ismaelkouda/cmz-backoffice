import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-transaction-sim',
  templateUrl: './transaction-sim.component.html',
  styleUrls: ['./transaction-sim.component.scss']
})
export class TransactionSimComponent implements OnInit {

  public listTransactions: Array<any> = [];
  public listTypeOperations: Array<any> = [];
  public listStatuts: Array<any> = [];
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentObject: any;
  public selectedSim: string;
  public selectedimsi: string;
  public selectedOperation: string;
  public selectedStatut: string;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public display: boolean = false;
  public isMaximized: boolean = false;

  constructor(
    public settingService: SettingService,
    public patrimoineService: PatrimoineService,
    public toastrService: ToastrService,
    private clipboardApi: ClipboardService,

  ) {
    this.listTypeOperations = [
      OperationTransaction.ACTIVATION,
      OperationTransaction.RESILIATION,
      OperationTransaction.SUSPENSION,
      OperationTransaction.SWAP,
      OperationTransaction.VOLUME_DATA
    ],
      this.listStatuts = ['en-cours', 'cloturé']
  }

  ngOnInit() {
    this.isFilter();
    this.GetAllTransactions();
  }

  public GetAllTransactions() {
    this.patrimoineService
      .GetAllTransactions({}, this.p)
      .subscribe({
        next: (response) => {
          this.listTransactions = response.data.data;
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

  public onPageChange(event) {
    this.p = event;
    this.GetAllTransactions()
  }

  public onFilter() {
    this.patrimoineService
      .GetAllTransactions({
        msisdn: this.selectedSim,
        imsi: this.selectedimsi,
        statut: this.selectedStatut,
        operation: this.selectedOperation
      }, this.p)
      .subscribe({
        next: (response) => {
          this.listTransactions = response.data.data;
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
  showJournal(content, data: any) {
    // this.modalService.open(content);
  }

  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }

  public hideDialog(data) {
    this.display = false;
  }
  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }
  public onInitForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }

  public pushListTransactions(event: any): void {
    this.listTransactions = event;
  }

  disableAction(): boolean {
    return null;
  }
  public isFilter(): boolean {
    return (!this.selectedSim && !this.selectedimsi && !this.selectedOperation && !this.selectedStatut) ? true : false
  }

}

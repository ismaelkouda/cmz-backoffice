import { OperationTransaction } from './../../../../../shared/enum/OperationTransaction.enum';
import { formDataBuilder } from './../../../../../shared/constants/formDataBuilder.constant';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { SimStatut } from 'src/shared/enum/SimStatut.enum';
import { HttpClient } from '@angular/common/http';
import { EndPointUrl } from '../../data-access/api.enum';

//@ts-ignore
import appConfig from '../../../../../assets/config/app-config.json';

@Component({
  selector: 'app-suspension-form',
  templateUrl: './suspension-form.component.html',
  styleUrls: ['./suspension-form.component.scss']
})
export class SuspensionFormComponent implements OnInit {


  public BASE_URL: any = appConfig.serverUrl;

  @Output() listSuspensions = new EventEmitter();
  @Input() currentObject;
  @Output() formsView = new EventEmitter();
  @Output() listTransactions = new EventEmitter();

  public selectedValue: string;
  public listPatrimoine: Array<any> = [];
  public listPatrimoineSims: Array<any> = [];
  public totalPageArray: Array<any> = [];
  public currentListSims: Array<any> = [];
  public currentPatrimoine: any = {};
  public selectedVolume: any;
  public display: boolean = false;
  public isMaximized: boolean = false;
  public selectedActionValue: string;
  public radioValue: string = 'IMSI';
  public operationValue: string;
  public piocheSim: string;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public currentListSimsPage: number;
  //Statut
  public statutActif: string = SimStatut.ACTIF;
  public statutSuspendu: string = SimStatut.SUSPENDU;
  public statutResilier: string = SimStatut.RESILIE;
  public statutSwaper: string = SimStatut.SWAPER;

  //71177071
  //Operations Transaction
  public activation: string = OperationTransaction.ACTIVATION;
  public suspension: string = OperationTransaction.SUSPENSION;
  public resiliation: string = OperationTransaction.RESILIATION;
  public swap: string = OperationTransaction.SWAP;
  public volumeData: string = OperationTransaction.VOLUME_DATA;

  //FormsControl
  public selectedImsi: string;
  public selectedDescription: string;
  public selectedPiece: any;
  public selectedMsisdn: string;

  //612030246992221
  constructor(
    private patrimoineService: PatrimoineService,
    private toastrService: ToastrService,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.isFilter();
    this.isActiver();
    this.isSuspendu();
    this.isResilier();
    this.isSwaper();
  }


  close() {
    this.formsView.emit(false);
  }

  public GetAllTransactions() {
    this.patrimoineService
      .GetAllTransactions({}, 1)
      .subscribe({
        next: (response) => {
          this.listTransactions.emit(response.data.data);
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
          this.close();
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public GetAllPatrimoines() {
    this.patrimoineService
      .GetAllPatrimoines({}, this.p)
      .subscribe({
        next: (response) => {
          this.listPatrimoineSims = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
          for (let i = 0; i < this.totalPage; i++) {
            this.totalPageArray.push(i)
          }
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public onVerify() {
    this.patrimoineService
      .OnVerify({
        ...(this.radioValue === 'IMSI' ? { imsi: this.selectedValue } : { msisdn: this.selectedValue })
      }).subscribe(
        (response: any) => {
          this.listPatrimoine = response['data'];
          this.currentPatrimoine = this.listPatrimoine[0];
        },
        (error) => {
          this.toastrService.error(error.message);
        }
      )
  }
  public changeItem(event: any) {
    this.selectedValue = null
  }
  public onChangeFile(file: FileList) {
    this.selectedPiece = file.item(0);
  }
  public handleSaveNewTransaction() {
    let baseUrl;
    const formdata = formDataBuilder({
      operation: this.selectedActionValue,
      imsi: this.currentPatrimoine.imsi,
      ...(this.selectedActionValue === OperationTransaction.SWAP ? { nouveau_imsi: this.selectedImsi } : ''),
      ...(this.selectedActionValue === OperationTransaction.VOLUME_DATA ? { volume: this.selectedVolume } : ''),
      description: this.selectedDescription,
      justificatif: this.selectedPiece,
      data: this.selectedVolume
    })
    if (this.selectedActionValue === OperationTransaction.SWAP) {
      baseUrl = `${this.BASE_URL}${EndPointUrl.SWAPER_SIM}`
    } else if (this.selectedActionValue === OperationTransaction.VOLUME_DATA) {
      baseUrl = `${this.BASE_URL}${EndPointUrl.VOLUME_DATA}`
    } else {
      baseUrl = `${this.BASE_URL}${EndPointUrl.CHANGE_STATUT}`
    }
    this.httpClient.post(`${baseUrl}`, formdata)
      .subscribe({
        next: (res: any) => {
          this.GetAllTransactions();
          this.toastrService.success(res.message);
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }

  public selectedAction(value: string) {
    this.selectedActionValue = value;
    this.selectedImsi = null;
    this.selectedDescription = null;
    this.selectedMsisdn = null;
    this.selectedPiece = null;
  }

  // public piocheAction(value: string) {
  //   this.selectedPioche = value;
  //   this.selectedImsi = null;
  //   if (this.selectedPioche === 'reserver') {
  //     this.GetAllPatrimoines();
  //   }
  // }

  public onSelectedSim(data) {
    this.selectedImsi = data;
    this.hideDialog();
  }

  public GetSimByPage(index) {
    this.patrimoineService
      .GetAllPatrimoines({}, index)
      .subscribe({
        next: (response) => {
          this.display = true;
          this.currentListSims = response.data['data'];
          this.currentListSimsPage = response.data['current_page'];
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public hideDialog() {
    setTimeout(() => {
      this.display = false;
    }, 500);
  }
  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }
  public isFilter(): boolean {
    return !this.selectedValue ? true : false
  }
  public isActiver(): boolean {
    return (this.listPatrimoine.length === 0 || (this.currentPatrimoine?.statut === this.statutActif || this.currentPatrimoine?.statut === this.statutResilier)) ? true : false
  }
  public isSuspendu(): boolean {
    return (this.listPatrimoine.length === 0 || (this.currentPatrimoine?.statut === this.statutSuspendu || this.currentPatrimoine?.statut === this.statutResilier)) ? true : false
  }
  public isResilier(): boolean {
    return (this.listPatrimoine.length === 0 || (this.currentPatrimoine?.statut === this.statutResilier)) ? true : false
  }
  public isSwaper(): boolean {
    return (this.listPatrimoine.length === 0 || (this.currentPatrimoine?.statut === this.statutSwaper || this.currentPatrimoine?.statut === this.statutResilier)) ? true : false
  }

}

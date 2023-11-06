import { OperationTransaction } from '../../../../../shared/enum/OperationTransaction.enum';
import { formDataBuilder } from '../../../../../shared/constants/formDataBuilder.constant';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { SimStatut } from 'src/shared/enum/SimStatut.enum';
import { HttpClient } from '@angular/common/http';
import { EndPointUrl } from '../../data-access/api.enum';

import { environment } from 'src/environments/environment.prod';
import { SettingService } from 'src/shared/services/setting.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {


  public baseUrl: string;

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
  public siteKey: string;
  public currentRecaptcha: string;
  //Statut
  public statutActif: string = SimStatut.ACTIF;
  public statutSuspendu: string = SimStatut.SUSPENDU;
  public statutResilier: string = SimStatut.RESILIE;
  public statutSwaper: string = SimStatut.SWAPER;

  //Operations Transaction
  public activation: string = OperationTransaction.ACTIVATION;
  public suspension: string = OperationTransaction.SUSPENSION;
  public resiliation: string = OperationTransaction.RESILIATION;
  public swap: string = OperationTransaction.SWAP;
  public volume: string = OperationTransaction.VOLUME_DATA;


  //FormsControl
  public listDirections: Array<any> = [];
  public listExploitations: Array<any> = [];
  public listUsages: Array<any> = [];
  public listActivites: Array<any> = [];
  public selectedImsi: string;
  public selectedDescription: string;
  public selectedVoume: any;
  public selectedPiece: any;
  public selectedMsisdn: string;
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedActivite: any;
  public selectedBeneficaire: string;
  public selectedUsage: any;
  public selectedEmail: string;
  public selectedAdresseGeo: string;
  public selectedLongitude: string;
  public selectedLatitude: string;

  //Type Source
  public sourceStock: string = 'stock';
  public sourceOrange: string = 'orangeci';
  public sourceValue: string = this.sourceStock;
  public systemText: string = 'Le système utilisera une SIM dans le stock';
  public orangeText: string = "Orange fournira la SIM. A l'issue de l'operation,la SIM sera livrée au point de contact accompagnée d'une facture";


  //Mapping
  firstLevelLibelle: string;
  secondLevelLibelle: string;
  thirdLevelLibelle: string;


  constructor(
    private patrimoineService: PatrimoineService,
    private settingService: SettingService,
    private toastrService: ToastrService,
    private httpClient: HttpClient,
    private mappingService: MappingService,
    private storage: EncodingDataService,
  ) {
    const data = JSON.parse(this.storage.getData('user'))
    this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`

    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }

  ngOnInit() {
    this.siteKey = environment.recaptcha.siteKey;
    this.getAllDirectionRegionales();
    this.getAllUsages();
    this.getAllZones();
    this.isFilter();
    this.isValidateActivation();
    this.isVerify();
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
  public getAllDirectionRegionales() {
    this.settingService
      .getAllDirectionRegionales({})
      .subscribe({
        next: (response) => {
          this.listDirections = response.data
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public getAllExploiatations() {
    this.settingService
      .getAllExploiatations({})
      .subscribe({
        next: (response) => {
          this.listExploitations = response.data
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public getAllUsages() {
    this.patrimoineService
      .GetAllUsages({})
      .subscribe({
        next: (response) => {
          this.listUsages = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public getAllZones(): void {
    this.settingService
      .getAllZones({})
      .subscribe({
        next: (response) => {
          this.listActivites = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message)
        }
      })
  }
  public onChangeItem(event: any) {
    this.selectedDirection = event.value;
    this.listExploitations = this.selectedDirection?.niveaux_deux.map(element => {
      return { ...element, fullName: `${element.nom} [${element.code}]` }
    });
  }
  public onVerify() {
    this.patrimoineService
      .OnVerify({
        ...(this.radioValue === 'IMSI' ? { imsi: this.selectedValue } : { msisdn: this.selectedValue })
      }).subscribe({
        next: (response: any) => {
          this.currentPatrimoine = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
          // this.currentPatrimoine = {}
        }
      })
  }
  public changeItem(event: any) {
    this.currentPatrimoine = {}
    this.selectedValue = null
    this.selectedVolume = null
    this.selectedDescription = null
  }
  public onChangeFile(file: FileList) {
    this.selectedPiece = file.item(0);
  }
  public handleSaveNewTransaction() {
    let baseUrl;
    let data;
    if (this.selectedActionValue === OperationTransaction.SWAP) {
      data = {
        ...this.currentPatrimoine,
        operation: this.selectedActionValue,
        bac_a_pioche: this.sourceValue,
        description: this.selectedDescription,
      }
      baseUrl = `${this.baseUrl}${EndPointUrl.SWAPER_SIM}`
    } else if (this.selectedActionValue === OperationTransaction.ACTIVATION) {
      data = {
        operation: this.selectedActionValue,
        bac_a_pioche: this.sourceValue,
        niveau_un_id: this.selectedDirection?.id,
        niveau_deux_id: this.selectedExploitation,
        niveau_trois_id: this.selectedActivite,
        beneficiaire: this.selectedBeneficaire,
        usage_id: this.selectedUsage,
        adresse_email: this.selectedEmail,
        adresse_geographique: this.selectedAdresseGeo,
        longitude: this.selectedLongitude,
        latitude: this.selectedLatitude,
      }
      baseUrl = `${this.baseUrl}${EndPointUrl.ACTIVATION_SIM}`

    } else if (this.selectedActionValue === OperationTransaction.VOLUME_DATA) {
      data = {
        ...this.currentPatrimoine,
        operation: this.selectedActionValue,
        description: this.selectedDescription,
        bac_a_pioche: this.sourceValue,
        volume: this.selectedVolume,
      }
      baseUrl = `${this.baseUrl}${EndPointUrl.VOLUME_DATA}`

    }
    else {
      data = formDataBuilder({
        ...this.currentPatrimoine,
        operation: this.selectedActionValue,
        description: this.selectedDescription,
        justificatif: this.selectedPiece,
      })
      baseUrl = `${this.baseUrl}${EndPointUrl.CHANGE_STATUT}`
    }
    this.httpClient.post(`${baseUrl}`, data)
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
    this.selectedValue = null;
    this.sourceValue = 'stock'
    this.currentPatrimoine = {};
  }
  public selectedSource(value: string) {
    this.sourceValue = value;
  }

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

  public isVerify(): boolean {
    return (Object.keys(this.currentPatrimoine).length === 0) ? true : false
  }
  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }
  public isFilter(): boolean {
    return !this.selectedValue ? true : false
  }
  public isValidateActivation(): boolean {
    return (
      // !this.currentRecaptcha ||
      !this.selectedDirection ||
      !this.selectedExploitation ||
      !this.selectedActivite ||
      !this.selectedBeneficaire ||
      !this.selectedUsage ||
      !this.selectedEmail ||
      !this.selectedAdresseGeo ||
      !this.selectedLongitude ||
      !this.selectedLatitude
    ) ? true : false
  }
  pipeValue(number: any) {
    return new Intl.NumberFormat('fr-FR').format(number);
  }

}

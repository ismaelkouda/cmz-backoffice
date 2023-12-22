import { OperationTransaction } from '../../../../../shared/enum/OperationTransaction.enum';
import { formDataBuilder } from '../../../../../shared/constants/formDataBuilder.constant';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { SimStatut } from 'src/shared/enum/SimStatut.enum';
import { HttpClient } from '@angular/common/http';
import { EndPointUrl } from '../../data-access/api.enum';

import { environment } from 'src/environments/environment.prod';
import { SettingService } from 'src/shared/services/setting.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { ApplicationType } from 'src/shared/enum/ApplicationType.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit, OnDestroy {


  public baseUrl: string;
  @Output() listSuspensions = new EventEmitter();
  @Input() currentObject;
  @Output() formsView = new EventEmitter();
  @Output() listTransactions = new EventEmitter();
  public    adminForm: FormGroup;
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
  public patrimoineType: string;

  public historie: any;
  @ViewChild('captchaElem', { static: false }) captchaElem: any;

  //Type Source
  public sourceStock: string = 'stock';
  public sourceOrange: string = 'orangeci';
  public sourceValue: string;

  //Mapping
  public applicationType: string;
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public sourceStockTenantSim: string;
  public sourceStockOrangeSim: string;
  public sourceSoldeDotation: string;

  constructor(
    private patrimoineService: PatrimoineService,
    private settingService: SettingService,
    private toastrService: ToastrService,
    private httpClient: HttpClient,
    private mappingService: MappingService,
    private storage: EncodingDataService,
    private fb: FormBuilder
  ) {
    const data = JSON.parse(this.storage.getData('user'))
    this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
    this.sourceStockTenantSim = this.mappingService.sourceStockTenantSim,
    this.sourceStockOrangeSim = this.mappingService.sourceStockOrangeSim,
    this.sourceSoldeDotation = this.mappingService?.sourceSoldeDotation
    this.applicationType = this.mappingService.applicationType;
    this.patrimoineType = ApplicationType.PATRIMOINESIM;
  }

  ngOnInit() {
    this.siteKey = environment.recaptcha.siteKey;
    this.getAllDirectionRegionales();
    this.getAllUsages();
    this.getAllZones();
    this.isFilter();
    this.initForm();
    this.onGetDrValueChanges();
    this.isVerify();
    this.historie = history.state.patrimoine 
    if (this.historie) {
      this.selectedActionValue = history.state.operation;
      this.operationValue = this.selectedActionValue
      this.currentPatrimoine = history.state.patrimoine   
      this.onFormPachValues()
      this.adminForm.disable() 
    }
    if (this.selectedActionValue === this.swap) {
      this.sourceValue = 'stock'
    } 
  }


  close() {
    history.state.operation = null
    this.formsView.emit(false);
  }

  public initForm(): void {
    this.adminForm = this.fb.group({

      //Identification Controls
      direction_regionale: ['', [Validators.required]],
      exploitation: ['',[Validators.required]],
      zone: ['', [Validators.required]],
      niveau_un_id: [''],
      niveau_deux_id: [''],
      niveau_trois_id: [''],
      usage_id: ['', [Validators.required]],
      point_emplacement: [''],
      adresse_geographique: [''],
      longitude: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      adresse_email: ['', [
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]],
      imsi: [''],
      statut: [''],
      statut_contrat: "",
      msisdn: [''],
      code_pin: [''],
      username: [''],
      site: [''],
      adresse_ip: [''],
      proxy: ['']
    });
  }


  get statut_contrat() {
    return this.adminForm.get('statut').value;
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
          this.toastrService.error(error.error.message);
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
          this.toastrService.error(error.error.message);
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
          this.toastrService.error(error.error.message);
        }
      })
  }
  public getAllExploitation(id: number) {
    this.settingService
      .getAllExploiatations({
        niveau_un_id: id,
      })
      .subscribe(
        (response: any) => {
          this.listExploitations = response['data'];
        },
        (error) => {
          this.toastrService.error(error.error.message);
        }
      )
  }

  onGetDrValueChanges() {
    return this.adminForm.get('direction_regionale').valueChanges.subscribe((value) => {      
      this.getAllExploitation(value);
    });
  }
  public getAllUsages() {
    this.patrimoineService
      .GetAllUsages({})
      .subscribe({
        next: (response) => {
          this.listUsages = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
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
          this.toastrService.error(error.error.message);
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

      this.adminForm.patchValue({
        niveau_un_id: this.adminForm.get('direction_regionale').value,
        niveau_deux_id: this.adminForm.get('exploitation').value,
        niveau_trois_id: this.adminForm.get('zone').value,
        statut_contrat: this.adminForm.get('statut').value
      })
      this.adminForm.get('direction_regionale').disable()
      this.adminForm.get('exploitation').disable()
      this.adminForm.get('zone').disable()
      this.adminForm.get('statut').disable()

      data = formDataBuilder({
        ...this.adminForm.value,
        bac_a_pioche: this.sourceValue !== undefined ? this.sourceValue: 'patrimoine',
        operation: this.selectedActionValue,
        description: this.selectedDescription,
        justificatif: this.selectedPiece,
      })


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
          this.toastrService.error(error.error.message);
        }
      })
  }

  public selectedAction(value: string) {
    this.selectedActionValue = value;
    this.captchaElem?.ReCaptcha2Component.reset();
    this.currentRecaptcha = null
    this.selectedImsi = null;
    this.selectedDescription = null;
    this.selectedMsisdn = null;
    this.selectedPiece = null;
    this.selectedValue = null;
    this.sourceValue = 'stock'
    this.currentPatrimoine = {};
  }
  
  onExpired() {
    this.currentRecaptcha = null
  }

  handleSuccess(event){    
    console.log("event",event);
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
          this.toastrService.error(error.error.message);
        }
      })
  }
  public hideDialog() {
    setTimeout(() => {
      this.display = false;
    }, 500);
  }

  public onFormPachValues(): void {

    console.log("currentPatrimoine",this.currentPatrimoine);
    
    //Identification Controls
    this.adminForm.get('direction_regionale').patchValue(this.currentPatrimoine.direction_regionale?.id);
    this.adminForm.get('exploitation').patchValue(this.currentPatrimoine?.exploitation?.id);
    this.adminForm.get('zone').patchValue(this.currentPatrimoine.zone?.id);
    this.adminForm.get('imsi').patchValue(this.currentPatrimoine?.imsi);
    this.adminForm.get('msisdn').patchValue(this.currentPatrimoine?.msisdn);
    this.adminForm.get('statut').patchValue(this.currentPatrimoine?.statut);
    this.adminForm.get('usage_id').patchValue(this.currentPatrimoine?.usage.id);
    this.adminForm.get('code_pin').patchValue(this.currentPatrimoine?.code_pin);
    this.adminForm.get('adresse_geographique').patchValue(this.currentPatrimoine?.adresse_geographique);
    this.adminForm.get('point_emplacement').patchValue(this.currentPatrimoine?.point_emplacement);
    this.adminForm.get('adresse_email').patchValue(this.currentPatrimoine?.adresse_email);
    this.adminForm.get('longitude').patchValue(this.currentPatrimoine?.longitude);
    this.adminForm.get('latitude').patchValue(this.currentPatrimoine?.latitude);
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
  getFormattedMsisdn(value): string {
    const msisdn = value || ""; // Assurez-vous que msisdn est défini
    const formattedMsisdn = msisdn.replace(/(\d{2})(?=\d)/g, "$1 "); // Ajoute le séparateur
    return formattedMsisdn;
  }
  pipeValue(number: any) {
    return new Intl.NumberFormat('fr-FR').format(number);
  }
  ngOnDestroy(): void {
    history.state.patrimoine = null
    history.state.operation = null
 }
}

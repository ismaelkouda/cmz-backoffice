import { ApplicationType } from './../../../../../shared/enum/ApplicationType.enum';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingService } from 'src/shared/services/setting.service';
import { ToastrService } from 'ngx-toastr';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { Router } from '@angular/router';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { PATRIMOINE } from 'src/shared/routes/routes';
import { TRANSACTION_SIM } from '../../patrimoine-routing.module';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';

@Component({
  selector: 'app-patrimoine-forms',
  templateUrl: './patrimoine-forms.component.html',
  styleUrls: ['./patrimoine-forms.component.scss']
})
export class PatrimoineFormsComponent implements OnInit {

  @Input() currentData;
  @Output() listPatrimoines = new EventEmitter();
  @Output() formsView = new EventEmitter();
  public currentObject: any;
  public listDirectionRegionales: Array<any> = [];
  public listExploitations: Array<any> = [];
  public listZones: Array<any> = [];
  public idDirectionRegionale: any;
  public listTypePersonne: Array<any> = [];
  public listUsage: Array<any> = [];
  public listServices: Array<any> = [];
  public listProfils: Array<any> = [];
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public currentDhcpValue: string;
  public display: boolean = true;
  public isMaximized: boolean = false;
  public adminForm: FormGroup;
  public listActivites: Array<any> = [];
  public listDepartements: Array<any> = [];
  public listCommunes: Array<any> = [];
  public selectedDepartement: any;
  public selectedCommune: any;
  public reactivationComment: string;
  public soldeGlobal: string
  //Mapping
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public minioUrl: string;
  public applicationType: string;
  public patrimoineType: string;
  public baseUrl: string;
  public activation: string = OperationTransaction.ACTIVATION;

  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private toastrService: ToastrService,
    private patrimoineService: PatrimoineService,
    private mappingService: MappingService,
    private storage: EncodingDataService,
    private router: Router
  ) {
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
    this.minioUrl = this.mappingService.minioUrl;
    const data = JSON.parse(this.storage.getData('user'))
    this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`
    this.applicationType = this.mappingService.applicationType;
    this.patrimoineType = ApplicationType.PATRIMOINESIM;
  }

  ngOnInit() {
    console.log("response",this.currentData);

    this.OnGetDetailSim()  
    this.initForm();
  if (!this.currentData?.show) {
    this.onGetDrValueChanges();
    this.getAllDirectionRegionales();
    this.GetAllUsages();
    this.getAllZones();
  }  
    this.OnRefreshValues() ;
  }
  public statutContrat(){
    this.mappingService.statutContrat(this.currentData?.statut)
  }
  public close(): void {
    this.formsView.emit(false);
    this.adminForm.reset();
  }

  getFormattedMsisdn(value): string {
    const msisdn = value || ""; // Assurez-vous que msisdn est défini
    const formattedMsisdn = msisdn.replace(/(\d{2})(?=\d)/g, "$1 "); // Ajoute le séparateur
    return formattedMsisdn;
  }

  public initForm(): void {
    this.adminForm = this.fb.group({

      //Identification Controls
      direction_regionale: ['', [Validators.required]],
      exploitation: [''],
      zone: ['', [Validators.required]],
      usage: ['', [Validators.required]],
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
      msisdn: [''],
      code_pin: [''],
      apni: [''],
      username: [''],
      site: [''],
      adresse_ip: [''],
      proxy: ['']
    });
  }

  public OnGetDetailSim(): void {
    this.patrimoineService
      .OnGetDetailSim(this.currentData?.imsi)
      .subscribe({
        next: (response) => {
          this.currentObject = response['data'];

          console.log("currentObject",this.currentObject);
          
          this.onFormPachValues();
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public getAllDirectionRegionales(): void {
    this.settingService
      .getAllDirectionRegionales({})
      .subscribe({
        next: (response) => {
          this.listDirectionRegionales = response['data'];
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
  public GetAllUsages(): void {
    this.patrimoineService
      .GetAllUsages({})
      .subscribe({
        next: (response) => {
          this.listUsage = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public GetAllDepartements() {
    this.patrimoineService
      .GetAllDepartements({})
      .subscribe({
        next: (response) => {
          this.listDepartements = response['data'];
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
          this.listPatrimoines = response.data.data;
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

  OnRefreshValues(){
    this.mappingService.volumeDataGlobal$.subscribe((res: any) => {
      this.soldeGlobal = res
    });
  }

  public onFormPachValues(): void {

    //Identification Controls
    if (this.currentData?.show) {      
      this.adminForm.get('direction_regionale').patchValue(this.currentObject?.niveau_uns_nom);
      this.adminForm.get('exploitation').patchValue(this.currentObject?.niveau_deux_nom);
      this.adminForm.get('zone').patchValue(this.currentObject?.niveau_trois_nom);
      this.adminForm.get('usage').patchValue(this.currentObject?.nom_usage);
    }else{
      this.adminForm.get('direction_regionale').patchValue(this.currentObject?.niveau_un_id);
      this.adminForm.get('exploitation').patchValue(this.currentObject?.niveau_deux_id);
      this.adminForm.get('zone').patchValue(this.currentObject?.niveau_trois_id);
      this.adminForm.get('usage').patchValue(this.currentObject?.usage?.id);
    }
    this.adminForm.get('imsi').patchValue(this.currentObject?.imsi);
    this.adminForm.get('msisdn').patchValue(this.currentObject?.msisdn);
    this.adminForm.get('statut').patchValue(this.currentObject?.statut);
    this.adminForm.get('code_pin').patchValue(this.currentObject?.code_pin);
    this.adminForm.get('adresse_geographique').patchValue(this.currentObject?.adresse_geographique);
    this.adminForm.get('point_emplacement').patchValue(this.currentObject?.point_emplacement);
    this.adminForm.get('adresse_email').patchValue(this.currentObject?.adresse_email);
    this.adminForm.get('longitude').patchValue(this.currentObject?.longitude);
    this.adminForm.get('latitude').patchValue(this.currentObject?.latitude);

    //Trafic Controls
    this.adminForm.get('apni').patchValue(this.currentObject?.apni);
    this.adminForm.get('username').patchValue(this.currentObject?.username);
    this.adminForm.get('site').patchValue(this.currentObject?.site);
    this.adminForm.get('adresse_ip').patchValue(this.currentObject?.adresse_ip);
    this.adminForm.get('proxy').patchValue(this.currentObject?.proxy);


    //Disabled Controls
    this.adminForm.get('statut').disable();
    this.adminForm.get('imsi').disable();
    this.adminForm.get('msisdn').disable();
    this.adminForm.get('code_pin').disable();
    this.adminForm.get('apni').disable();
    this.adminForm.get('site').disable();
    this.adminForm.get('proxy').disable();
    this.adminForm.get('username').disable();
    this.adminForm.get('adresse_ip').disable();

    if (this.currentData.show) {
      this.adminForm.disable()
      this.statutContrat()
    }
  }
  handleUpdateCampagne() {
    this.adminForm.get('direction_regionale').disable();
    this.adminForm.get('exploitation').disable();
    this.patrimoineService
      .UpdatePatrimoine({
        ...this.adminForm.value,
        sim_id: this.currentObject?.id,
        niveau_un_id: this.adminForm.get('direction_regionale').value,
        niveau_deux_id: this.adminForm.get('exploitation').value,
        niveau_trois_id: this.adminForm.get('zone').value,
        usage_id: this.adminForm.get('usage').value,
      }).subscribe({
        next: (response) => {
          this.toastrService.success(response.message);
          this.GetAllPatrimoines();
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public onDialogMaximized(event) {
    this.display = true
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }

  pipeValue(number: any) {
    return new Intl.NumberFormat('fr-FR').format(number);
  }
  public onTransactionForm(data: any,operation: string): void {
    this.router.navigateByUrl(
      `${PATRIMOINE}/${TRANSACTION_SIM}`,
      { state: {patrimoine: data,operation: operation} }
    );
  }

}      

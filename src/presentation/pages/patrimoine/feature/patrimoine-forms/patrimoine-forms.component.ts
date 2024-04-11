import { ApplicationType } from './../../../../../shared/enum/ApplicationType.enum';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingService } from 'src/shared/services/setting.service';
import { ToastrService } from 'ngx-toastr';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { Router } from '@angular/router';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { DEMANDE_SERVICE } from 'src/shared/routes/routes';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { DEMANDE_ACTIVATION } from 'src/presentation/pages/demandes/demandes-routing.module';
const Swal = require('sweetalert2');

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
  public listUsage: Array<any> = [];
  public listProfils: Array<any> = [];
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public display: boolean = true;
  public isMaximized: boolean = false;
  public adminForm: FormGroup;
  public listActivites: Array<any> = [];
  public listDepartements: Array<any> = [];
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
  public currentTabsIndex: number = 0;

  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private toastrService: ToastrService,
    private patrimoineService: PatrimoineService,
    public mappingService: MappingService,
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
    this.OnGetDetailSim()  
    this.initForm();
  if (!this.currentData?.show) {
    this.onGetDrValueChanges()
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
      direction_regionale: ['', [Validators.required]],
      exploitation: [''],
      zone: ['', [Validators.required]],
      usage: ['', [Validators.required]],
      point_emplacement: [''],
      adresse_geographique: [''],
      longitude: [''],
      latitude: [''],
      adresse_email: ['', [Validators.email]],
      formule: [''],
      imsi: [''],
      statut: [''],
      msisdn: [''],
      date_id_reseau: [''],
      apnni_reseau: [''],
      site_reseau: [''],
      adresse_ip_reseau: ['']
      /*
       0704842695
      */
    });
  }

  public OnGetDetailSim(): void {
    this.patrimoineService
      .OnGetDetailSim(this.currentData?.imsi)
      .subscribe({
        next: (response) => {
          this.currentObject = response['data'];          
          this.onFormPachValues();
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public getAllDirectionRegionales(): void {
    this.settingService
      .GetAllFirstLevelSimple({})
      .subscribe({
        next: (response) => {
          this.listDirectionRegionales = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public getAllZones(): void {
    this.settingService
      .GetAllThirdSimple({})
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
      .GetAllSecondLevelSimple({
        niveau_un_uuid: id,
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
      this.adminForm.get('direction_regionale').patchValue(this.currentObject?.niveau_un_uuid);
      this.adminForm.get('exploitation').patchValue(this.currentObject?.niveau_deux_uuid);
      this.adminForm.get('zone').patchValue(this.currentObject?.niveau_trois_uuid);
      this.adminForm.get('usage').patchValue(this.currentObject?.usage?.id);
    }
    this.adminForm.get('imsi').patchValue(this.currentObject?.imsi);
    this.adminForm.get('msisdn').patchValue(this.currentObject?.msisdn);
    this.adminForm.get('statut').patchValue(this.currentObject?.statut);
    this.adminForm.get('adresse_geographique').patchValue(this.currentObject?.adresse_geographique);
    this.adminForm.get('point_emplacement').patchValue(this.currentObject?.point_emplacement);
    this.adminForm.get('adresse_email').patchValue(this.currentObject?.adresse_email);
    this.adminForm.get('longitude').patchValue(this.currentObject?.longitude);
    this.adminForm.get('latitude').patchValue(this.currentObject?.latitude);
    this.adminForm.get('formule').patchValue(this.currentObject?.formule);

    //Trafic Controls
    this.adminForm.get('date_id_reseau').patchValue(this.currentObject?.date_id_reseau);
    this.adminForm.get('apnni_reseau').patchValue(this.currentObject?.apnni_reseau);
    this.adminForm.get('site_reseau').patchValue(this.currentObject?.site_reseau);
    this.adminForm.get('adresse_ip_reseau').patchValue(this.currentObject?.adresse_ip_reseau);


    //Disabled Controls
    this.adminForm.get('statut').disable();
    this.adminForm.get('imsi').disable();
    this.adminForm.get('msisdn').disable();
    this.adminForm.get('formule').disable();
    this.adminForm.get('date_id_reseau').disable();
    this.adminForm.get('apnni_reseau').disable();
    this.adminForm.get('site_reseau').disable();
    this.adminForm.get('adresse_ip_reseau').disable();

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
        niveau_un_uuid: this.adminForm.get('direction_regionale').value,
        niveau_deux_uuid: this.adminForm.get('exploitation').value,
        niveau_trois_uuid: this.adminForm.get('zone').value,
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
  public onTransactionForm(data: any,operation: string): void {
    this.router.navigateByUrl(
      `${DEMANDE_SERVICE}/${DEMANDE_ACTIVATION}`,
      { state: {patrimoine: data,operation: operation} }
    );
  }
  public handleRefreshData(data: any): void {
    Swal.fire({
      html: `Voulez-vous rafraîchir le solde Data ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.patrimoineService
        .handleRefreshData({
          msisdn: data?.msisdn,
        }).subscribe(
          (response: any) => {
            this.toastrService.success(response.message);
            this.close()
          },
          (error) => {
            this.toastrService.error(error.error.message);
          }
        )
      }
    });
  }
  public handleChangeTabviewIndex(e) {
    this.currentTabsIndex = e.index;
  }

}      

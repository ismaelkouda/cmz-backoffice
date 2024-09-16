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
import { EnvService } from 'src/shared/services/env.service';

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


  uploadedImages: { [key: string]: string } = {};
  imageURLs: { [key: string]: string } = {};
  tempImages: { [key: string]: string } = {};


  public listDirectionRegionales: Array<any> = [];
  public listExploitations: Array<any> = [];
  public listUsage: Array<any> = [];
  public listProfils: Array<any> = [];
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public fileurl : string;
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
    private envService : EnvService,
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
    this.fileurl = this.envService.fileUrl;
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
    this.OnRefreshValues();
  }
  public statutContrat() {
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
      niveau_un_uuid: ['', [Validators.required]],
      niveau_deux_uuid: [''],
      niveau_trois_uuid: ['', [Validators.required]],
      usage: ['', [Validators.required]],
      point_emplacement: [''],
      direction_regionale: [''],
      adresse_geographique: [''],
      longitude: [''],
      latitude: [''],
      zone:[''],
      photo_carte_recto: [''],
      photo_carte_verso: [''],
      photo_physique: [''],
      adresse_email: ['', [Validators.email]],
      formule: [''],
      imsi: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]],
      statut: [""],
      msisdn: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
      date_id_reseau: [''],
      apnni_reseau: [''],
      site_reseau: [''],
      adresse_ip: [],
      exploitation:['']
      /*
       0704842695
      */
    });
    this.adminForm.get("msisdn").valueChanges.subscribe((value) => {
      if (value && value.length > 10) {
        this.adminForm.get("msisdn").setValue(value.slice(0, 10), { emitEvent: false });
      }
    });
    this.adminForm.get("imsi").valueChanges.subscribe((value) => {
      if (value && value.length > 15) {
        this.adminForm.get("imsi").setValue(value.slice(0, 15), { emitEvent: false });
      }
    });
  }


getImageSrc(type: string): string {
  if (this.tempImages[type]) {
      return this.tempImages[type];
  } else if (this.imageURLs[type]) {
      return this.fileurl + this.imageURLs[type];
  }
  return '';
}

onUpload(event: any, type: string) {
  if (event.files && event.files.length > 0) {
      const file = event.files[0];
      
      this.tempImages[type] = URL.createObjectURL(file);
      this.uploadedImages[type] = file;
  }
}



  getImageUrl(file: File): string {
    return URL.createObjectURL(file);
  }
  
  

  public OnGetDetailSim(): void {
    this.patrimoineService
      .OnGetDetailSim(this.currentData?.imsi)
      .subscribe({
        next: (response) => {
          console.log("Retour APi", response['data']);
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
    return this.adminForm.get('niveau_un_uuid').valueChanges.subscribe((value) => {
      this.getAllExploitation(value);
    });
  }

  OnRefreshValues() {
    this.mappingService.volumeDataGlobal$.subscribe((res: any) => {
      this.soldeGlobal = res
    });
  }

  public onFormPachValues(): void {

    //Identification Controls
    if (this.currentData?.show) {
      this.adminForm.get('niveau_un_uuid').patchValue(this.currentObject?.niveau_uns_nom);
      this.adminForm.get('niveau_deux_uuid').patchValue(this.currentObject?.niveau_deux_nom);
      this.adminForm.get('niveau_trois_uuid').patchValue(this.currentObject?.niveau_trois_nom);
      this.adminForm.get('usage').patchValue(this.currentObject?.nom_usage);
    } else {
      this.adminForm.get('niveau_un_uuid').patchValue(this.currentObject?.niveau_un_uuid);
      this.adminForm.get('niveau_deux_uuid').patchValue(this.currentObject?.niveau_deux_uuid);
      this.adminForm.get('niveau_trois_uuid').patchValue(this.currentObject?.niveau_trois_uuid);
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
    this.adminForm.get('apnni_reseau').patchValue(this.currentObject?.apn);
    this.adminForm.get('site_reseau').patchValue(this.currentObject?.site_reseau);
    this.adminForm.get('adresse_ip').patchValue(this.currentObject?.adresse_ip);

     // Set image URLs
     
  if (this.currentObject?.photo_carte_recto) {
    this.imageURLs['recto'] = this.currentObject.photo_carte_recto;
  }
  if (this.currentObject?.photo_carte_verso) {
    this.imageURLs['verso'] = this.currentObject.photo_carte_verso;
  }
  if (this.currentObject?.photo_physique) {
    this.imageURLs['physique'] = this.currentObject.photo_physique;
  }


    //Disabled Controls
    this.adminForm.get('statut').disable();
    this.adminForm.get('imsi').disable();
    this.adminForm.get('msisdn').disable();
    this.adminForm.get('formule').disable();
    this.adminForm.get('date_id_reseau').disable();
    this.adminForm.get('apnni_reseau').disable();
    this.adminForm.get('site_reseau').disable();
    this.adminForm.get('adresse_ip').disable();
    this.adminForm.get('point_emplacement').disable();

    if (this.currentData.show) {
      this.adminForm.disable()
      this.statutContrat()
    }
  }
  handleUpdateCampagne() {
    const formData = new FormData();    
  
    // Désactivez les contrôles du formulaire
    this.adminForm.get('niveau_un_uuid')?.disable();
    this.adminForm.get('exploitation')?.disable();
  
    // Ajoutez les champs du formulaire au FormData
    Object.keys(this.adminForm.controls).forEach(key => {
      const control = this.adminForm.get(key);
      if (control && control.value) {
        formData.append(key, control.value);
      }
    });
  
    // Ajoutez les images au FormData
    if (this.uploadedImages['recto']) {
      formData.append('photo_carte_recto', this.uploadedImages['recto']);
    }
    if (this.uploadedImages['verso']) {
      formData.append('photo_carte_verso', this.uploadedImages['verso']);
    }
    if (this.uploadedImages['physique']) {
      formData.append('photo_physique', this.uploadedImages['physique']);
    }
  
    // Ajoutez le champ sim_id au FormData
    if (this.currentObject?.id) {
      formData.append('sim_id', this.currentObject.id);
    }
  
    // Envoyez les données au service
    this.patrimoineService.UpdatePatrimoine(formData).subscribe({
      next: (response) => {
        this.toastrService.success(response.message);
        this.GetAllPatrimoines();
      },
      error: (error) => {
        this.toastrService.error(error.error.message);
      }
    });
  }
  
  
  public onTransactionForm(data: any, operation: string): void {
    this.router.navigateByUrl(
      `${DEMANDE_SERVICE}/${DEMANDE_ACTIVATION}`,
      { state: { patrimoine: data, operation: operation } }
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
    console.log("content currentTabs :", this.currentTabsIndex )
    this.currentTabsIndex = e.index;
  }

}      

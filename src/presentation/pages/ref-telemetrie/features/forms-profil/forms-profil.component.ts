import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TelemetrieService } from '../../data-access/telemetrie.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MappingService } from 'src/shared/services/mapping.service';
import { handle } from 'src/shared/functions/api.function';
import { SettingService } from 'src/shared/services/setting.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { PatrimoineService } from 'src/presentation/pages/patrimoine/data-access/patrimoine.service';

@Component({
  selector: 'app-forms-profil',
  templateUrl: './forms-profil.component.html',
  styleUrls: ['./forms-profil.component.scss']
})
export class FormsProfilComponent implements OnInit {

  public secondFilter: boolean = false;
  public listTelemetries: Array<any> = [];

  @Input() currentObject;
  @Output() formsView = new EventEmitter();
  @Output() listProfils = new EventEmitter();

  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public formFilter: FormGroup;
  public adminForm: FormGroup;
  public checkedAllConsumers: boolean = false;
  public listAffectations: Array<any> = [];
  public listSms: Array<any> = [];
  public clonedMetrique: { [s: string]: any } = {};
  public currentMetrique: any;
  public globalMetriquesEditRow: Array<any> = [];
  public listSecondLevelDatas: Array<any> = [];
  public listFirstLeveDatas: Array<any> = [];
  public listThirdLevelDatas: Array<any> = [];
  public listUsages: Array<any> = [];
  public listFormule: any = [];
  private response: any = {};
  public indexTabPanelActive: number = 0;

  constructor(
    private telemetrieService: TelemetrieService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    public mappingService: MappingService,
    public settingService: SettingService,
    private loadingBarService: LoadingBarService,
    private patrimoineService: PatrimoineService,
  ) {
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }

  ngOnInit() {
    this.onChangeTabPanel(0);
    this.initForm();
    this.initFormFilter();
    this.GetAllFirstLevel();
    this.GetAllThirdLevel();
    this.GetAllUsages();
    this.GetAllFormules();
    this.GetAllReferentielTelemetrie();
    this.isValidate();
    this.onFormPachValues();
    if (this.currentObject !== undefined) {
      this.GetMetriquesByProfil();
      this.GetSmsMetriquesByProfil();
    }
  }

  private initFormFilter() {
    this.formFilter = this.fb.group({
        niveau_un_uuid: null,
        niveau_deux_uuid: null,
        msisdn: [ null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
        imsi: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]],
        adresse_ip: null,
        usage_id: null,
        apn: null,
        niveau_trois_uuid: null,
        formule_uuid: null,
        zone_trafic: null,
        point_emplacement: null,
    });
    this.formFilter.get("msisdn").valueChanges.subscribe((value) => {
      if (value && value.length > 10) {
        this.formFilter.get("msisdn").setValue(value.slice(0, 10), { emitEvent: false });
      }
    });
    this.formFilter.get("imsi").valueChanges.subscribe((value) => {
      if (value && value.length > 15) {
        this.formFilter.get("imsi").setValue(value.slice(0, 15), { emitEvent: false });
      }
    });
}

public onChangeTabPanel(index: number): void {
  this.indexTabPanelActive = index;
  switch (this.indexTabPanelActive) {
    case 1: this.GetSmsMetriquesByProfil(); break;
  
    default: this.GetMetriquesByProfil(); break;
  }
}

public showSecondFilter() {
    this.secondFilter = !this.secondFilter;
}

public onChangeFirstLvel(uuid: any) {
    this.listSecondLevelDatas = [];
    this.listFirstLeveDatas.find((element) => {
        // if (element.uuid === uuid)  this.listSecondLevelDatas = this.listCommuneService.getListCommune(element);
    });
}

async GetAllFirstLevel() {
  this.response = await handle(() => this.settingService.GetAllFirstLevelSimple({}), this.toastrService, this.loadingBarService);
  if(this.response?.data) this.handleSuccessfulFirstLevel(this.response);
}

private handleSuccessfulFirstLevel(response): void {
    this.listFirstLeveDatas = response['data'].map((element) => { return { ...element, fullName: `${element.nom}` } });
}

async GetAllUsages() {
    this.response = await handle(() => this.patrimoineService.GetAllUsages({}), this.toastrService, this.loadingBarService);
    if(this.response?.data) this.handleSuccessfulUsages(this.response);
}

private handleSuccessfulUsages(response): void {
  this.listUsages = response['data'];
}

async GetAllFormules() {
    this.response = await handle(() => this.settingService.GetAllFormules({}), this.toastrService, this.loadingBarService);
    if(this.response?.data) this.handleSuccessfulFormules(this.response);
}

private handleSuccessfulFormules(response): void {
  this.listFormule = response['data'];
}

async GetAllThirdLevel() {
    this.response = await handle(() => this.settingService.GetAllThirdSimple({}), this.toastrService, this.loadingBarService);
    if(this.response?.data) this.handleSuccessfulThirdLevel(this.response);
}

private handleSuccessfulThirdLevel(response): void {
    this.listThirdLevelDatas = response['data'];
}

  public GetMetriquesByProfil(): void {
    this.telemetrieService
      .GetMetriquesByProfil(this.currentObject?.id)
      .subscribe({
        next: (response) => {
          this.listAffectations = response['data'].metriques;
          this.globalMetriquesEditRow = this.listAffectations.filter(item => {
            return item?.statut === 'actif'
          }).map((data) => {
            return { metrique_id: data?.id, seuil: data?.seuil, statut: data?.statut }
          });
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public GetSmsMetriquesByProfil(): void {
    this.telemetrieService
      .GetSmsMetriquesByProfil(this.currentObject?.id)
      .subscribe({
        next: (response) => {
          this.listSms = response['data'];
          this.globalMetriquesEditRow = this.listSms.filter(item => {
            return item?.statut === 'actif'
          }).map((data) => {
            return { metrique_id: data?.id, seuil: data?.seuil, statut: data?.statut }
          });
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public GetAllProfilSupervision(): void {
    this.telemetrieService
      .GetAllProfilSupervision({})
      .subscribe({
        next: (response) => {
          this.listProfils.emit(response['data']);
          this.close();
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public GetAllReferentielTelemetrie(): void {
    this.telemetrieService
      .GetAllReferentielTelemetrie(this.formFilter.value)
      .subscribe({
        next: (response) => {
          this.listTelemetries = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public OnEditOneRowMetrique(item: any) {
    this.currentMetrique = item;
    this.clonedMetrique[item.id] = { ...item };
  }

  public onRowEditMetriqueSave(metrique: any) {
    const currentMetrique = this.clonedMetrique[metrique.id];
    const data = {
      metrique_id: currentMetrique.id,
      ...(metrique.seuil === null ? { seuil: currentMetrique.seuil } : { seuil: metrique.seuil }),
      ...(metrique.statut === null ? { statut: currentMetrique.statut } : { statut: metrique.statut })
    };
    const checkValue = metriqueParam => this.globalMetriquesEditRow.some(({ metrique_id }) => metrique_id == metriqueParam);
    if (data?.statut === 'inactif' || data?.seuil === null) {
      const indexOfItemInArray = this.globalMetriquesEditRow.findIndex(q => q.metrique_id === data.metrique_id);
      this.globalMetriquesEditRow.splice(indexOfItemInArray, 1);
      // metrique.statut = 'inactif';
      metrique.seuil = null;
      this.toastrService.warning("Veuillez activez l'alarme ou Configurer le seuil");
      return;
    } else {
      if (checkValue(data.metrique_id) === false) {
        this.globalMetriquesEditRow.push(data);
        this.toastrService.info('Enregistrement en attente !', 'EDITION');
      } else {
        const indexOfItemInArray = this.globalMetriquesEditRow.findIndex(q => q.metrique_id === data.metrique_id);
        this.globalMetriquesEditRow.splice(indexOfItemInArray, 1, data);
      }
    }
  }
  public onCancelRowMetrique(metrique: any, index: number) {
    this.listAffectations[index] = this.clonedMetrique[metrique.id];
    delete this.clonedMetrique[metrique.id];
    this.globalMetriquesEditRow.forEach((index) => {
      this.globalMetriquesEditRow.splice(index, 1);
    });
  }
  public onCancelRowSmsMetrique(metrique: any, index: number) {
    this.listSms[index] = this.clonedMetrique[metrique.id];
    delete this.clonedMetrique[metrique.id];
    this.globalMetriquesEditRow.forEach((index) => {
      this.globalMetriquesEditRow.splice(index, 1);
    });
  }
  public initForm(): void {
    this.adminForm = this.fb.group({
      nom: [''],
      description: [''],
    });
  }

  public close(): void {
    this.formsView.emit(false);
    this.adminForm.reset();
  }

  public onFormPachValues(): void {
    this.adminForm.get('nom').patchValue(this.currentObject?.nom);
    this.adminForm.get('description').patchValue(this.currentObject?.description);
    if (this.currentObject.show) {
      this.adminForm.disable()
    }
    this.adminForm.get('nom').disable()
  }

  public handleSaveProfilSupervision() {
    this.telemetrieService
      .handleSaveProfilSupervision({
        nom: this.adminForm.get('nom').value,
        description: this.adminForm.get('description').value,
        metriques: [...this.globalMetriquesEditRow]
      }).subscribe({
        next: (response) => {
          this.adminForm.reset();
          this.GetAllProfilSupervision();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public handleUpdateProfilSupervision() {
    this.telemetrieService
      .handleUpdateProfilSupervision({
        profil_id: this.currentObject?.id,
        nom: this.adminForm.get('nom').value,
        description: this.adminForm.get('description').value,
        metriques: [...this.globalMetriquesEditRow]
      })
      .subscribe({
        next: (response) => {
          this.adminForm.reset();
          this.GetAllProfilSupervision();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  isValidate(): boolean {
    return ((this.globalMetriquesEditRow.length === 0) && !this.adminForm.valid) ? true : false
  }
}

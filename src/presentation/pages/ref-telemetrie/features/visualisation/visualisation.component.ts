import { SettingService } from './../../../../../shared/services/setting.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TelemetrieService } from '../../data-access/telemetrie.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MappingService } from 'src/shared/services/mapping.service';
import { ClipboardService } from 'ngx-clipboard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { handle } from 'src/shared/functions/api.function';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { PatrimoineService } from 'src/presentation/pages/patrimoine/data-access/patrimoine.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.scss']
})
export class VisualisationComponent implements OnInit {

  @Output() visualisationView = new EventEmitter();
  @Input() currentObject;
  @Output() listProfils = new EventEmitter();
  public formFilter: FormGroup;
  public listDatas: Array<any> = [];
  public listSecondLevelDatas: Array<any> = [];
  public listFirstLeveDatas: Array<any> = [];
  public listThirdLevelDatas: Array<any> = [];
  public listUsages: Array<any> = [];
  public listAPN : Array<any> = [];
  public listFormule: any = [];
  public display: boolean = false;
  public listAffectations: any[] = [];
  public checkedAllConsumers: boolean = false;
  public checkconsumerList: Array<any> = [];
  public selectedProfil: any;
  public selectedDirection: any;
  public secondFilter: boolean = false;
  private response: any;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number = 0
  //Mapping
  firstLevelLibelle: string;
  secondLevelLibelle: string;
  thirdLevelLibelle: string;

  constructor(
    private telemetrieService: TelemetrieService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private settingService: SettingService,
    public mappingService: MappingService,
    private clipboardApi: ClipboardService,
    private loadingBarService: LoadingBarService,
    private patrimoineService: PatrimoineService,

  ) {
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }

  ngOnInit() {
    this.initFormFilter();
    this.onChangeAPNValue();
    this.GetAllFirstLevel();
    this.GetAllThirdLevel();
    this.GetAllUsages();
    this.GetAllFormules();
    this.GetAllListSimAffecte();
  }

  private initFormFilter() {
    this.formFilter = this.fb.group({
        profil_id: this.currentObject?.id,
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

public showSecondFilter() {
    this.secondFilter = !this.secondFilter;
}

public onChangeFirstLvel(uuid: any) {
    this.listSecondLevelDatas = [];
    this.listFirstLeveDatas.find((element) => {
        // if (element.uuid === uuid)  this.listSecondLevelDatas = this.listCommuneService.getListCommune(element);
    });
}

public onChangeAPNValue() {
  this.settingService.GetAllAPN({}).subscribe({
      next: (response) => {
          this.listAPN = response["data"];
      },
      error: (error) => {
          this.toastrService.error(error.message);
      },
  })
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
  public GetAllProfilSupervisions(): void {
    this.telemetrieService
      .GetAllProfilSupervision({})
      .subscribe({
        next: (response) => {
          this.listDatas = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public GetAllListSimAffecte() {
    this.telemetrieService
      .GetAllListSimAffecte(this.formFilter.value, this.p)
      .subscribe({
        next: (response) => {
          this.listAffectations = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.page = response.data?.current_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public onPageChange(event) {
    this.p = event;
    this.GetAllListSimAffecte()
  }


  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }

  public onCheckedOneConsumer(consumer: any) {
    if (this.checkconsumerList.includes(consumer.id)) {
      this.checkconsumerList.forEach((value, index) => {
        if (value == consumer.id)
          this.checkconsumerList.splice(index, 1);
      });
    } else if (!this.checkconsumerList.includes(consumer.id)) {
      this.checkconsumerList.push(consumer.id);
    }
    if (this.checkconsumerList.length === this.listAffectations.length) {
      this.checkedAllConsumers = true;
    } else {
      this.checkedAllConsumers = false;
    }
  }
  public OnCheckAllConsumer() {
    this.checkconsumerList = [];
    if (this.checkedAllConsumers) {
      this.listAffectations.forEach((consumer) => {
        consumer.checked = true;
        this.checkconsumerList.push(consumer.id);
      });
    } else {
      this.listAffectations.forEach((consumer) => {
        consumer.checked = false;
      });
      this.checkconsumerList.splice(0, this.checkconsumerList.length);
    }
  }
  public close(): void {
    this.visualisationView.emit(false);
  }
  openForm(content) {
    this.GetAllProfilSupervisions();
    this.modalService.open(content, {centered:true});
  }
  hideForm() {
    this.modalService.dismissAll();
    this.selectedProfil = undefined;
  }
  public handleSaveReaffectation() {
    this.telemetrieService
      .handleSaveReaffectation({
        profil_id: this.selectedProfil?.id,
        sims: this.checkconsumerList
      })
      .subscribe({
        next: (response) => {
          this.GetAllProfilSupervision();
          this.hideForm();
          this.selectedProfil = undefined;
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public handleRetraitSim(): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous retirer ce(s) SIM(s)`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.telemetrieService
          .handleRetraitSim({
            profil_id: this.currentObject?.id,
            sims: this.checkconsumerList
          })
          .subscribe({
            next: (response) => {
              this.GetAllProfilSupervision();
              this.selectedProfil = undefined;
              this.toastrService.success(response.message);
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
}

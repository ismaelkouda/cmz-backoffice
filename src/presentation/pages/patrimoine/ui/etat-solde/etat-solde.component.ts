import { FormatNumberPipe } from './../../../../../shared/pipes/formatNumber.pipe';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { ClipboardService } from 'ngx-clipboard';
import { ExcelService } from 'src/shared/services/excel.service';
import { TypeAlarme } from 'src/shared/enum/TypeAlarme.enum';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import * as moment from 'moment';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Title } from '@angular/platform-browser';
import { ListCommuneService } from 'src/shared/services/list-commune.service';
import { handle } from 'src/shared/functions/api.function';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-etat-solde',
  templateUrl: './etat-solde.component.html',
  styles: [`*td { padding: 0.6rem !important; }`]
})
export class EtatSoldeComponent implements OnInit {

  public module: string;
  public subModule: string;
  public initialView: boolean = true;
  public formsView: boolean = false;
  public affectationView: boolean = false;
  public visualisationView: boolean = false;
  public currentObject: any;
  public listAlarmes: any[] = [];
  public listEtats: any[] = [];
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public total: number = 0;
  public page: number
  public formFilter: FormGroup;
  public listFirstLeveDatas: Array<any> = [];
  public listSecondLevelDatas: Array<any> = [];
  public listThirdLevelDatas: Array<any> = [];
  public listUsages: Array<any> = [];
  public listFormule: any = [];
  private response: any;
  public selectedUsage: string;
  public selectedZone: string;
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public secondFilter: boolean = false;
  public selectDateStart: any;
  public selectDateEnd: any;
  public selectedEmplacement: string
  public title = 'Etat des soldes - Système de Gestion de Collecte Centralisée';

  constructor(
    private patrimoineService: PatrimoineService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private mappingService: MappingService,
    private settingService: SettingService,
    private clipboardApi: ClipboardService,
    private excelService: ExcelService,
    private loadingBarService: LoadingBarService,
    private titleService: Title,
    private listCommuneService: ListCommuneService,
    private fb: FormBuilder,
  ) {
    this.titleService.setTitle(`${this.title}`);
    Object.values(TypeAlarme).forEach(item => {
      this.listAlarmes.push(item);
    });
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }
  // if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
  //   this.toastrService.error('Plage de date invalide');
  //   return;
  // }
  ngOnInit() {
    this.initFormFilter();
    this.GetAllUsages();
    this.GetAllFormules();
    this.GetAllFirstLevel();
    this.GetAllThirdLevel();
    this.disableAction()
    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[3];
    });
  }

  private initFormFilter() {
    this.formFilter = this.fb.group({
        alarme: [null, Validators.required],
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
        date_debut: null,
        date_fin: null
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

    if (history.state?.statut) {
      this.formFilter.get("alarme").patchValue(history.state?.statut);
      this.GetAllEtats()
    }
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

  public GetAllEtats(): void {
    if (moment(this.formFilter.get('date_debut').value).isAfter(moment(this.formFilter.get('date_fin').value))) {
      this.toastrService.error('Plage de date invalide');
      return;
    }
    this.patrimoineService
      .GetAllEtats({
        ...(history.state?.statut ? { alarme: history.state?.statut } : this.formFilter.value)
      }, this.p)
      .subscribe({
        next: (response) => {
          this.listEtats = response.data.data;
          console.log('this.listEtats', this.listEtats)
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
          this.total = response.data.total;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public GetAllFirstLevel() {
    this.settingService
      .GetAllFirstLevelSimple({})
      .subscribe({
        next: (response) => {
          this.listFirstLeveDatas = response['data'].map(element => {
            return { ...element, fullName: `${element.nom}` }
          });
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  onChangeFirstLvel(uuid: any) {
    this.listSecondLevelDatas = [];
    this.listFirstLeveDatas.find((element) => {
        if (element.uuid === uuid)  this.listSecondLevelDatas = this.listCommuneService.getListCommune(element);
    });
  }
  public GetAllThirdLevel() {
    this.settingService
      .GetAllThirdSimple({})
      .subscribe({
        next: (response) => {
          this.listThirdLevelDatas = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }

  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
  public pushListProfils(event: any): void {
    this.listEtats = event;
  }
  public showSecondFilter() {
    this.secondFilter = !this.secondFilter;
  }
  public onPageChange(event) {
    this.p = event;
    this.GetAllEtats();
  }
  
  public disableAction(): boolean {
    return (this.listEtats === undefined || this.listEtats?.length === 0) ? true : false
  }
  changeDateStart(e) {
    const dateDebut = this.formFilter.get('date_debut').value;
    if (moment(dateDebut).isValid()) {
      this.formFilter.get('date_debut').patchValue(moment(dateDebut).format('YYYY-MM-DD'));
    }
  }
  changeDateEnd(e) {
    const dateFin = this.formFilter.get('date_fin').value;
    if (moment(dateFin).isValid()) {
      this.formFilter.get('date_fin').patchValue(moment(dateFin).format('YYYY-MM-DD'));
    }
  }
  public OnExportExcel(): void {
    const data = this.listEtats.map((item: any) => ({
      [this.firstLevelLibelle]: item?.niveau_uns_nom,
      [this.secondLevelLibelle]: item?.niveau_deux_nom,
      [this.thirdLevelLibelle]: item?.niveau_trois_nom,
      'MSISDN': item?.msisdn,
      'IMSI': item?.imsi,
      'Emplacement': item?.point_emplacement,
      'Alarme': item?.alarme,
      'Date création': item?.created_at,
      'Solde (Go)': this.formatNumberPipe.transform(item?.solde_actuel_go, 2),
      'Date MAJ': item?.updated_at,
    }));
    this.excelService.exportAsExcelFile(data, 'Liste des états de soldes');
  }
  private formatNumberPipe: FormatNumberPipe = new FormatNumberPipe();

}

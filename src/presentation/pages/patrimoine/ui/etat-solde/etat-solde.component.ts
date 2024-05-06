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
const Swal = require('sweetalert2');
import * as moment from 'moment';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-etat-solde',
  templateUrl: './etat-solde.component.html',
  styleUrls: ['./etat-solde.component.scss']
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
  public listFirstLeveDatas: Array<any> = [];
  public listSecondLevelDatas: Array<any> = [];
  public listThirdLevelDatas: Array<any> = [];
  public selectedAlarme: string;
  public selectedMsisdn: string;
  public selectedImsi: string
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedUsage: string;
  public selectedZone: string;
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public secondFilter: boolean = false;
  public filterDateStart: Date;
  public filterDateEnd: Date;
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
    private loadingBar: LoadingBarService,
    private titleService: Title
  ) {
    this.titleService.setTitle(`${this.title}`);
    Object.values(TypeAlarme).forEach(item => {
      this.listAlarmes.push(item);
    });
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }

  ngOnInit() {
    this.GetAllFirstLevel();
    this.GetAllThirdLevel();
    this.isFilter();
    this.disableAction()
    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[4];
    });
    if (history.state?.statut) {
      this.selectedAlarme = history.state?.statut;
      this.GetAllEtats()
    }
  }

  public GetAllEtats(): void {
    this.patrimoineService
      .GetAllEtats({
        ...(history.state?.statut ? { alarme: history.state?.statut } : {})
      },this.p)
      .subscribe({
        next: (response) => {
          this.listEtats = response.data.data;
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
  public OnRefresh(){
    this.loadingBar.start()
    setTimeout(() => {
      this.listEtats.splice(0, this.listEtats.length);
      this.selectedAlarme = null
      this.selectedDirection = null
      this.selectedExploitation = null
      this.selectedUsage = null
      this.selectedMsisdn = null
      this.selectedZone = null
      this.selectedEmplacement = null
      this.selectedImsi = null
      this.selectDateStart = null
      this.selectDateEnd = null
      this.filterDateStart = null
      this.filterDateEnd = null
      this.totalRecords = 0;
      this.secondFilter = false;
      this.loadingBar.stop()
    }, 1000);
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

  onChangeFirstLvel(event: any) {
    this.selectedDirection = event.value;
    this.listSecondLevelDatas = this.selectedDirection?.niveaux_deux.map(element => {
      return { ...element, fullName: `${element.nom}` }
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
    if (this.isFilter()) {
      this.GetAllEtats()
    } else {
      this.onFilter()
    }
  }
  onFilter() {
    if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
      this.toastrService.error('Plage de date invalide');
      return;
    }
    this.patrimoineService
      .GetAllEtats({
        alarme: this.selectedAlarme,
        niveau_un_uuid: this.selectedDirection?.uuid,
        niveau_deux_uuid: this.selectedExploitation?.uuid,
        niveau_trois_uuid: this.selectedUsage,
        zone_trafic: this.selectedZone,
        msisdn: this.selectedMsisdn,
        imsi: this.selectedImsi,
        point_emplacement: this.selectedEmplacement,
        date_debut: this.selectDateStart,
        date_fin: this.selectDateEnd,

      },this.p)
      .subscribe({
        next: (response) => {
          this.listEtats = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1
          this.total = response.data.total;
          this.page = response.data?.current_page;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public disableAction(): boolean {
    return (this.listEtats === undefined || this.listEtats?.length === 0) ? true : false
  }
  public isFilter(): boolean {
    return (!this.selectedAlarme && !this.selectedMsisdn && !this.selectedImsi) ? true : false
  }

  changeDateStart(e) {
    if ( moment(this.filterDateStart).isValid()) {
      this.selectDateStart = moment(this.filterDateStart).format('YYYY-MM-DD');
    }else{
      this.selectDateStart = null
    }
  }
  changeDateEnd(e) { 
    if ( moment(this.filterDateEnd).isValid()) {
      this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
    }else{
      this.selectDateEnd = null
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

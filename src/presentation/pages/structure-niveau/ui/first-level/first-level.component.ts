import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { FormValidator } from '../../../../../shared/utils/spacer.validator';
import { ClipboardService } from 'ngx-clipboard';
import { ExcelService } from 'src/shared/services/excel.service';
import { Title } from '@angular/platform-browser';
import { StoreCurrentUserService } from '@shared/services/store-current-user.service';

@Component({
  selector: 'app-first-level',
  templateUrl: './first-level.component.html',
  styleUrls: ['./first-level.component.scss']
})
export class FirstLevelComponent implements OnInit {

  public initialView: boolean = true;
  public formsView: boolean = false;
  public affectationView: boolean = false;
  public visualisationView: boolean = false;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number = 0
  public currentObject: any;
  public listFirstLevelDatas: Array<any> = [];
  public selectedNom: string;
  public selectedCommune: string;
  public selectedCode: string;
  public firstLevelLibel: string|undefined;
  public secondLevelLibel: string|undefined;
  // public firstLevelLibelle: string;
  public firstLevelMenus: string;
  // public secondLevelLibelle: string;
  public adminForm: FormGroup;
  public currentTabsIndex: number = 0;
  public title = '1er niveau - Système de Gestion de Collecte Centralisée';


  constructor(
    private settingService: SettingService,
    private toastrService: ToastrService,
    public mappingService: MappingService,
    private excelService: ExcelService,
    private clipboardApi: ClipboardService,
    private fb: FormBuilder,
    private titleService: Title,
    private storeCurrentUserService: StoreCurrentUserService
  ) {
    this.titleService.setTitle(`${this.title}`);
    // this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    // this.firstLevelMenus = this.mappingService.structureGlobale?.niveau_1_menu;
    // this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    const currentUser = this.storeCurrentUserService.getCurrentUser;
    this.firstLevelLibel = currentUser?.structure_organisationnelle?.niveau_1;
    this.secondLevelLibel = currentUser?.structure_organisationnelle?.niveau_2;
    this.firstLevelMenus = currentUser?.structure_organisationnelle?.niveau_1_menu;
  }

  ngOnInit() {
    this.GellAllFirstLevel();
    this.onInitForm();
    this.isFilter();
  }
  public GellAllFirstLevel() {
    this.settingService
      .getAllDirectionRegionales({},this.p)
      .subscribe({
        next: (response) => {
          this.listFirstLevelDatas = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.page = response.data?.current_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;        
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public onFilter() {
    this.settingService
      .getAllDirectionRegionales({
        nom: this.selectedNom
       },this.p)
      .subscribe({
        next: (response) => {
          this.listFirstLevelDatas = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.page = response.data?.current_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;                },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public onPageChange(event) {
    this.p = event;
    if (this.isFilter()) {
      this.GellAllFirstLevel()
    } else {
      this.onFilter()
    }
  }
  public OnRefresh(){
    this.p = 1;
    this.GellAllFirstLevel();
    this.selectedNom = null
    this.selectedCode = null
  }

  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  onInitForm() {
    this.adminForm = this.fb.group({
      nom: ['', [
        Validators.required,
        FormValidator.cannotContainSpace
      ]],
      code: ['', [
        Validators.required,
        FormValidator.cannotContainSpace,
        FormValidator.symbolsOnly,
      ]],
    })
  }

  public OnOpenForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;
  }
  public onEditForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, type: 'edit' };
  }
  public onShowForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, type: 'show' };
  }

  OnVisualisation(data) {
    this.totalPage = 0;
    this.totalRecords = 0;
    this.recordsPerPage = 0;
    this.page = 1;    
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, type: 'visualiser' };
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
  public pushListProfils(event: any): void {
    this.listFirstLevelDatas = event?.data;
  }
  handleChangeTabviewIndex(e) {
    this.currentTabsIndex = e.index;
  }
  public OnExportExcel(): void {
    const data = this.listFirstLevelDatas.map((item: any) => ({
      [this.firstLevelLibel]: item?.nom,
      ['#'+this.secondLevelLibel]: item?.niveaux_deux_count,
    }));
    this.excelService.exportAsExcelFile(data, `Lise des ${this.firstLevelLibel}`);
  }
  public isFilter(): boolean {
    return (!this.selectedNom && !this.selectedCode && !this.selectedCommune) ? true : false
  }
}

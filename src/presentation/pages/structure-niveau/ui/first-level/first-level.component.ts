import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { FormValidator } from '../../../../../shared/utils/spacer.validator';
import { ClipboardService } from 'ngx-clipboard';
import { ExcelService } from 'src/shared/services/excel.service';

const Swal = require('sweetalert2');

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
  public currentObject: any;
  public listFirstLevelDatas: Array<any> = [];
  public listSecondLevelDatas: Array<any> = [];
  public selectedNom: string;
  public selectedCode: string;
  public firstLevelLibelle: string;
  public firstLevelMenus: string;
  public firstLevelLibelleSplit: string;
  public secondLevelLibelle: string;
  public currentLevel: any;
  public isEdit: boolean = false;
  public isShow: boolean = false;
  public adminForm: FormGroup;
  public affectationForm: FormGroup
  public currentTabsIndex: number = 0;


  constructor(
    private settingService: SettingService,
    private toastrService: ToastrService,
    private mappingService: MappingService,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private clipboardApi: ClipboardService,
    private fb: FormBuilder

  ) {
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.firstLevelMenus = this.mappingService.structureGlobale?.niveau_1_menu;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
  }

  ngOnInit() {
    this.GellAllFirstLevel();
    this.GellAllSecondLevel();
    this.onInitForm();
    this.isFilter();
  }

  public GellAllFirstLevel() {
    this.settingService
      .getAllDirectionRegionales({})
      .subscribe({
        next: (response) => {
          this.listFirstLevelDatas = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public onFilter() {
    this.settingService
      .getAllDirectionRegionales({
        nom: this.selectedNom,
        code: this.selectedCode
      })
      .subscribe({
        next: (response) => {
          this.listFirstLevelDatas = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }

  public OnRefresh(){
    this.GellAllFirstLevel();
    this.selectedNom = null
    this.selectedCode = null
  }

  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }

  public GellAllSecondLevel() {
    this.settingService
      .getAllExploiatations({})
      .subscribe({
        next: (response) => {
          this.listSecondLevelDatas = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
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
  openForm(content) {
    this.modalService.open(content);
    this.isShow = false;
    this.isEdit = false;
    this.adminForm.reset();
    this.adminForm.enable();
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
  OnAffectaion(data) {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, type: 'affectation' };
  }
  OnVisualisation(data) {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, type: 'visualiser' };
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
  public pushListProfils(event: any): void {
    this.listFirstLevelDatas = event;
  }

  handleChangeTabviewIndex(e) {
    this.currentTabsIndex = e.index;
  }

  public OnExportExcel(): void {
    const data = this.listFirstLevelDatas.map((item: any) => ({
      [this.firstLevelLibelle]: item?.nom,
      'Code': item?.code,
      ['#'+this.secondLevelLibelle]: item?.niveaux_deux_count,
    }));
    this.excelService.exportAsExcelFile(data, `Lise des ${this.firstLevelLibelle}`);
  }
  public isFilter(): boolean {
    return (!this.selectedNom && !this.selectedCode) ? true : false
  }
}

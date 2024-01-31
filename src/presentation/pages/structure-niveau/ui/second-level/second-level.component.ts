import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/shared/services/excel.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { FormValidator } from 'src/shared/utils/spacer.validator';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-second-level',
  templateUrl: './second-level.component.html',
  styleUrls: ['./second-level.component.scss']
})
export class SecondLevelComponent implements OnInit {

  public initialView: boolean = true;
  public formsView: boolean = false;
  public affectationView: boolean = false;
  public visualisationView: boolean = false;
  public currentObject: any;
  public listCurrentLevelDatas: Array<any> = [];
  public listFirstLevelDatas: Array<any> = [];
  public selectedNom: string;
  public selectedCode: string;
  public selectedCodes: string;
  public selectedParent: any;
  public currentLevelLibelle: string;
  public currentLevelLibelleSplit: string;
  public childLevelLibelle: string;
  public parentLevelLibelle: string;
  public currentLevelMenus: string;
  public currentLevel: any;
  public isEdit: boolean = false;
  public isShow: boolean = false;
  public adminForm: FormGroup;

  constructor(
    private settingService: SettingService,
    private toastrService: ToastrService,
    private mappingService: MappingService,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private clipboardApi: ClipboardService,
    private fb: FormBuilder
  ) {
    this.currentLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.childLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
    this.parentLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.currentLevelMenus = this.mappingService.structureGlobale?.niveau_2_menu;
  }

  ngOnInit() {
    this.GellCurrentLevel();
    this.GellAllFirstLevel();
    this.onInitForm();
    this.isFilter();
  }

  public GellCurrentLevel() {
    this.settingService
      .getAllExploiatations({})
      .subscribe({
        next: (response) => {
          this.listCurrentLevelDatas = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }

  public onFilter() {
    this.settingService
      .getAllExploiatations({
        nom: this.selectedNom,
        code: this.selectedCodes,
        niveau_un_uuid: this.selectedParent
      })
      .subscribe({
        next: (response) => {
          this.listCurrentLevelDatas = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }

  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
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
      niveau_un_uuid: ['', [Validators.required]]
    })
  }
  hideForm() {
    this.modalService.dismissAll();
    this.adminForm.reset();
  }
  public openForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;
  }
  public onEditForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = data;
  }
  public onShowForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, show: true };
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
  public pushListDatas(event: any): void {
    this.listCurrentLevelDatas = event;
  }
  public OnExportExcel(): void {
    const data = this.listCurrentLevelDatas.map((item: any) => ({
      [this.currentLevelLibelle]: item?.nom,
      'Code': item?.code,
      [this.parentLevelLibelle]: item?.niveau_un?.nom,
      '# SIM Affectées': item?.sims_count,
    }));
    this.excelService.exportAsExcelFile(data, `Lise des ${this.currentLevelLibelle}`);
  }
  public isFilter(): boolean {
    return (!this.selectedNom && !this.selectedCodes) ? true : false
  }
}

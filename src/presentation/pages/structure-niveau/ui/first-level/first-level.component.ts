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
  public firstLevelLibelleSplit: string;
  public secondLevelLibelle: string;
  public currentLevel: any;
  public isEdit: boolean = false;
  public isShow: boolean = false;
  public adminForm: FormGroup;
  public affectationForm: FormGroup


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
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
  }

  ngOnInit() {
    this.GellAllFirstLevel();
    this.GellAllSecondLevel();
    this.onInitForm();
    this.onInitAffectation();
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
  onEditForm(item: any, content: any) {
    this.currentLevel = item;
    this.isEdit = true;
    this.isShow = false;
    this.modalService.open(content);
    this.adminForm.get('nom').patchValue(item?.nom);
    this.adminForm.get('code').patchValue(item?.code);
    this.adminForm.enable();
  }

  onShowForm(item: any, content: any) {
    this.isShow = true;
    this.isEdit = false;
    this.modalService.open(content);
    this.adminForm.get('nom').patchValue(item?.nom);
    this.adminForm.get('code').patchValue(item?.code);
    this.adminForm.disable();
  }
  hideForm() {
    this.modalService.dismissAll();
    this.adminForm.reset();
  }
  OnSaveFirstLevel() {
    this.settingService
      .OnSaveDirectionRegionale(this.adminForm.value)
      .subscribe({
        next: (response) => {
          this.adminForm.reset();
          this.hideForm();
          this.GellAllFirstLevel();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  OnUpdateFirstLevel() {
    this.settingService
      .OnUpdateDirectionRegionale({
        niveau_un_id: this.currentLevel?.id,
        ...this.adminForm.value,
      })
      .subscribe({
        next: (response) => {
          this.adminForm.reset();
          this.hideForm();
          this.GellAllFirstLevel();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }

  //Affectation Form
  onInitAffectation() {
    this.affectationForm = this.fb.group({
      niveau_un_id: [''],
      niveau_deux: ['', [Validators.required]],
    })
  }
  openAffectationForm(item: any, content: any) {
    this.modalService.open(content);
    this.affectationForm.get('niveau_un_id').patchValue(item?.niveau_un_id);
    this.affectationForm.reset();
  }
  hideAffeactationForm() {
    this.modalService.dismissAll();
    this.affectationForm.reset();
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

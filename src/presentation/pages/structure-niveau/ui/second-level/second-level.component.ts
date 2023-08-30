import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
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
  public currentLevelLibelle: string;
  public currentLevelLibelleSplit: string;
  public childLevelLibelle: string;
  public parentLevelLibelle: string;
  public currentLevel: any;
  public isEdit: boolean = false;
  public isShow: boolean = false;
  public adminForm: FormGroup;

  constructor(
    private settingService: SettingService,
    private toastrService: ToastrService,
    private mappingService: MappingService,
    private modalService: NgbModal,
    private clipboardApi: ClipboardService,
    private fb: FormBuilder
  ) {
    this.currentLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    // const keyWord = this.currentLevelLibelle.split(" ").map(item => {
    //   return `${item}`
    // });
    // this.currentLevelLibelleSplit = keyWord.join(" ");
    this.childLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
    this.parentLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
  }

  ngOnInit() {
    this.disableAction();
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
        nom: this.selectedNom
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
      niveau_un_id: ['', [Validators.required]]
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
    this.adminForm.get('niveau_un_id').patchValue(item?.niveau_un_id);
    this.adminForm.enable();
  }
  onShowForm(item: any, content: any) {
    this.isShow = true;
    this.isEdit = false;
    this.modalService.open(content);
    this.adminForm.get('nom').patchValue(item?.nom);
    this.adminForm.get('code').patchValue(item?.code);
    this.adminForm.get('niveau_un_id').patchValue(item?.niveau_un_id);
    this.adminForm.disable();
  }
  hideForm() {
    this.modalService.dismissAll();
    this.adminForm.reset();
  }
  OnSaveSecondLevel() {
    this.settingService
      .OnSaveExploitation(this.adminForm.value)
      .subscribe({
        next: (response) => {
          this.GellCurrentLevel();
          this.adminForm.reset();
          this.hideForm();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  OnUpdateSecondLevel() {
    this.settingService
      .OnUpdateEploitation({
        niveau_deux_id: this.currentLevel?.id,
        niveau_un_id: this.adminForm.get('niveau_un_id').value,
        ...this.adminForm.value
      })
      .subscribe({
        next: (response) => {
          this.GellCurrentLevel();
          this.adminForm.reset();
          this.hideForm();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }

  public disableAction(): boolean {
    return this.listCurrentLevelDatas?.length === 0 ? true : false
  }
  public isFilter(): boolean {
    return (!this.selectedNom) ? true : false
  }
}

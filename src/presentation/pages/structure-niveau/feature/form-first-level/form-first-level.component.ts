import { SettingService } from './../../../../../shared/services/setting.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MappingService } from 'src/shared/services/mapping.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormValidator } from 'src/shared/utils/spacer.validator';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-form-first-level',
  templateUrl: './form-first-level.component.html',
  styleUrls: ['./form-first-level.component.scss']
})
export class FormFirstLevelComponent implements OnInit {

  listAffectations: any[] = [];
  @Output() formsView = new EventEmitter();
  @Input() currentObject;
  @Output() listFirstLevelDatas = new EventEmitter();
  public display: boolean = false;
  public checkedAllConsumers: boolean = false;
  public checkconsumerList: any[] = [];
  public listDirections: Array<any> = [];
  public listExploitations: Array<any> = [];
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedMsisdn: string;
  public selectedImsi: string;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number = 0;
  public adminForm: FormGroup;
  public selectedGroupe: string;
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public firstLevelMenus: string;
  public secondLevelMenus: string;

  constructor(
    private toastrService: ToastrService,
    private settingService: SettingService,
    private mappingService: MappingService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
    this.firstLevelMenus = this.mappingService.structureGlobale?.niveau_1_menu;
    this.secondLevelMenus = this.mappingService.structureGlobale?.niveau_2_menu;
  }
  ngOnInit() {    
    if (!this.currentObject) {
    }else if (this.currentObject?.type === 'visualiser' || this.currentObject?.type === 'show') {
      this.GetAllSecondLevelSimple()
    }
    this.isFilter();
    this.initForm();
    this.onFormPachValues()
  }
  public GetAllGroupes() {
    this.settingService
      .getAllDirectionRegionales({},1)
      .subscribe({
        next: (response) => {
          this.listFirstLevelDatas.emit(response['data']);
          this.close()
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public GetAllSecondLevelSimple() {
    this.settingService
      .getAllExploiatations({
        niveau_un_uuid: this.currentObject?.uuid,
      },this.p)
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
    this.GetAllSecondLevelSimple()
  }

  OnSaveFirstLevel() {
    this.settingService
      .OnSaveDirectionRegionale(this.adminForm.value)
      .subscribe({
        next: (response) => {
          this.adminForm.reset();
          this.hideForm();
          this.GetAllGroupes();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  OnUpdateFirstLevel() {
    this.settingService
      .OnUpdateDirectionRegionale({
        niveau_un_uuid: this.currentObject?.uuid,
        ...this.adminForm.value,
      })
      .subscribe({
        next: (response) => {
          this.adminForm.reset();
          this.GetAllGroupes();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public close(): void {
    this.formsView.emit(false);
  }

  public initForm(): void {
    this.adminForm = this.fb.group({
      nom: ['', [
        Validators.required
      ]],
      code: ['', [
        Validators.required,
        FormValidator.cannotContainSpace,
        FormValidator.symbolsOnly,
      ]],
    });
  }

  hideForm() {
    this.modalService.dismissAll();
    this.selectedGroupe = undefined;
  }
  public onFormPachValues(): void {
    this.adminForm.get('nom').patchValue(this.currentObject?.nom);
    this.adminForm.get('code').patchValue(this.currentObject?.code);
    if (this.currentObject?.type === 'show') {
      this.adminForm.disable()
    }
  }

  public isFilter(): boolean {
    return (!this.selectedDirection && !this.selectedExploitation && !this.selectedImsi && !this.selectedMsisdn) ? true : false
  }

}


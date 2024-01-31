import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { FormValidator } from 'src/shared/utils/spacer.validator';

@Component({
  selector: 'app-form-second-level',
  templateUrl: './form-second-level.component.html',
  styleUrls: ['./form-second-level.component.scss']
})
export class FormSecondLevelComponent implements OnInit {

  @Input() currentObject;
  @Output() listCurrentLevelDatas = new EventEmitter();
  @Output() formsView = new EventEmitter();
  adminForm: FormGroup;
  public listTenants: Array<any> = []
  public listFirstLevelDatas: Array<any> = []
  public currentLevelLibelle: string
  public parentLevelLibelle: string

  constructor(
    private fb: FormBuilder,
    public toastrService: ToastrService,
    private settingService: SettingService,
    private mappingService: MappingService
  ) {
    this.currentLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.parentLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
  }

  ngOnInit(): void {
    this.OnInitForm();
    this.GellAllFirstLevel()
    if (this.currentObject) {
      this.onFormPachValues();
    }
  }
  public GellCurrentLevel() {
    this.settingService
      .getAllUsages({})
      .subscribe({
        next: (response) => {
          this.listCurrentLevelDatas.emit(response['data']);
          this.close()
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
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
  public OnInitForm() {
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
  public close(): void {
    this.formsView.emit(false);
  }

  public handleSave() {
    this.settingService
      .OnSaveExploitation(this.adminForm.value).subscribe({
        next: (response) => {
          this.GellCurrentLevel();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  handleUpdate() {
    this.settingService
      .OnUpdateEploitation({
        niveau_deux_uuid: this.currentObject?.uuid,
        niveau_un_uuid: this.adminForm.get('niveau_un_uuid').value,
        ...this.adminForm.value
      }).subscribe({
        next: (response) => {
          this.GellCurrentLevel();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public onFormPachValues(): void {
    this.adminForm.get('nom').patchValue(this.currentObject?.nom);
    this.adminForm.get('code').patchValue(this.currentObject?.code);
    this.adminForm.get('niveau_un_uuid').patchValue(this.currentObject?.niveau_un_uuid);
    if (this.currentObject.show) {
      this.adminForm.disable()
    }
  }

}


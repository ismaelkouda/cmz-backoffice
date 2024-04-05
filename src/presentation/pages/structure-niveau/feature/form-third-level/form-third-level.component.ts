import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { FormValidator } from 'src/shared/utils/spacer.validator';

@Component({
  selector: 'app-form-third-level',
  templateUrl: './form-third-level.component.html',
  styleUrls: ['./form-third-level.component.scss']
})
export class FormThirdLevelComponent implements OnInit {

  @Input() currentObject;
  @Output() listCurrentLevelDatas = new EventEmitter();
  @Output() formsView = new EventEmitter();
  adminForm: FormGroup;
  public currentLevelLibelle: string

  constructor(
    private fb: FormBuilder,
    public toastrService: ToastrService,
    private settingService: SettingService,
    private mappingService: MappingService
  ) {
    this.currentLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }

  ngOnInit(): void {
    this.OnInitForm();
    if (this.currentObject) {
      this.onFormPachValues();
    }
  }
  public GellCurrentLevel() {
    this.settingService
      .getAllZones({},1)
      .subscribe({
        next: (response) => {
          this.listCurrentLevelDatas.emit(response['data']);
          this.close()
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public OnInitForm() {
    this.adminForm = this.fb.group({
      nom: ['', [
        Validators.required      
      ]],
      code: ['', [
        Validators.required,
        FormValidator.cannotContainSpace,
        FormValidator.symbolsOnly,
      ]]    
    })
  }
  public close(): void {
    this.formsView.emit(false);
  }

  public handleSave() {
    this.settingService
      .OnSaveZone(this.adminForm.value).subscribe({
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
      .OnUpdateZone({
        niveau_trois_uuid: this.currentObject?.uuid,
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
    if (this.currentObject.show) {
      this.adminForm.disable()
    }
  }

}



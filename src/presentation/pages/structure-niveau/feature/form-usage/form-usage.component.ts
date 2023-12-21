import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';

@Component({
  selector: 'app-form-usage',
  templateUrl: './form-usage.component.html',
  styleUrls: ['./form-usage.component.scss']
})
export class FormUsageComponent implements OnInit {

  @Input() currentObject;
  @Output() listUsages = new EventEmitter();
  @Output() formsView = new EventEmitter();
  adminForm: FormGroup;
  public listTenants: Array<any> = []
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
      .getAllUsages({})
      .subscribe({
        next: (response) => {
          this.listUsages.emit(response['data']);
          this.close()
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public OnInitForm() {
    this.adminForm = this.fb.group({
      nom_usage: ['', [Validators.required]],
      description: ['', [Validators.required]]
    })
  }
  public close(): void {
    this.formsView.emit(false);
  }

  public handleSave() {
    this.settingService
      .OnSaveUsage(this.adminForm.value).subscribe({
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
      .OnUpdateUsage({
        usage_id: this.currentObject?.id,
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
    this.adminForm.get('nom_usage').patchValue(this.currentObject.nom_usage);
    this.adminForm.get('description').patchValue(this.currentObject?.description)
    if (this.currentObject.show) {
      this.adminForm.disable()
    }
  }

}

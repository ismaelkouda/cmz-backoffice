import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private fb: FormBuilder,
    public toastrService: ToastrService,

  ) { }

  ngOnInit(): void {
    this.OnInitForm();
    if (this.currentObject) {
      this.onFormPachValues();
    }
  }

  public GetAllUsageMetier() {
    // this.portefeuilleTenantService
    //   .GetAllUsageMetier({}, 1)
    //   .subscribe({
    //     next: (response) => {
    //       this.listUsages.emit(response['data']['data']);
    //       this.close();
    //     },
    //     error: (error) => {
    //       this.toastrService.error(error.message);
    //     }
    //   })
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
    // this.portefeuilleTenantService
    //   .HandleSaveUsage(this.adminForm.value).subscribe({
    //     next: (response) => {
    //       this.GetAllUsageMetier();
    //       this.toastrService.success(response.message);
    //     },
    //     error: (error) => {
    //       this.toastrService.error(error.error.message);
    //     }
    //   })
  }

  handleUpdate() {
    // this.portefeuilleTenantService
    //   .HandleUpdateUsage({
    //     usage_id: this.currentObject?.id,
    //     ...this.adminForm.value
    //   }).subscribe({
    //     next: (response) => {
    //       this.GetAllUsageMetier();
    //       this.toastrService.success(response.message);
    //     },
    //     error: (error) => {
    //       this.toastrService.error(error.error.message);
    //     }
    //   })
  }

  public onFormPachValues(): void {
    this.adminForm.get('nom_usage').patchValue(this.currentObject.nom_usage);
    this.adminForm.get('tenant_id').patchValue(this.currentObject.tenant_id);
    this.adminForm.get('description').patchValue(this.currentObject?.description)
    if (this.currentObject.show) {
      this.adminForm.disable()
    }
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { TelemetrieService } from '../../data-access/telemetrie.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  @Input() currentObject;
  @Output() listTenants = new EventEmitter();
  @Output() currentContact = new EventEmitter();
  @Output() formsView = new EventEmitter();
  public listUsers: Array<any> = [];
  public adminForm: FormGroup;
  public currentGestionnaire: any;
  public currentEscalade: any;


  constructor(
    private settingService: SettingService,
    private telemetrieService: TelemetrieService,
    public toastrService: ToastrService,
    private toastService: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.GetAllUsers()  
    this.initForm()  
    this.OnChangeGestionnaire()
    this.OnChangeEscalade()
    setTimeout(() => {
      this.onFormPachValues()
    }, 1000);
  }

  public GellAllContact() {
    this.telemetrieService
    .GetContactSla()
    .subscribe({
      next: (response) => {
        this.currentContact.emit(response['data'])
        this.close()
      },
      error: (error) => {
        this.toastrService.error(error.error.message);
      }
    })
  }

  public initForm(): void {
    this.adminForm = this.fb.group({
      gestionnaire_tenant_id: [''],
      escalade_tenant_id: [''],
      email_diffusion_tenant: ['']
    });
  }
  GetAllUsers() {
    this.settingService
      .getAllUsers({})
      .subscribe(
        (response: any) => {
          const users = response['data'];
          this.listUsers = users.map((el) => {
            const data = { ...el, fullName: el.nom + ' ' + el.prenoms };
            return data;
          });
        },
        (error) => {
          this.toastService.error(error.error.message);
        }
      );
  }

  public close(): void {
    this.formsView.emit(false);
  }

  public handleSave() {
    this.telemetrieService
    .UpdateContactSla(this.adminForm.value).subscribe({
      next: (response) => {
        this.toastrService.success(response.message);
        this.GellAllContact()
      },
      error: (error) => {
        this.toastrService.error(error.error.message);
      }
    })
  }
  public onFormPachValues(): void {
    this.adminForm.get('gestionnaire_tenant_id').patchValue(this.currentObject?.gestionnaire_tenant_id);
    this.adminForm.get('escalade_tenant_id').patchValue(this.currentObject?.escalade_tenant_id);
    this.adminForm.get('email_diffusion_tenant').patchValue(this.currentObject?.email_diffusion_tenant);
  }

  OnChangeGestionnaire() {    
    return this.adminForm.get('gestionnaire_tenant_id').valueChanges.subscribe((value) => {
     this.currentGestionnaire =  this.listUsers.filter((data) => data.id === value)[0]     
    });
  }
  OnChangeEscalade() {    
    return this.adminForm.get('escalade_tenant_id').valueChanges.subscribe((value) => {
     this.currentEscalade =  this.listUsers.filter((data) => data.id === value)[0]     
    });
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { ParametreSecuriteService } from '../../data-access/parametre-securite.service';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss']
})
export class AdminFormComponent implements OnInit {

  @Input() currentObject;
  @Output() listUsers = new EventEmitter();
  @Output() formsView = new EventEmitter();
  adminForm: FormGroup;
  public listProfils: Array<any> = []
  public currentLevelLibelle: string

  constructor(
    private fb: FormBuilder,
    public toastrService: ToastrService,
    private settingService: SettingService,
    private parametreSecuriteService: ParametreSecuriteService,
    private mappingService: MappingService
  ) {
    this.currentLevelLibelle = this.mappingService.structureGlobale?.niveau_3;

  }

  ngOnInit(): void {
    this.OnInitForm();
    this.GetAllProfilHabilitations()
  }

  public GetAllUsers() {
    this.settingService
      .getAllUsers({})
      .subscribe({
        next: (response) => {
          this.listUsers.emit(response['data']);
          this.close()
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public GetAllProfilHabilitations() {
    this.parametreSecuriteService
      .GetAllProfilHabilitations({})
      .subscribe({
        next: (response) => {
          this.listProfils = response['data'];
          if (this.currentObject) {
            this.onFormPachValues();
          }
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public OnInitForm() {
    this.adminForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenoms: ['', [Validators.required]],
      email: ['',[
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
     ],
      contacts: ['', [Validators.pattern("^[0-9]*$")]],
      profil_user_id: ['',[Validators.required]] 
    })
    this.adminForm.get('contacts').valueChanges.subscribe(value => {
      if (value && value.length > 10) {
        this.adminForm.get('contacts').setValue(value.slice(0, 10), { emitEvent: false });
      }
    });
  }
  public close(): void {
    this.formsView.emit(false);
  }

  public handleSave() {
    this.settingService
      .OnSaveUser(this.adminForm.value).subscribe({
        next: (response) => {
          this.GetAllUsers();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  handleUpdate() {
    this.settingService
      .OnUpdateUser({
        ...this.adminForm.value
      }).subscribe({
        next: (response) => {
          this.GetAllUsers();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public onFormPachValues(): void {
    this.adminForm.get('nom').patchValue(this.currentObject.nom);
    this.adminForm.get('prenoms').patchValue(this.currentObject?.prenoms);
    this.adminForm.get('email').patchValue(this.currentObject?.email)
    this.adminForm.get('contacts').patchValue(this.currentObject?.contacts)
    this.adminForm.get('profil_user_id').patchValue(this.currentObject?.profil_user_id)
    if (this.currentObject.show) {
      this.adminForm.disable()
    }
  }

}


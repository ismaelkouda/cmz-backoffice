import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MappingService } from 'src/shared/services/mapping.service';
import { ParametreSecuriteService } from '../../data-access/parametre-securite.service';
const Swal = require('sweetalert2');

@Component({
    selector: 'app-admin-form',
    templateUrl: './admin-form.component.html',
    styleUrls: ['./admin-form.component.scss'],
})
export class AdminFormComponent implements OnInit {
    @Input() currentObject;
    @Output() listUsers = new EventEmitter();
    @Output() formsView = new EventEmitter();
    adminForm: FormGroup;
    public listProfils: Array<any> = [];
    public currentLevelLibelle: string;
    public suffixEmail: string;
    public principalUsername: string;

    constructor(
        private fb: FormBuilder,
        public toastrService: ToastrService,
        private parametreSecuriteService: ParametreSecuriteService,
        private mappingService: MappingService
    ) {
        this.currentLevelLibelle =
            this.mappingService.structureGlobale?.niveau_3;
        this.suffixEmail = this.mappingService.suffixEmail;
        this.principalUsername = `admin${this.suffixEmail}`;
    }

    ngOnInit(): void {
        this.OnInitForm();
        this.GetAllProfilHabilitations();
    }

    public GetAllUsers() {
        // this.settingService.getAllUsers({}).subscribe({
        //     next: (response) => {
        //         this.listUsers.emit(response['data']);
        //         this.close();
        //     },
        //     error: (error) => {
        //         this.toastrService.error(error.message);
        //     },
        // });
    }
    public GetAllProfilHabilitations() {
        this.parametreSecuriteService.GetAllProfilHabilitations({}).subscribe({
            next: (response) => {
                this.listProfils = response['data'];
                if (this.currentObject) {
                    this.onFormPachValues();
                }
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }
    public OnInitForm() {
        this.adminForm = this.fb.group({
            nom: ['', [Validators.required]],
            prenoms: ['', [Validators.required]],
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            contacts: [
                '',
                [
                    Validators.pattern('^[0-9]*$'),
                    Validators.maxLength(10),
                    Validators.minLength(10),
                ],
            ],
            profil_user_id: ['', [Validators.required]],
        });
        this.adminForm.get('contacts').valueChanges.subscribe((value) => {
            if (value && value.length > 10) {
                this.adminForm
                    .get('contacts')
                    .setValue(value.slice(0, 10), { emitEvent: false });
            }
        });
    }

    public close(): void {
        this.formsView.emit(false);
    }

    public handleSave() {
        // this.settingService.OnSaveUser(this.adminForm.value).subscribe({
        //     next: (response) => {
        //         this.GetAllUsers();
        //         // this.showPassword(response['message'])
        //     },
        //     error: (error) => {
        //         this.toastrService.error(error.error.message);
        //     },
        // });
    }

    handleUpdate() {
        // this.settingService
        //     .OnUpdateUser({
        //         ...this.adminForm.value,
        //         user_id: this.currentObject.id,
        //     })
        //     .subscribe({
        //         next: (response) => {
        //             this.GetAllUsers();
        //             this.toastrService.success(response.message);
        //         },
        //         error: (error) => {
        //             this.toastrService.error(error.error.message);
        //         },
        //     });
    }

    public onFormPachValues(): void {
        this.adminForm.get('nom').patchValue(this.currentObject.nom);
        this.adminForm.get('prenoms').patchValue(this.currentObject?.prenoms);
        this.adminForm.get('username').patchValue(this.currentObject?.username);
        this.adminForm.get('email').patchValue(this.currentObject?.email);
        this.adminForm.get('contacts').patchValue(this.currentObject?.contacts);
        this.adminForm
            .get('profil_user_id')
            .patchValue(this.currentObject?.profil_user_id);
        this.adminForm.get('username').disable();
        if (this.currentObject?.username === this.principalUsername) {
            this.adminForm
                .get('profil_user_id')
                .patchValue(this.currentObject?.profil_user?.description);
            this.adminForm.get('profil_user_id').disable();
        }
        if (this.currentObject.show) {
            this.adminForm.disable();
        }
    }

    public showPassword(data: Object): void {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger',
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons.fire({
            icon: 'warning',
            html: `${data}`,
            confirmButtonColor: '#F07427',
            confirmButtonText: 'ok',
        });
    }
}

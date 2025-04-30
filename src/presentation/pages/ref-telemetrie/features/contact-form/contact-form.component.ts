import {
    formDataBuilder,
    formDataBuilderSome,
} from './../../../../../shared/constants/formDataBuilder.constant';
import { SettingService } from './../../../../../shared/services/setting.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TelemetrieService } from '../../data-access/telemetrie.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-contact-form',
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.scss'],
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
    public listFormJuridique: Array<string> = [];
    public listRegime: Array<string> = [];
    public listRegimesEntreprise: Array<any> = [];
    public listFormeJuridique: Array<any> = [];

    constructor(
        private settingService: SettingService,
        private telemetrieService: TelemetrieService,
        public toastrService: ToastrService,
        private toastService: ToastrService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.postParametresSecuriteRegimesEntrepriseAll();
        this.postParametresSecuriteFormeJuridiqueAll();
        this.GetAllUsers();
        this.initForm();
        this.OnChangeGestionnaire();
        this.OnChangeEscalade();
        setTimeout(() => {
            this.onFormPachValues();
        }, 1000);
    }

    public GellAllContact() {
        this.telemetrieService.GetContactSla().subscribe({
            next: (response) => {
                this.currentContact.emit(response['data']);
                this.close();
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }

    public initForm(): void {
        this.adminForm = this.fb.group({
            gestionnaire_tenant_id: [null, Validators.required],
            escalade_tenant_id: [null, Validators.required],
            admin_tenant_id: [null, Validators.required],
            email_diffusion_tenant: [null, Validators.required],
            nom_tenant: [{ value: null, disabled: true }],
            adresse: [null, Validators.required],
            compte_client: [{ value: null, disabled: true }],
            contact_gestionnaire_tenant: [null, Validators.required],
            email_gestionnaire_tenant: [null, Validators.required],
            contact_escalade_tenant: [null, Validators.required],
            email_escalade_tenant: [null, Validators.required],
            contact_admin_tenant: [null, Validators.required],
            email_admin_tenant: [null, Validators.required],
            nom_gerant: [null, Validators.required],
            contact_gerant: [null, Validators.required],
            email_gerant: [null, Validators.required],
            piece_gerant: [null],
            numero_rccm: [null, Validators.required],
            form_juridique_code: [null, Validators.required],
            fichier_rccm: [null],
            numero_cc: [null, Validators.required],
            regime_code: [null, Validators.required],
            centre: [null, Validators.required],
            fichier_dfe: [null],
        });
        const adminTenantControl = this.adminForm.get('admin_tenant_id');
        const contactAdminTenantControl = this.adminForm.get(
            'contact_admin_tenant'
        );
        const emailAdminTenantControl =
            this.adminForm.get('email_admin_tenant');
        const usernameAdminTenantControl = this.adminForm.get(
            'username_admin_tenant'
        );
        adminTenantControl?.valueChanges.subscribe((value) => {
            if (!!value) {
                const userSelected = this.listUsers.find(
                    (user) => user.id === value
                );
                contactAdminTenantControl?.setValue(userSelected?.contacts);
                emailAdminTenantControl?.setValue(userSelected?.email);
                usernameAdminTenantControl?.setValue(userSelected?.username);
            } else {
                contactAdminTenantControl?.reset();
                emailAdminTenantControl?.reset();
                usernameAdminTenantControl?.reset();
            }
        });
        const escaladeTenantControl = this.adminForm.get('escalade_tenant_id');
        const contactEscaladeTenantControl = this.adminForm.get(
            'contact_escalade_tenant'
        );
        const emailEscaladeTenantControl = this.adminForm.get(
            'email_escalade_tenant'
        );
        const usernameEscaladeTenantControl = this.adminForm.get(
            'username_escalade_tenant'
        );
        escaladeTenantControl?.valueChanges.subscribe((value) => {
            if (!!value) {
                const userSelected = this.listUsers.find(
                    (user) => user.id === value
                );
                contactEscaladeTenantControl?.setValue(userSelected?.contacts);
                emailEscaladeTenantControl?.setValue(userSelected?.email);
                usernameEscaladeTenantControl?.setValue(userSelected?.username);
            } else {
                contactEscaladeTenantControl?.reset();
                emailEscaladeTenantControl?.reset();
                usernameEscaladeTenantControl?.reset();
            }
        });
        const gestionnaireTenantControl = this.adminForm.get(
            'gestionnaire_tenant_id'
        );
        const contactGestionnaireTenantControl = this.adminForm.get(
            'contact_gestionnaire_tenant'
        );
        const emailGestionnaireTenantControl = this.adminForm.get(
            'email_gestionnaire_tenant'
        );
        const usernameGestionnaireTenantControl = this.adminForm.get(
            'username_gestionnaire_tenant'
        );
        gestionnaireTenantControl?.valueChanges.subscribe((value) => {
            if (!!value) {
                const userSelected = this.listUsers.find(
                    (user) => user.id === value
                );
                contactGestionnaireTenantControl?.setValue(
                    userSelected?.contacts
                );
                emailGestionnaireTenantControl?.setValue(userSelected?.email);
                usernameGestionnaireTenantControl?.setValue(
                    userSelected?.username
                );
            } else {
                contactGestionnaireTenantControl?.reset();
                emailGestionnaireTenantControl?.reset();
                usernameGestionnaireTenantControl?.reset();
            }
        });
    }

    GetAllUsers() {
        this.settingService.getAllUsers({}).subscribe(
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

    postParametresSecuriteFormeJuridiqueAll() {
        this.settingService
            .postParametresSecuriteFormeJuridiqueAll({})
            .subscribe(
                (response: any) => {
                    this.listFormeJuridique = response['data'];
                },
                (error) => {
                    this.toastService.error(error.error.message);
                }
            );
    }
    postParametresSecuriteRegimesEntrepriseAll() {
        this.settingService
            .postParametresSecuriteRegimesEntrepriseAll({})
            .subscribe(
                (response: any) => {
                    this.listRegimesEntreprise = response['data'];
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
            .UpdateContactSla(formDataBuilder(this.adminForm.value))
            .subscribe({
                next: (response) => {
                    this.toastrService.success(response.message);
                    this.GellAllContact();
                },
                error: (error) => {
                    this.toastrService.error(error.error.message);
                },
            });
    }

    public onFormPachValues(): void {
        this.adminForm
            .get('gestionnaire_tenant_id')
            ?.patchValue(this.currentObject?.gestionnaire_tenant_id);
        this.adminForm
            .get('escalade_tenant_id')
            ?.patchValue(this.currentObject?.escalade_tenant_id);
        this.adminForm
            .get('email_diffusion_tenant')
            ?.patchValue(this.currentObject?.email_diffusion_tenant);

        this.adminForm
            .get('nom_tenant')
            ?.patchValue(
                `${this.currentObject?.nom_tenant} [${this.currentObject?.tenant_code}]`
            );
        this.adminForm.get('adresse')?.patchValue(this.currentObject?.adresse);
        this.adminForm
            .get('compte_client')
            ?.patchValue(this.currentObject?.compte_client);
        this.adminForm
            .get('contact_gestionnaire_tenant')
            ?.patchValue(this.currentObject?.contact_gestionnaire_tenant);
        this.adminForm
            .get('email_gestionnaire_tenant')
            ?.patchValue(this.currentObject?.email_gestionnaire_tenant);
        this.adminForm
            .get('username_gestionnaire_tenant')
            ?.patchValue(this.currentObject?.username_gestionnaire_tenant);
        this.adminForm
            .get('contact_escalade_tenant')
            ?.patchValue(this.currentObject?.contact_escalade_tenant);
        this.adminForm
            .get('email_escalade_tenant')
            ?.patchValue(this.currentObject?.email_escalade_tenant);
        this.adminForm
            .get('username_escalade_tenant')
            ?.patchValue(this.currentObject?.username_escalade_tenant);

        this.adminForm
            .get('admin_tenant_id')
            ?.patchValue(this.currentObject?.admin_tenant_id);
        this.adminForm
            .get('contact_admin_tenant')
            ?.patchValue(this.currentObject?.contact_admin_tenant);
        this.adminForm
            .get('email_admin_tenant')
            ?.patchValue(this.currentObject?.email_admin_tenant);
        this.adminForm
            .get('username_admin_tenant')
            ?.patchValue(this.currentObject?.username_admin_tenant);

        this.adminForm
            .get('numero_rccm')
            ?.patchValue(this.currentObject?.numero_rccm);
        this.adminForm
            .get('form_juridique_code')
            ?.patchValue(this.currentObject?.forme_juridique_code);
        this.adminForm
            .get('nom_gerant')
            ?.patchValue(this.currentObject?.nom_gerant);
        this.adminForm
            .get('contact_gerant')
            ?.patchValue(this.currentObject?.contact_gerant);
        this.adminForm
            .get('email_gerant')
            ?.patchValue(this.currentObject?.email_gerant);

        this.adminForm
            .get('numero_cc')
            ?.patchValue(this.currentObject?.numero_cc);
        this.adminForm
            .get('regime_code')
            ?.patchValue(this.currentObject?.regime_code);
        this.adminForm.get('centre')?.patchValue(this.currentObject?.centre);

        this.currentObject?.['fichier_rccm']
            ? this.adminForm
                  .get('fichier_rccm')
                  ?.setValidators(Validators.required)
            : this.adminForm.get('fichier_rccm')?.clearValidators();
        this.currentObject?.['fichier_dfe']
            ? this.adminForm
                  .get('fichier_dfe')
                  ?.setValidators(Validators.required)
            : this.adminForm.get('fichier_dfe')?.clearValidators();
        this.currentObject?.['piece_gerant']
            ? this.adminForm
                  .get('piece_gerant')
                  ?.setValidators(Validators.required)
            : this.adminForm.get('piece_gerant')?.clearValidators();
    }

    public openModal(
        type: 'fichier_rccm' | 'fichier_dfe' | 'piece_gerant'
    ): void {
        switch (type) {
            case 'fichier_rccm':
                window.open(this.currentObject?.['fichier_rccm']);
                break;
            case 'fichier_dfe':
                window.open(this.currentObject?.['fichier_dfe']);
                break;
            case 'piece_gerant':
                window.open(this.currentObject?.['piece_gerant']);
                break;
        }
    }
    public onChangeFile(
        file: FileList,
        type: 'fichier_rccm' | 'fichier_dfe' | 'piece_gerant'
    ) {
        switch (type) {
            case 'fichier_rccm':
                this.adminForm.patchValue({ fichier_rccm: file.item(0) });
                this.adminForm.get('fichier_rccm')?.updateValueAndValidity();
                break;
            case 'fichier_dfe':
                this.adminForm.patchValue({ fichier_dfe: file.item(0) });
                this.adminForm.get('fichier_dfe')?.updateValueAndValidity();
                break;
            case 'piece_gerant':
                this.adminForm.patchValue({ piece_gerant: file.item(0) });
                this.adminForm.get('piece_gerant')?.updateValueAndValidity();
                break;
        }
    }

    OnChangeGestionnaire() {
        return this.adminForm
            .get('gestionnaire_tenant_id')
            ?.valueChanges.subscribe((value) => {
                this.currentGestionnaire = this.listUsers.filter(
                    (data) => data.id === value
                )[0];
            });
    }

    OnChangeEscalade() {
        return this.adminForm
            .get('escalade_tenant_id')
            .valueChanges.subscribe((value) => {
                this.currentEscalade = this.listUsers.filter(
                    (data) => data.id === value
                )[0];
            });
    }
}

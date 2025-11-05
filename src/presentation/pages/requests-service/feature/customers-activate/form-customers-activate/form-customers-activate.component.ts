import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { Observable, Subject, takeUntil } from 'rxjs';
import { BreadcrumbComponent } from 'shared/components/breadcrumb/breadcrumb.component';
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from '../../../../../../shared/constants/swalWithBootstrapButtonsParams.constant';
import {
    T_TYPE_CUSTOMERS_ENUM,
    TYPE_CUSTOMERS_ENUM,
} from '../../../../../../shared/enum/type-customers.enum';
import { FormatFormData } from '../../../../../../shared/functions/formatFormData.function';
import { MenuItem } from '../../../../../../shared/interfaces/menu-item.interface';
import { EncodingDataService } from '../../../../../../shared/services/encoding-data.service';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { CustomersActivateFormInterface } from '../../../data-access/customers-activate/interfaces/customers-activate-form.interface';
import {
    REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM,
    T_REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM,
} from '../../../data-access/requests-service/enums/requests-service-buttons-actions.enum';
import { RequestsServiceApiService } from '../../../data-access/requests-service/services/requests-service-api.service';

const Swal = require('sweetalert2');

@Component({
    selector: 'app-form-customers-activate',
    standalone: true,
    templateUrl: './form-customers-activate.component.html',
    styleUrls: ['./form-customers-activate.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        ReactiveFormsModule,
        AsyncPipe,
        TranslateModule,
        ButtonModule,
        SelectModule
    ],
})
export class FormCustomersActivateComponent implements OnInit, OnDestroy {
    private translate = inject(TranslateService);
    public module!: string;
    public subModule!: string;
    public customersActivateForm!: FormGroup<CustomersActivateFormInterface>;
    public type_enterprise!: T_TYPE_CUSTOMERS_ENUM;

    public listRegimesBusiness$!: Observable<
        Array<{ code: string; nom: string }>
    >;
    public listLegalForm$!: Observable<Array<{ code: string; nom: string }>>;

    private destroy$ = new Subject<void>();
    private STORAGE_KEY!: string;

    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private sharedService: SharedService,
        private requestsServiceApiService: RequestsServiceApiService,
        private encodingService: EncodingDataService
    ) {}

    ngOnInit(): void {
        this.initializeState();
        this.initializeForm();
        this.fetchRegimesBusiness();
        this.fetchLegalForms();
        this.setupNavigationListener();
    }

    private setupNavigationListener(): void {
        const menuItems = this.encodingService.getData('menu') as
            | Array<MenuItem>
            | [];
        this.activatedRoute.url
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: any) => {
                const url = this.router.url.split('?')[0];
                for (const parent of menuItems) {
                    if (parent.children) {
                        const child = parent.children.find((c) =>
                            url.startsWith(c.path)
                        );
                        if (child) {
                            this.STORAGE_KEY = child.path;
                            return;
                        }
                    }
                }
            });
        console.log('this.STORAGE_KEY', this.STORAGE_KEY);
        const savedState = this.encodingService.getData(
            `${this.STORAGE_KEY}_children_component`
        );
        if (!savedState) {
            return;
        }
    }

    private initializeState(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data['module'];
            this.subModule = data['subModule'][0];
        });

        this.activatedRoute.queryParams.subscribe((params) => {
            this.validateParams(params);
        });
    }

    private validateParams(params: {
        ref?: T_REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM;
        type_enterprise?: T_TYPE_CUSTOMERS_ENUM;
    }): void {
        if (
            !Object.values(TYPE_CUSTOMERS_ENUM).includes(
                params.type_enterprise as T_TYPE_CUSTOMERS_ENUM
            )
        ) {
            // this.router.navigate(['customers-activate']);
            return;
        }

        if (
            !Object.values(REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM).includes(
                params.ref as T_REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM
            )
        ) {
            this.router.navigate(['customers-activate']);
            return;
        }

        this.type_enterprise = params.type_enterprise as T_TYPE_CUSTOMERS_ENUM;
    }

    private fetchRegimesBusiness(): void {
        this.sharedService.fetchRegimesBusiness();
        this.listRegimesBusiness$ = this.sharedService.getRegimesBusiness();
    }

    private fetchLegalForms(): void {
        this.sharedService.fetchLegalForms();
        this.listLegalForm$ = this.sharedService.getLegalForms();
    }

    private initializeForm(): void {
        this.customersActivateForm =
            this.fb.group<CustomersActivateFormInterface>({
                type_entreprise: new FormControl(this.type_enterprise, {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                nom_client: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                adresse: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                compte_client: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                email_admin_client: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required, Validators.email],
                }),
                domaine_activite: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                logo_client: new FormControl<File | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required],
                }),

                nom_gerant: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                contact_gerant: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                email_gerant: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required, Validators.email],
                }),
                piece_gerant: new FormControl<File | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required],
                }),

                // nb_demandes: new FormControl(1, {
                //     nonNullable: true,
                //     validators: [Validators.required],
                // }),

                numero_rccm: new FormControl(''),
                forme_juridique_code: new FormControl<string | null>(null),
                fichier_rccm: new FormControl<File | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required],
                }),

                numero_cc: new FormControl(''),
                regime_code: new FormControl<string | null>(null),
                centre: new FormControl(''),
                fichier_dfe: new FormControl<File | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required],
                }),

                // confirmation_contrat: new FormControl<boolean | null>(null, {
                //     nonNullable: true,
                // }),

                // Description
                description: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
            });

        // this.customersActivateForm
        //     .get('confirmation_contrat')
        //     ?.setValidators(Validators.requiredTrue);

        this.customersActivateForm
            .get('type_entreprise')
            ?.valueChanges.subscribe((type) => {
                if (type === 'Personne physique') {
                    this.customersActivateForm
                        .get('piece_identite')
                        ?.setValidators([Validators.required]);
                    this.customersActivateForm
                        .get('numero_rccm')
                        ?.clearValidators();
                    this.customersActivateForm
                        .get('numero_cc')
                        ?.clearValidators();
                } else {
                    this.customersActivateForm
                        .get('numero_rccm')
                        ?.setValidators([Validators.required]);
                    this.customersActivateForm
                        .get('numero_cc')
                        ?.setValidators([Validators.required]);
                    this.customersActivateForm
                        .get('piece_identite')
                        ?.clearValidators();
                }
                this.customersActivateForm.updateValueAndValidity();
            });
    }

    public setRadioValue(value: string) {
        this.customersActivateForm.get('type_entreprise')?.setValue(value);
    }

    public isClientType(type: string): boolean {
        return (
            this.customersActivateForm.get('type_entreprise')?.value === type
        );
    }

    public onChangeFile(
        list: FileList | null,
        control: keyof CustomersActivateFormInterface
    ): void {
        if (!list || list.length === 0) {
            this.clearExcelFile(control);
            return;
        }
        const file = list.item(0) as File;
        this.customersActivateForm.patchValue({ [control]: file } as any);
        this.customersActivateForm.get(control)?.updateValueAndValidity();
        if (
            control === 'piece_gerant' ||
            control === 'fichier_rccm' ||
            control === 'fichier_dfe' ||
            control === 'logo_client'
        ) {
            const valid = /(png|jpg|jpeg)$/i.test(file.name);
            if (!valid) {
                this.customersActivateForm.get(control)?.reset();
                this.toastService.error(
                    this.translate.instant('INVALID_FILE_FORMAT')
                );
                return;
            }
        }
    }

    private clearExcelFile(
        control: keyof CustomersActivateFormInterface,
        excelInput?: HTMLInputElement
    ): void {
        this.customersActivateForm.get(control)?.reset();
        if (excelInput) excelInput.value = '';
    }

    viewFile(field: string) {
        const file = this.customersActivateForm.get(field)
            ?.value as File | null;
        if (!file) return;
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
    }

    onBack(): void {
        this.encodingService.removeData(
            `${this.STORAGE_KEY}_children_component`
        );
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }

    isInvalid(path: keyof CustomersActivateFormInterface): boolean {
        const ctrl = this.customersActivateForm.get(path as string);
        return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
    }

    private buildPayload(): FormData {
        const v = this.customersActivateForm.getRawValue();
        const fd = FormatFormData(v);
        return fd;
    }

    async handleSave(): Promise<void> {
        if (this.customersActivateForm.invalid) {
            this.customersActivateForm.markAllAsTouched();
            this.toastService.error(this.translate.instant('FORM_INVALID'));
            return;
        }
        const payload: FormData = this.buildPayload();

        const CONFIRM_CLIENT_CREATION = this.translate.instant(
            'CONFIRM_CLIENT_CREATION'
        );

        const result = await Swal.mixin({
            customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass,
        }).fire({
            ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
            html: `<span><strong>${CONFIRM_CLIENT_CREATION}</strong></span><span style="color: #5B9BD5; font-weight: bold; text-transform: uppercase"> ${
                this.customersActivateForm.get('nom_client')?.value
            }</span>`,
        });

        if (result.isConfirmed) {
            this.requestsServiceApiService.fetchCreateCustomersActivate(
                payload,
                this.toastService,
                () => {
                    this.onBack();
                }
            );
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

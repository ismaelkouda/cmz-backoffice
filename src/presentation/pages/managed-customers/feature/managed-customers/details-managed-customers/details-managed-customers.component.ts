import { Location } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbComponent } from '../../../../../../shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '../../../../../../shared/components/page-title/page-title.component';
import {
    CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM,
    T_CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM,
} from '../../../data-access/managed-customers/interfaces/managed-customers-buttons-actions.enum';
import { ManagedCustomersDetailsInterface } from '../../../data-access/managed-customers/interfaces/managed-customers-details.interface';
import { ManagedCustomersIdentificationInterface } from '../../../data-access/managed-customers/interfaces/managed-customers-identification.interface';
import { ManagedCustomersApiService } from '../../../data-access/managed-customers/services/managed-customers-api.service';
import { IdentificationManagedCustomersComponent } from '../identification-managed-customers/identification-managed-customers.component';
@Component({
    selector: 'app-details-managed-customers',
    standalone: true,
    templateUrl: './details-managed-customers.component.html',
    styleUrls: ['./details-managed-customers.component.scss'],
    imports: [
        PageTitleComponent,
        BreadcrumbComponent,
        IdentificationManagedCustomersComponent,
        TranslateModule,
    ],
})
export class DetailsManagedCustomersComponent implements OnInit, OnDestroy {
    public module = 'Clients gérés';
    public subModule = 'Entreprise commerciale';
    public customersDetailsForm!: FormGroup<ManagedCustomersIdentificationInterface>;
    public code_client!: string;
    public customerDetails!: ManagedCustomersDetailsInterface;

    @Output() formsView = new EventEmitter();
    public indexTabPanelActive = 0;

    private readonly destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        public toastService: ToastrService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private location: Location,
        private detailsManagedCustomersApiService: ManagedCustomersApiService
    ) { }

    ngOnInit(): void {
        this.initializeState();
    }

    private initializeState(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.module = data['module'];
                this.subModule = data['subModule'][0];
            });

        this.activatedRoute.queryParams
            .pipe(takeUntil(this.destroy$))
            .subscribe((params) => {
                this.validateParams(params);
            });
    }

    private validateParams(params: {
        ref?: T_CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM;
    }): void {
        if (
            !Object.values(CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM).includes(
                params.ref as T_CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM
            )
        ) {
            this.router.navigate(['customers-activate']);
            return;
        }

        this.code_client =
            this.activatedRoute.snapshot.paramMap.get('code_client') ?? '';

        this.detailsManagedCustomersApiService.fetchCustomersDetails(
            this.code_client
        );
        this.detailsManagedCustomersApiService
            .getCustomersDetails()
            .subscribe((value) => {
                this.customerDetails = value;
                this.initializeForm();
            });
    }

    public initializeForm() {
        this.customersDetailsForm =
            this.fb.group<ManagedCustomersIdentificationInterface>({
                nom_client: new FormControl(
                    { value: this.customerDetails.nom_client, disabled: true },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                adresse: new FormControl(
                    { value: this.customerDetails.adresse, disabled: true },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                compte_client: new FormControl(
                    {
                        value: this.customerDetails.compte_client,
                        disabled: true,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                email_admin_client: new FormControl(
                    {
                        value: this.customerDetails.email_admin_client,
                        disabled: true,
                    },
                    {
                        nonNullable: true,
                        validators: [Validators.required, Validators.email],
                    }
                ),
                domaine_activite: new FormControl(
                    {
                        value: this.customerDetails.domaine_activite,
                        disabled: true,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                logo_client: new FormControl<File | null>(null),
                nom_gerant: new FormControl(
                    { value: this.customerDetails.nom_gerant, disabled: true },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                contact_gerant: new FormControl(
                    {
                        value: this.customerDetails.contact_gerant,
                        disabled: true,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                email_gerant: new FormControl(
                    {
                        value: this.customerDetails.email_gerant,
                        disabled: true,
                    },
                    {
                        nonNullable: true,
                        validators: [Validators.required, Validators.email],
                    }
                ),
                piece_gerant: new FormControl<File | null>(null),
                numero_rccm: new FormControl(
                    { value: this.customerDetails.numero_rccm, disabled: true },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                forme_juridique_code: new FormControl(
                    {
                        value: this.customerDetails.forme_juridique_code,
                        disabled: true,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                fichier_rccm: new FormControl<File | null>(null),
                numero_cc: new FormControl(
                    { value: this.customerDetails.numero_cc, disabled: true },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                regime_code: new FormControl(
                    { value: this.customerDetails.regime_code, disabled: true },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                centre: new FormControl(
                    { value: this.customerDetails.centre, disabled: true },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                description: new FormControl(
                    {
                        value: this.customerDetails?.description,
                        disabled: true,
                    },
                    { nonNullable: true, validators: [Validators.required] }
                ),
                fichier_dfe: new FormControl<File | null>(null),
            });
    }

    public closeInterface(): void {
        this.router.navigate(['managed-customers/customers-b2b']);
    }

    public onGoToBack(): void {
        this.location.back();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

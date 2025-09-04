import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
const Swal = require('sweetalert2');
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from '../../../../../../shared/constants/swalWithBootstrapButtonsParams.constant';
import { ProfilesAuthorizationsNavigationGuardService } from '../../../data-access/profiles-authorizations/services/profiles-authorizations-navigation-guard.service';
import { ProfilesAuthorizationsFormInterface } from '../../../data-access/profiles-authorizations/interfaces/profiles-authorizations-form.interface';
import {
    PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM,
    T_PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM,
} from '../../../data-access/profiles-authorizations/enums/profiles-authorizations-buttons-actions.enum';
import { ProfilesAuthorizationsApiService } from '../../../data-access/profiles-authorizations/services/profiles-authorizations-api.service';
import { ProfilesAuthorizationsDetailsInterface } from '../../../data-access/profiles-authorizations/interfaces/profiles-authorizations-details.interface';
import { ProfilesAuthorizationsPermissionsInterface } from '../../../data-access/profiles-authorizations/interfaces/profiles-authorizations-permissions.interface';
import { ProfilesAuthorizationsHabilitationInterface } from '../../../data-access/profiles-authorizations/interfaces/profiles-authorizations-habilitation.interface';

@Component({
    selector: 'app-form-profiles-authorizations',
    templateUrl: './form-profiles-authorizations.component.html',
    styleUrls: ['./form-profiles-authorizations.component.scss'],
})
export class FormProfilesAuthorizationsComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public profilesAuthorizationsForm!: FormGroup<ProfilesAuthorizationsFormInterface>;
    private id: string;

    public listPermissions$: Observable<ProfilesAuthorizationsPermissionsInterface>;
    public listHabilitation$: Observable<ProfilesAuthorizationsHabilitationInterface>;
    public profilesAuthorizationsDetails: ProfilesAuthorizationsDetailsInterface;

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private router: Router,
        private translate: TranslateService,
        private activatedRoute: ActivatedRoute,
        private profilesAuthorizationsApiService: ProfilesAuthorizationsApiService,
        private navigationGuardService: ProfilesAuthorizationsNavigationGuardService
    ) {}

    ngOnInit(): void {
        this.initializeState();
        this.initializeForm();
    }

    private initializeState(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });

        this.activatedRoute.queryParams.subscribe((params) => {
            this.validateParams(params);
        });
    }

    private validateParams(params: {
        ref?: T_PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM;
    }): void {
        if (
            !Object.values(
                PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM
            ).includes(
                params.ref as T_PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM
            )
        ) {
            this.router.navigate(['profiles-authorizations']);
            return;
        }

        this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
        if (
            this.id === '' &&
            params.ref === PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM.ADD
        ) {
            this.loadCustomerPermissionsAndHabilitationDetails();
        } else if (
            this.id &&
            params.ref === PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM.EDIT
        ) {
            this.loadCustomerDetails();
        }
    }

    private loadCustomerPermissionsAndHabilitationDetails(): void {
        this.profilesAuthorizationsApiService.fetchProfilesAuthorizationsPermissions();
        this.profilesAuthorizationsApiService.fetchProfilesAuthorizationsHabilitation();
        this.listPermissions$ =
            this.profilesAuthorizationsApiService.getProfilesAuthorizationsPermissions();
        this.listHabilitation$ =
            this.profilesAuthorizationsApiService.getProfilesAuthorizationsHabilitation();
    }

    private loadCustomerDetails(): void {
        this.profilesAuthorizationsApiService.fetchProfilesAuthorizationsDetails(
            this.id
        );

        this.profilesAuthorizationsApiService
            .getProfilesAuthorizationsDetails()
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.profilesAuthorizationsDetails = value;
                this.initializeForm();
            });
    }

    private initializeForm(): void {
        this.profilesAuthorizationsForm =
            this.fb.group<ProfilesAuthorizationsFormInterface>({
                nom: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                description: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
            });
    }

    onBack(): void {
        this.navigationGuardService.clearProfilesAuthorizationsNavigationGuard();
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }

    isInvalid(path: keyof ProfilesAuthorizationsFormInterface): boolean {
        const ctrl = this.profilesAuthorizationsForm.get(path as string);
        return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
    }

    async handleSave(): Promise<void> {
        if (this.profilesAuthorizationsForm.invalid) {
            this.profilesAuthorizationsForm.markAllAsTouched();
            this.toastService.error(this.translate.instant('FORM_INVALID'));
            return;
        }
        const payload = this.profilesAuthorizationsForm.getRawValue();

        const CONFIRM_PROFILE_CREATION = this.translate.instant(
            'CONFIRM_PROFILE_CREATION'
        );

        const result = await Swal.mixin({
            customClass: SWALWITHBOOTSTRAPBUTTONSPARAMS.customClass,
        }).fire({
            ...SWALWITHBOOTSTRAPBUTTONSPARAMS.message,
            html: `<span><strong>${CONFIRM_PROFILE_CREATION}</strong></span><span style="color: #5B9BD5; font-weight: bold; text-transform: uppercase"> ${
                this.profilesAuthorizationsForm.get('nom')?.value
            }</span>`,
        });

        if (result.isConfirmed) {
            this.profilesAuthorizationsApiService.fetchCreateProfilesAuthorizationsService(
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

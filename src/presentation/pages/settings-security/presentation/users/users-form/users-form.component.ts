import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    OnInit,
    Signal,
    untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProfilesPermissionsSelectFacade } from '@pages/settings-security/application/services/profiles-permissions/profiles-permissions-select.facade';
import { ResponsibilitiesSelectFacade } from '@pages/settings-security/application/services/users/responsibilities-select.facade';
import { UsersFindOneFacade } from '@pages/settings-security/application/services/users/users-find-one.facade';
import { UsersFacade } from '@pages/settings-security/application/services/users/users.facade';
import { UsersFormControl } from '@pages/settings-security/domain/controls/users/users-form.control';
import { ProfilesPermissionsSelectEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-select.entity';
import { FormValidators } from '@pages/settings-security/domain/validators/form-validators';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { map } from 'rxjs';
import SweetAlert from 'sweetalert2';

import { UsersFormHelperService } from './users-form-helper.service';
import { UsersFormValidationService } from './users-form-validation.service';

@Component({
    selector: 'app-users-form',
    templateUrl: './users-form.component.html',
    styleUrls: ['./users-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ReactiveFormsModule,
        InputTextModule,
        InputMaskModule,
        TextareaModule,
        SelectModule,
        ButtonModule,
        TagModule,
        ToastModule,
        TooltipModule,
    ],
    providers: [
        MessageService,
        UsersFormValidationService,
        UsersFormHelperService,
        ProfilesPermissionsSelectFacade,
        ResponsibilitiesSelectFacade,
        UsersFindOneFacade,
        UsersFacade,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersFormComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly usersFacade = inject(UsersFacade);
    private readonly profilesFacade = inject(ProfilesPermissionsSelectFacade);
    private readonly responsibilitiesFacade = inject(
        ResponsibilitiesSelectFacade
    );
    private readonly findOneFacade = inject(UsersFindOneFacade);
    private readonly translate = inject(TranslateService);
    private readonly messageService = inject(MessageService);
    private readonly validationService = inject(UsersFormValidationService);
    private readonly helperService = inject(UsersFormHelperService);

    readonly VALIDATION = FormValidators;

    readonly form: FormGroup<UsersFormControl> =
        this.fb.nonNullable.group<UsersFormControl>({
            firstName: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.FIRST_NAME.MIN),
                    Validators.maxLength(FormValidators.FIRST_NAME.MAX),
                    Validators.pattern(FormValidators.FIRST_NAME.PATTERN),
                ],
            }),
            lastName: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.LAST_NAME.MIN),
                    Validators.maxLength(FormValidators.LAST_NAME.MAX),
                    Validators.pattern(FormValidators.LAST_NAME.PATTERN),
                ],
            }),
            email: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.pattern(FormValidators.EMAIL.PATTERN),
                ],
            }),
            phone: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.PHONE.MIN),
                    Validators.maxLength(FormValidators.PHONE.MAX),
                    Validators.pattern(FormValidators.PHONE.PATTERN),
                ],
            }),
            profile: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            responsibility: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });

    readonly profiles = toSignal(this.profilesFacade.items$, {
        initialValue: [] as ProfilesPermissionsSelectEntity[],
    });
    readonly loadingProfiles = toSignal(this.profilesFacade.isLoading$, {
        initialValue: false,
    });

    readonly responsibilities = toSignal(this.responsibilitiesFacade.items$, {
        initialValue: null,
    });
    readonly loadingResponsibilities = toSignal(
        this.responsibilitiesFacade.isLoading$,
        {
            initialValue: false,
        }
    );

    readonly currentUser = this.findOneFacade.items;

    private readonly paramsUniqId: Signal<string> = toSignal(
        this.route.queryParams.pipe(
            map(
                (params: Record<string, unknown>) =>
                    (params['uniqId'] as string) || ''
            )
        ),
        { initialValue: '' }
    );

    readonly isEditMode = computed(() => !!this.paramsUniqId());

    private readonly handleRouteParamsChange = effect(() => {
        const uniqId = this.paramsUniqId();
        if (uniqId) {
            this.findOneFacade.reset();
            this.findOneFacade.read({ uniqId: uniqId }, true);
        } else {
            this.findOneFacade.reset();
            this.form.reset();
        }
    });

    private readonly patchFormFromUser = effect(() => {
        const user = this.currentUser();
        untracked(() => {
            if (user && Object.keys(user).length > 0) {
                this.form.patchValue(
                    {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone,
                        profile: user.profile,
                        responsibility: user.responsibility,
                    },
                    { emitEvent: false }
                );
            }
        });
    });

    ngOnInit(): void {
        this.profilesFacade.readAll();
        this.responsibilitiesFacade.readAll();
        const uniqId = this.paramsUniqId();
        if (uniqId) {
            this.findOneFacade.read({ uniqId: uniqId }, true);
        }
    }

    getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        return this.validationService.getErrorMessage(
            fieldName,
            control?.errors || null
        );
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.showValidationErrors();
            return;
        }

        const title = this.helperService.getSweetAlertTitle(this.isEditMode());
        const message = this.helperService.getSweetAlertMessage(
            this.isEditMode()
        );

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(title),
            text: this.translate.instant(message),
            backdrop: false,
            confirmButtonText: this.translate.instant('COMMON.CONFIRM'),
            cancelButtonText: this.translate.instant('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.submitFormData();
            }
        });
    }

    onCancel(): void {
        this.helperService.navigateToUsersList();
    }

    private showValidationErrors(): void {
        const errors: string[] = [];
        const controlNames = [
            'firstName',
            'lastName',
            'email',
            'phone',
            'profile',
            'responsibility',
        ] as const;

        controlNames.forEach((name) => {
            if (this.form.controls[name].invalid) {
                errors.push(this.getErrorMessage(name));
            }
        });

        this.validationService.showValidationErrors(
            this.messageService,
            errors
        );
    }

    private submitFormData(): void {
        const formData = this.form.getRawValue();
        const userId = this.paramsUniqId();
        const operation = this.isEditMode() && userId ? 'UPDATE' : 'CREATE';

        if (operation === 'UPDATE') {
            this.usersFacade.update({ uniqId: userId, ...formData });
        } else {
            this.usersFacade.create(formData);
        }

        this.helperService.navigateToUsersList();
    }
}

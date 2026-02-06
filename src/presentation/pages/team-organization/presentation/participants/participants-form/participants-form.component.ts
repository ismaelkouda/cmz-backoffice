import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    signal,
    Signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterOption } from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';

import { ParticipantsFindoneFacade } from '@presentation/pages/team-organization/application/services/participants/participants-findone.facade';
import { ParticipantsFacade } from '@presentation/pages/team-organization/application/services/participants/participants.facade';
import { ParticipantsFormControl } from '@presentation/pages/team-organization/domain/controls/participants/participants-form.control';
import { FormValidators } from '@presentation/pages/team-organization/domain/validators/form-validators';
import { ParticipantsFormHelperService } from '@presentation/pages/team-organization/presentation/participants/participants-form/participants-form-helper.service';
import { ParticipantsFormValidationService } from '@presentation/pages/team-organization/presentation/participants/participants-form/participants-form-validation.service';

@Component({
    selector: 'app-participants-form',
    templateUrl: './participants-form.component.html',
    styleUrls: ['./participants-form.component.scss'],
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
        ParticipantsFormValidationService,
        ParticipantsFormHelperService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsFormComponent {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly submitFacade = inject(ParticipantsFacade);
    private readonly facade = inject(ParticipantsFindoneFacade);
    private readonly translate = inject(TranslateService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly validationService = inject(
        ParticipantsFormValidationService
    );
    private readonly helperService = inject(ParticipantsFormHelperService);
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    readonly VALIDATION = FormValidators;
    readonly items = toSignal(this.facade.item$, { initialValue: null });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    private readonly paramsUniqId: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map(
                (params: Record<string, unknown>) =>
                    (params['uniqId'] as string) || ''
            )
        ),
        { initialValue: '' }
    );
    readonly isEditMode = computed(() => !!this.paramsUniqId());

    readonly rolesOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return [
            {
                label: this.t('COMMON.SUPERVISOR'),
                value: 'supervisor',
                translationKey: 'COMMON.SUPERVISOR',
            },
            {
                label: this.t('COMMON.LEADER'),
                value: 'leader',
                translationKey: 'COMMON.LEADER',
            },
            {
                label: this.t('COMMON.AGENT'),
                value: 'agent',
                translationKey: 'COMMON.AGENT',
            },
        ];
    });
    readonly form: FormGroup<ParticipantsFormControl> =
        this.fb.nonNullable.group<ParticipantsFormControl>({
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
            role: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });

    private readonly patchFormFromItem = effect(
        () => {
            const item = this.items();
            if (item && Object.keys(item).length > 0) {
                this.form.patchValue(
                    {
                        lastName: item.lastName,
                        firstName: item.firstName,
                        email: item.email,
                        phone: item.phone,
                        role: item.role,
                    },
                    { emitEvent: false }
                );
            }
        },
        { allowSignalWrites: true }
    );

    private readonly handleRouteParamsChange = effect(
        () => {
            const uniqId = this.paramsUniqId();
            if (uniqId) {
                this.facade.reset();
                this.facade.read({ uniqId: uniqId }, true);
            } else {
                this.facade.reset();
                this.form.reset();
            }
        },
        { allowSignalWrites: true }
    );

    getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        return this.validationService.getErrorMessage(
            fieldName,
            control?.errors || null
        );
    }

    private showValidationErrors(): void {
        const errors: string[] = [];
        const controlNames = [
            'firstName',
            'lastName',
            'email',
            'phone',
            'role',
        ] as const;

        controlNames.forEach((name) => {
            if (this.form.controls[name].invalid) {
                errors.push(this.getErrorMessage(name));
            }
        });
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

    private submitFormData(): void {
        const formData = this.form.getRawValue();
        const uniqId = this.paramsUniqId();

        if (this.isEditMode() && uniqId) {
            this.submitFacade
                .update({ uniqId, ...formData })
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: () => {
                        this.onCancel();
                        this.submitFacade.refreshWithLastFilterAndPage();
                    },
                });
        } else {
            this.submitFacade
                .create(formData)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: () => {
                        this.onCancel();
                    },
                });
        }
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }

    onCancel(): void {
        this.helperService.navigateToParticipantsList();
    }
}

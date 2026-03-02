import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    OnInit,
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
import { map, tap } from 'rxjs';
import SweetAlert from 'sweetalert2';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
    enumToFilterOptions,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { Roles } from '@shared/domain/enums/roles.enum';
import { formatPhoneForMask } from '@shared/domain/functions/format-phone-for-mask.function';
import { FormValidationService } from '@shared/domain/services/form-validation.service';

import { ParticipantsFindOneFacade } from '@presentation/pages/team-organization/application/services/participants/participants-find-one.facade';
import { ParticipantsFacade } from '@presentation/pages/team-organization/application/services/participants/participants.facade';
import { ParticipantsFormControl } from '@presentation/pages/team-organization/domain/controls/participants/participants-form.control';
import { ParticipantsFormHelperService } from '@presentation/pages/team-organization/domain/services/participants/participants-form-helper.service';
import { FormValidators } from '@presentation/pages/team-organization/domain/validators/form-validators';

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
        FormValidationService,
        ParticipantsFormHelperService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsFormComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly submitFacade = inject(ParticipantsFacade);
    private readonly facade = inject(ParticipantsFindOneFacade);
    private readonly translate = inject(TranslateService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly validationService = inject(FormValidationService);
    private readonly helperService = inject(ParticipantsFormHelperService);
    readonly VALIDATION = FormValidators;
    private lastSuccess = this.submitFacade.actionSuccess();
    private itemPatched = false;
    readonly items = this.facade.items;
    readonly loading = this.facade.loading;
    private readonly paramsUniqId = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((p) => (p['uniqId'] as string) || '')
        ),
        { initialValue: '' }
    );
    readonly isEditMode = computed(() => !!this.paramsUniqId());
    private readonly formStateEffect = effect(() => {
        const state = this.submitFacade.actionState();
        if (state === 'loading') {
            this.form.disable({ emitEvent: false });
        } else {
            this.form.enable({ emitEvent: false });
        }
    });

    private readonly successEffect = effect(() => {
        const current = this.submitFacade.actionSuccess();
        if (current === this.lastSuccess) {
            return;
        }

        this.lastSuccess = current;
        this.navigateToBack();
    });

    readonly rolesOptions: Signal<FilterOption[]> = computed(() => {
        return enumToFilterOptions(Roles, this.t.bind(this));
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

    private readonly patchFormFromItem = effect(() => {
        const item = this.items();
        if (item && Object.keys(item).length > 0 && !this.itemPatched) {
            this.form.patchValue(
                {
                    lastName: item.lastName,
                    firstName: item.firstName,
                    email: item.email,
                    phone: formatPhoneForMask(item.phone),
                    role: item.role,
                },
                { emitEvent: false }
            );
            this.itemPatched = true;
        }
    });

    ngOnInit(): void {
        this.activatedRoute.queryParams
            .pipe(
                map((p) => (p['uniqId'] as string) || ''),
                tap((uniqId) => {
                    this.facade.reset();
                    if (uniqId) {
                        this.facade.read({ uniqId }, true);
                    } else {
                        this.form.reset();
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        return this.validationService.getErrorMessage(
            fieldName,
            control?.errors || null
        );
    }

    private showValidationErrors(): void {
        const controlNames = [
            'firstName',
            'lastName',
            'email',
            'phone',
            'role',
        ] as const;

        const errors = controlNames
            .filter((name) => this.form.controls[name].invalid)
            .map((name) => this.getErrorMessage(name));

        if (errors.length) {
            SweetAlert.fire({
                icon: 'error',
                title: this.t('COMMON.ERRORS.FORM_INVALID'),
                html: `<ul style="text-align:left">${errors.map((e) => `<li>${e}</li>`).join('')}</ul>`,
            });
        }
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
            title: this.t(title),
            text: this.t(message),
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.submitForm();
            }
        });
    }

    private submitForm(): void {
        const participant = this.form.getRawValue();

        if (this.isEditMode()) {
            this.submitFacade.update({
                uniqId: this.paramsUniqId(),
                ...participant,
            });
        } else {
            this.submitFacade.create(participant);
        }
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }

    navigateToBack(): void {
        this.helperService.navigateToParticipantsList();
    }
}

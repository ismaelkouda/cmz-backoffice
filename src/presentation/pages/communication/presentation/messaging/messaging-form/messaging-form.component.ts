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

import { MessagingFindOneFacade } from '@presentation/pages/communication/application/services/messaging/messaging-find-one.facade';
import { MessagingFacade } from '@presentation/pages/communication/application/services/messaging/messaging.facade';
import { MessagingFormControl } from '@presentation/pages/communication/domain/controls/messaging/messaging-form.control';
import { FormValidators } from '@presentation/pages/communication/domain/validators/form-validators';
import { MessagingFormHelperService } from '@presentation/pages/communication/presentation/messaging/messaging-form/messaging-form-helper.service';
import { MessagingFormValidationService } from '@presentation/pages/communication/presentation/messaging/messaging-form/messaging-form-validation.service';

@Component({
    selector: 'app-messaging-form',
    templateUrl: './messaging-form.component.html',
    styleUrls: ['./messaging-form.component.scss'],
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
        MessagingFormValidationService,
        MessagingFormHelperService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingFormComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly submitFacade = inject(MessagingFacade);
    private readonly facade = inject(MessagingFindOneFacade);
    private readonly translate = inject(TranslateService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly validationService = inject(MessagingFormValidationService);
    private readonly helperService = inject(MessagingFormHelperService);
    readonly VALIDATION = FormValidators;
    private lastSuccess = this.submitFacade.actionSuccess();
    private itemPatched = false;
    readonly items = toSignal(this.facade.item$, { initialValue: null });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
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

    readonly form: FormGroup<MessagingFormControl> =
        this.fb.nonNullable.group<MessagingFormControl>({
            type: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.FIRST_NAME.MIN),
                    Validators.maxLength(FormValidators.FIRST_NAME.MAX),
                    Validators.pattern(FormValidators.FIRST_NAME.PATTERN),
                ],
            }),
            targetType: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            region: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            department: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            municipality: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            channels: new FormControl([], {
                nonNullable: true,
                validators: [Validators.required],
            }),
            subject: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.LAST_NAME.MIN),
                    Validators.maxLength(FormValidators.LAST_NAME.MAX),
                    Validators.pattern(FormValidators.LAST_NAME.PATTERN),
                ],
            }),
            content: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.LAST_NAME.MIN),
                    Validators.maxLength(FormValidators.LAST_NAME.MAX),
                    Validators.pattern(FormValidators.LAST_NAME.PATTERN),
                ],
            }),
            message: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.LAST_NAME.MIN),
                    Validators.maxLength(FormValidators.LAST_NAME.MAX),
                    Validators.pattern(FormValidators.LAST_NAME.PATTERN),
                ],
            }),
        });

    private readonly patchFormFromItem = effect(() => {
        const item = this.items();
        if (item && Object.keys(item).length > 0 && !this.itemPatched) {
            this.form.patchValue(
                {
                    type: item.type,
                    targetType: item.targetType,
                    region: item.region,
                    department: item.department,
                    municipality: item.municipality,
                    channels: item.channels,
                    subject: item.subject,
                    content: item.content,
                    message: item.message,
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
            'type',
            'targetType',
            'region',
            'municipality',
            'department',
            'channels',
            'subject',
            'content',
            'message',
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
        this.helperService.navigateToMessagingList();
    }
}

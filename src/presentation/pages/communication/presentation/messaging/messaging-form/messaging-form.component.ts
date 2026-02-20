import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { EditorModule } from 'primeng/editor';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { map, tap } from 'rxjs/operators';
import SweetAlert from 'sweetalert2';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
    enumToFilterOptions,
    getEnumKeyByValue,
} from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';

import { MessagingFacade } from '@presentation/pages/communication/application/services/messaging/messaging.facade';
import { MessagingFormStore } from '@presentation/pages/communication/application/stores/messaging/messaging-form.store';
import { Channels } from '@presentation/pages/communication/domain/enums/messaging/messaging-channels.enum';
import { Target } from '@presentation/pages/communication/domain/enums/messaging/messaging-target.enum';
import { Type } from '@presentation/pages/communication/domain/enums/messaging/messaging-type.enum';
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
        ReactiveFormsModule,
        BreadcrumbComponent,
        PageTitleComponent,
        InputTextModule,
        InputMaskModule,
        TextareaModule,
        SelectModule,
        ButtonModule,
        TagModule,
        ToastModule,
        CheckboxModule,
        TooltipModule,
        EditorModule,
    ],
    providers: [
        MessageService,
        MessagingFormValidationService,
        MessagingFormHelperService,
        MessagingFormStore,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingFormComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(MessagingFacade);
    private readonly validationService = inject(MessagingFormValidationService);
    private readonly helperService = inject(MessagingFormHelperService);

    readonly store = inject(MessagingFormStore);

    readonly form = this.store.form;
    readonly isEditMode = this.store.isEditMode;
    readonly loading = this.store.loading;
    readonly regions = this.store.regions;
    readonly departments = this.store.departments;
    readonly municipalities = this.store.municipalities;

    readonly typeOptions = computed(() =>
        enumToFilterOptions(Type, (key: string) => this.t(key))
    );

    readonly targetOptions = computed(() =>
        enumToFilterOptions(Target, (key: string) => this.t(key))
    );

    readonly channelsOptions = computed(() =>
        enumToFilterOptions(Channels, (key: string) => this.t(key))
    );

    readonly VALIDATION = FormValidators;
    readonly TargetEnum = Target;

    private readonly submitSuccess = signal(false);
    private lastSubmitSuccess = this.submitFacade.actionSuccess();

    private readonly formStateEffect = effect(() => {
        const state = this.submitFacade.actionState();
        if (state === 'loading') {
            this.form.disable({ emitEvent: false });
        } else {
            this.form.enable({ emitEvent: false });
        }
    });

    private readonly submitSuccessEffect = effect(() => {
        const current = this.submitFacade.actionSuccess();
        if (current !== this.lastSubmitSuccess && !this.submitSuccess()) {
            this.lastSubmitSuccess = current;
            this.submitSuccess.set(true);
            this.navigateToBack();
        }
    });

    ngOnInit(): void {
        this.activatedRoute.queryParams
            .pipe(
                map((params) => (params['uniqId'] as string) || null),
                tap((uniqId) => this.store.setEditMode(uniqId)),
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

    isFieldInvalid(fieldName: string): boolean {
        const control = this.form.get(fieldName);
        return !!(control?.invalid && control?.touched);
    }

    shouldShowField(fieldName: 'reportId' | 'region'): boolean {
        console.log('fieldName', fieldName);
        const targetType = this.form.controls.targetType.value;

        if (fieldName === 'reportId') {
            return targetType === getEnumKeyByValue(Target, Target.report);
        }

        return targetType === getEnumKeyByValue(Target, Target.area);
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
        const formValue = this.form.getRawValue();
        this.submitSuccess.set(false);

        if (this.isEditMode()) {
            this.activatedRoute.queryParams
                .pipe(
                    map((params) => params['uniqId'] as string),
                    tap((uniqId) => {
                        this.submitFacade.update({
                            uniqId,
                            ...formValue,
                        });
                    }),
                    takeUntilDestroyed(this.destroyRef)
                )
                .subscribe();
        } else {
            this.submitFacade.create(formValue);
        }
    }

    private showValidationErrors(): void {
        const fieldLabels: Record<string, string> = {
            type: 'COMMUNICATION.MESSAGING.FORM.FIELDSET_GENERAL_INFO.TYPE',
            reportId:
                'COMMUNICATION.MESSAGING.FORM.FIELDSET_GENERAL_INFO.REPORT_ID',
            targetType:
                'COMMUNICATION.MESSAGING.FORM.FIELDSET_GENERAL_INFO.TARGET',
            region: 'COMMUNICATION.MESSAGING.FORM.FIELDSET_ADMINISTRATIVE_BOUNDARY.REGION',
            department:
                'COMMUNICATION.MESSAGING.FORM.FIELDSET_ADMINISTRATIVE_BOUNDARY.DEPARTMENT',
            municipality:
                'COMMUNICATION.MESSAGING.FORM.FIELDSET_ADMINISTRATIVE_BOUNDARY.MUNICIPALITY',
            channels: 'COMMUNICATION.MESSAGING.FORM.FIELDSET_CHANNELS.TITLE',
            subject:
                'COMMUNICATION.MESSAGING.FORM.FIELDSET_ADDITIONAL_INFO.SUBJECT',
            content:
                'COMMUNICATION.MESSAGING.FORM.FIELDSET_ADDITIONAL_INFO.CONTENT',
        };

        const errors = Object.keys(this.form.controls)
            .filter(
                (key) =>
                    this.form.get(key)?.invalid &&
                    this.shouldShowField(key as any)
            )
            .map(
                (key) =>
                    `${this.t(fieldLabels[key])} : ${this.getErrorMessage(key)}`
            );

        if (errors.length) {
            SweetAlert.fire({
                icon: 'error',
                title: this.t('COMMON.ERRORS.FORM_INVALID'),
                html: `<ul style="text-align:left">${errors.map((e) => `<li>${e}</li>`).join('')}</ul>`,
            });
        }
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }

    navigateToBack(): void {
        this.helperService.navigateToMessagingList();
    }
}

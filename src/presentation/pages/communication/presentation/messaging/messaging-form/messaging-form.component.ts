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
import { MessagingFacade } from '@pages/communication/application/services/messaging/messaging.facade';
import { MessagingChannelsEnum } from '@pages/communication/domain/enums/messaging/messaging-channels.enum';
import { MessagingTargetEnum } from '@pages/communication/domain/enums/messaging/messaging-target.enum';
import { MessagingTypeEnum } from '@pages/communication/domain/enums/messaging/messaging-type.enum';
import { FormValidators } from '@pages/communication/domain/validators/form-validators';
import { MessagingFormHelperService } from '@pages/communication/presentation/messaging/messaging-form/messaging-form-helper.service';
import { MessagingFormValidationService } from '@pages/communication/presentation/messaging/messaging-form/messaging-form-validation.service';
import { MessagingFormSkeletonComponent } from '@pages/communication/presentation/messaging/messaging-form-skeleton/messaging-form-skeleton.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { enumToFilterOptionsWithValue } from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { ToastrService } from 'ngx-toastr';
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
import { MessagingFormStore } from '@pages/communication/presentation/store/messaging/messaging-form.store';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-messaging-form',
    templateUrl: './messaging-form.component.html',
    styleUrls: ['./messaging-form.component.scss'],
    standalone: true,
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        BreadcrumbComponent,
        PageTitleComponent,
        MessagingFormSkeletonComponent,
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
        MessageModule,
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
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(MessagingFacade);
    private readonly validationService = inject(MessagingFormValidationService);
    private readonly helperService = inject(MessagingFormHelperService);
    private readonly toast = inject(ToastrService);

    private readonly store = inject(MessagingFormStore);

    protected readonly form = this.store.form;
    protected readonly isDetailsMode = this.store.isDetailsMode;
    protected readonly loading = this.store.loading;
    protected readonly regions = this.store.regions;
    protected readonly loadingRegions = this.store.loadingRegions;
    protected readonly departments = this.store.departments;
    protected readonly municipalities = this.store.municipalities;
    protected readonly typeOptions = computed(() =>
        enumToFilterOptionsWithValue(MessagingTypeEnum, (key: string) =>
            this.t(key)
        )
    );
    protected readonly targetOptions = computed(() =>
        enumToFilterOptionsWithValue(MessagingTargetEnum, (key: string) =>
            this.t(key)
        )
    );
    protected readonly channelsOptions = computed(() =>
        enumToFilterOptionsWithValue(MessagingChannelsEnum, (key: string) =>
            this.t(key)
        )
    );

    protected readonly VALIDATION = FormValidators;
    protected readonly canCreate = this.permissionActions.can(
        '/communication/messaging',
        'create'
    );

    private readonly submitSuccess = signal(false);
    private lastSubmitSuccess = this.submitFacade.actionSuccess();

    private readonly formStateEffect = effect(() => {
        const state = this.submitFacade.actionState();
        const isDetails = this.isDetailsMode();

        if (state === 'loading' || isDetails) {
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
                tap((uniqId) => this.store.setDetailsMode(uniqId)),
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
        const targetType = this.form.controls.targetType.value;

        if (fieldName === 'reportId') {
            return targetType === MessagingTargetEnum.REPORT;
        }

        return targetType === MessagingTargetEnum.AREA;
    }

    private readonly createTooltip = computed(() => {
        if (!this.canCreate()) {
            return this.t(
                'COMMUNICATION.MESSAGING.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t('COMMUNICATION.MESSAGING.TOOLTIP.CREATE');
    });
    onSubmit(): void {
        if (!this.canCreate()) {
            this.toast.error(this.createTooltip());
            return;
        }
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.showValidationErrors();
            return;
        }

        const title = this.helperService.getSweetAlertTitle(
            this.isDetailsMode()
        );
        const message = this.helperService.getSweetAlertMessage(
            this.isDetailsMode()
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

        if (this.isDetailsMode()) {
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

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
import { InfrastructureTypeFacade } from '@presentation/pages/administrative-infrastructure/application/services/infrastructure-type/infrastructure-type.facade';
import { FormValidators } from '@pages/administrative-infrastructure/domain/validators/form-validators';
import { InfrastructureTypeFormStore } from '@pages/administrative-infrastructure/presentation/store/infrastructure-type/infrastructure-type-form.store';
import { InfrastructureTypeFormHelperService } from '@presentation/pages/administrative-infrastructure/presentation/features/infrastructure-type/infrastructure-type-form/infrastructure-type-form-helper.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { FormValidationService } from '@shared/domain/services/form-validation.service';
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
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-infrastructure-type-form',
    templateUrl: './infrastructure-type-form.component.html',
    styleUrls: ['./infrastructure-type-form.component.scss'],
    standalone: true,
    imports: [
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
        InfrastructureTypeFormStore,
        FormValidationService,
        InfrastructureTypeFormHelperService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfrastructureTypeFormComponent implements OnInit {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(InfrastructureTypeFacade);
    private readonly validation = inject(FormValidationService);
    private readonly helper = inject(InfrastructureTypeFormHelperService);
    private readonly store = inject(InfrastructureTypeFormStore);
    private readonly toast = inject(ToastrService);

    protected readonly form = this.store.form;
    protected readonly isDetailsMode = this.store.isDetailsMode;
    protected readonly isEditMode = this.store.isEditMode;
    protected readonly isCreateMode = this.store.isCreateMode;
    protected readonly loading = this.store.loading;

    protected readonly loadingSubmit = computed(() => {
        return this.submitFacade.actionState() === 'loading';
    });
    protected readonly VALIDATION = FormValidators;
    private readonly canCreate = this.permissionActions.can(
        '/equipments/types',
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        '/equipments/types',
        'edit'
    );

    protected readonly titleMode = computed(() => {
        if (this.isDetailsMode()) {
            return this.translate.instant(
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.DETAILS_TITLE'
            );
        } else if (this.isEditMode()) {
            return this.translate.instant(
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.EDIT_TITLE'
            );
        } else {
            return this.translate.instant(
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.FORM.CREATE_TITLE'
            );
        }
    });
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
                tap((params) => {
                    const uniqId = params['uniqId'];
                    this.store.setMode(uniqId, params['ref']);
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        return this.validation.getErrorMessage(
            fieldName,
            control?.errors || null
        );
    }

    isFieldInvalid(fieldName: string): boolean {
        const control = this.form.get(fieldName);
        return !!(control?.invalid && control?.touched);
    }
    private readonly createTooltip = computed(() => {
        if (!this.canCreate()) {
            return this.t(
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.TOOLTIP.CREATE'
        );
    });
    private readonly editTooltip = computed(() => {
        if (!this.canEdit()) {
            return this.t(
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.TOOLTIP.NO_PERMISSION_EDIT'
            );
        }
        return this.t(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE_TYPE.TOOLTIP.NOT_EDIT'
        );
    });

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (!this.canCreate() && this.isCreateMode()) {
            this.toast.error(this.createTooltip());
            return;
        }

        if (!this.isEditMode() && this.isEditMode()) {
            this.toast.error(this.editTooltip());
            return;
        }

        const title = this.helper.getSweetAlertTitle(this.isEditMode());
        const message = this.helper.getSweetAlertMessage(this.isEditMode());

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

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }

    protected navigateToBack(): void {
        this.helper.navigateToInfrastructureTypeList();
    }
}

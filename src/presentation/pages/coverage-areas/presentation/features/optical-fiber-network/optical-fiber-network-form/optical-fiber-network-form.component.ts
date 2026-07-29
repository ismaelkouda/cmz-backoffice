import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    computed,
    effect,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OpticalFiberNetworkFacade } from '@pages/coverage-areas/application/services/optical-fiber-network/optical-fiber-network.facade';
import { FiberConstructorSelectFacade } from '@pages/coverage-areas/application/services/fiber-constructor/fiber-constructor-select.facade';
import { OpticalFiberNetworkFormStore } from '@pages/coverage-areas/presentation/store/optical-fiber-network/optical-fiber-network-form.store';
import { OpticalFiberNetworkFormHelperService } from '@pages/coverage-areas/presentation/features/optical-fiber-network/optical-fiber-network-form/optical-fiber-network-form-helper.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { FormValidationService } from '@shared/domain/services/form-validation.service';
import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';
import { FiberType } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-type.enum';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import SweetAlert from 'sweetalert2';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { ToastrService } from 'ngx-toastr';
import { GeojsonLineMapComponent } from '@shared/components/geojson-line-map/geojson-line-map.component';

const PERMISSION_PATH = '/coverage-areas/optical-fiber-networks';
const I18N = 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK';

@Component({
    selector: 'app-optical-fiber-network-form',
    templateUrl: './optical-fiber-network-form.component.html',
    styleUrls: ['./optical-fiber-network-form.component.scss'],
    standalone: true,
    imports: [
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ReactiveFormsModule,
        InputTextModule,
        SelectModule,
        ButtonModule,
        TagModule,
        ToastModule,
        TooltipModule,
        FileUploadModule,
        GeojsonLineMapComponent,
    ],
    providers: [
        MessageService,
        OpticalFiberNetworkFormStore,
        FormValidationService,
        OpticalFiberNetworkFormHelperService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpticalFiberNetworkFormComponent implements OnInit {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(OpticalFiberNetworkFacade);
    private readonly fiberConstructorFacade = inject(
        FiberConstructorSelectFacade
    );
    private readonly validation = inject(FormValidationService);
    private readonly helper = inject(OpticalFiberNetworkFormHelperService);
    private readonly store = inject(OpticalFiberNetworkFormStore);
    private readonly toast = inject(ToastrService);

    protected readonly form = this.store.form;
    protected readonly isDetailsMode = this.store.isDetailsMode;
    protected readonly isEditMode = this.store.isEditMode;
    protected readonly isCreateMode = this.store.isCreateMode;
    protected readonly loading = this.store.loading;

    protected readonly fiberConstructorOptions = toSignal(
        this.fiberConstructorFacade.items$,
        { initialValue: [] }
    );
    protected readonly fiberConstructorLoading = toSignal(
        this.fiberConstructorFacade.isLoading$,
        { initialValue: false }
    );
    protected readonly existingGeom = this.store.existingGeom;

    protected readonly operatorOptions = [
        { label: 'Moov', value: Operator.MOOV },
        { label: 'MTN', value: Operator.MTN },
        { label: 'Orange', value: Operator.ORANGE },
    ];
    protected readonly typeOptions = [
        { label: 'Mono Mode', value: FiberType.SINGLE_MODE },
        { label: 'Multi Mode', value: FiberType.MULTI_MODE },
    ];

    protected readonly loadingSubmit = computed(() => {
        return this.submitFacade.actionState() === 'loading';
    });
    private readonly canCreate = this.permissionActions.can(
        PERMISSION_PATH,
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        PERMISSION_PATH,
        'edit'
    );

    protected readonly titleMode = computed(() => {
        if (this.isDetailsMode()) {
            return this.translate.instant(`${I18N}.FORM.DETAILS_TITLE`);
        } else if (this.isEditMode()) {
            return this.translate.instant(`${I18N}.FORM.EDIT_TITLE`);
        } else {
            return this.translate.instant(`${I18N}.FORM.CREATE_TITLE`);
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

    constructor() {
        this.fiberConstructorFacade.readAll({ forceRefresh: true });
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((params) => {
                const uniqId = params['uniqId'];
                this.store.setMode(uniqId, params['ref']);
            });
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

    onFileChange(event: any): void {
        const file = event.files?.[0];
        if (file) {
            this.form.patchValue({ geomFile: file });
            this.form.get('geomFile')?.markAsTouched();
            this.form.get('geomFile')?.updateValueAndValidity();
        }
    }

    onFileClear(): void {
        this.form.patchValue({ geomFile: null });
        this.form.get('geomFile')?.markAsTouched();
        this.form.get('geomFile')?.updateValueAndValidity();
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (!this.canCreate() && this.isCreateMode()) {
            this.toast.error(this.createTooltip());
            return;
        }
        if (!this.canEdit() && this.isEditMode()) {
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

        const payload = {
            name: formValue.name,
            operator: formValue.operator,
            fiberConstructorId: formValue.fiberConstructorId,
            type: formValue.type,
            geomFile: formValue.geomFile ?? undefined,
        };

        if (this.isEditMode()) {
            this.activatedRoute.queryParams
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((params) => {
                    this.submitFacade.update({
                        uniqId: params['uniqId'],
                        ...payload,
                    });
                });
        } else {
            this.submitFacade.create(payload);
        }
    }

    private readonly createTooltip = computed(() => {
        if (!this.canCreate()) {
            return this.t(`${I18N}.TOOLTIP.NO_PERMISSION_CREATE`);
        }
        return this.t(`${I18N}.TOOLTIP.CREATE`);
    });
    private readonly editTooltip = computed(() => {
        if (!this.canEdit()) {
            return this.t(`${I18N}.TOOLTIP.NO_PERMISSION_EDIT`);
        }
        return this.t(`${I18N}.TOOLTIP.NOT_EDIT`);
    });

    protected navigateToBack(): void {
        this.helper.navigateToOpticalFiberNetworkList();
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }
}

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
import { InfrastructureFacade } from '@presentation/pages/administrative-infrastructure/application/services/infrastructure/infrastructure.facade';
import { FormValidators } from '@pages/administrative-infrastructure/domain/validators/form-validators';
import { InfrastructureFormStore } from '@pages/administrative-infrastructure/presentation/store/infrastructure/infrastructure-form.store';
import { InfrastructureFormHelperService } from '@presentation/pages/administrative-infrastructure/presentation/features/infrastructure/infrastructure-form/infrastructure-form-helper.service';
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
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';
import { LocationPickerDialogComponent } from '@shared/components/location-picker/presentation/ui/location-picker-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { GeoLocation } from '@shared/components/location-picker/domain/models/geo-location.model';

@Component({
    selector: 'app-infrastructure-form',
    templateUrl: './infrastructure-form.component.html',
    styleUrls: ['./infrastructure-form.component.scss'],
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
        InputGroupModule,
        InputGroupAddonModule,
    ],
    providers: [
        DialogService,
        MessageService,
        InfrastructureFormStore,
        FormValidationService,
        InfrastructureFormHelperService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfrastructureFormComponent implements OnInit {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly dialogService = inject(DialogService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(InfrastructureFacade);
    private readonly validation = inject(FormValidationService);
    private readonly helper = inject(InfrastructureFormHelperService);
    protected readonly store = inject(InfrastructureFormStore);
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
        '/equipments/list',
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        '/equipments/list',
        'edit'
    );

    protected readonly titleMode = computed(() => {
        if (this.isDetailsMode()) {
            return this.translate.instant(
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FORM.DETAILS_TITLE'
            );
        } else if (this.isEditMode()) {
            return this.translate.instant(
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FORM.EDIT_TITLE'
            );
        } else {
            return this.translate.instant(
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FORM.CREATE_TITLE'
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
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.CREATE'
        );
    });
    private readonly editTooltip = computed(() => {
        if (!this.canEdit()) {
            return this.t(
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.NO_PERMISSION_EDIT'
            );
        }
        return this.t(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.NOT_EDIT'
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
        this.helper.navigateToInfrastructureList();
    }

    public openLocationPicker(): void {
        if (!this.dialogService) {
            return;
        }
        const ref = this.dialogService.open(LocationPickerDialogComponent, {
            header: 'Sélectionner une position sur la carte',
            width: '90vw',
            height: 'auto',
            maximizable: true,
            draggable: false,
            closable: true,
            data: { initialCoords: this.initialCoords },
            styleClass: 'location-picker-dialog',
        });
        ref?.onClose.subscribe((result: GeoLocation | null) => {
            if (result) {
                this.store.setCoordinates(result);
            }
        });
    }
    private get initialCoords(): Coordinates | undefined {
        const coordinatesControl = this.form.controls.position;
        return coordinatesControl.value;
    }
}

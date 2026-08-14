import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    Signal,
    computed,
    effect,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RadioRelayLinksFacade } from '@pages/coverage-areas/application/services/radio-relay-links/radio-relay-links.facade';
import { RadioRelayLinksFormStore } from '@pages/coverage-areas/presentation/store/radio-relay-links/radio-relay-links-form.store';
import { RadioRelayLinksFormHelperService } from '@pages/coverage-areas/presentation/features/radio-relay-links/radio-relay-links-form/radio-relay-links-form-helper.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { FormValidationService } from '@shared/domain/services/form-validation.service';
import {
    enumToFilterOptionsWithValue,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import SweetAlert from 'sweetalert2';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { ToastrService } from 'ngx-toastr';
import { DatePickerModule } from 'primeng/datepicker';
import { map, startWith } from 'rxjs';
import {
    RadioRelayLinksMapPickerComponent,
    RelayPointChange,
} from './radio-relay-links-map-picker.component';

const PERMISSION_PATH = '/coverage-areas/radio-relay-links';
const I18N = 'COVERAGE_AREAS.RADIO_RELAY_LINKS';

@Component({
    selector: 'app-radio-relay-links-form',
    templateUrl: './radio-relay-links-form.component.html',
    styleUrls: ['./radio-relay-links-form.component.scss'],
    standalone: true,
    imports: [
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ReactiveFormsModule,
        InputTextModule,
        InputNumberModule,
        InputGroupModule,
        InputGroupAddonModule,
        SelectModule,
        ButtonModule,
        TagModule,
        ToastModule,
        TooltipModule,
        DatePickerModule,
        RadioRelayLinksMapPickerComponent,
    ],
    providers: [
        MessageService,
        RadioRelayLinksFormStore,
        FormValidationService,
        RadioRelayLinksFormHelperService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioRelayLinksFormComponent implements OnInit {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly submitFacade = inject(RadioRelayLinksFacade);
    private readonly validation = inject(FormValidationService);
    private readonly helper = inject(RadioRelayLinksFormHelperService);
    private readonly store = inject(RadioRelayLinksFormStore);
    private readonly toast = inject(ToastrService);

    protected readonly form = this.store.form;
    protected readonly isDetailsMode = this.store.isDetailsMode;
    protected readonly isEditMode = this.store.isEditMode;
    protected readonly isCreateMode = this.store.isCreateMode;
    protected readonly loading = this.store.loading;
    protected readonly existingGeom = this.store.existingGeom;
    private readonly formValue = toSignal(
        this.form.valueChanges.pipe(
            startWith(this.form.getRawValue()),
            map(() => this.form.getRawValue())
        ),
        { initialValue: this.form.getRawValue() }
    );
    protected readonly pointA = computed(() => {
        const value = this.formValue();
        return {
            latitude: this.toCoordinateNumber(value.latitudePointA),
            longitude: this.toCoordinateNumber(value.longitudePointA),
        };
    });
    protected readonly pointB = computed(() => {
        const value = this.formValue();
        return {
            latitude: this.toCoordinateNumber(value.latitudePointB),
            longitude: this.toCoordinateNumber(value.longitudePointB),
        };
    });

    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );

    protected readonly operatorOptions: Signal<FilterOption[]> = computed(
        () => {
            this.currentLang();
            return enumToFilterOptionsWithValue(
                RadioRelayLinksOperator,
                this.t.bind(this)
            );
        }
    );

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
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => this.currentLang.set(event.lang));
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

    onMapPointChange(change: RelayPointChange): void {
        const values =
            change.point === 'A'
                ? {
                      latitudePointA: this.formatCoordinate(change.latitude),
                      longitudePointA: this.formatCoordinate(change.longitude),
                  }
                : {
                      latitudePointB: this.formatCoordinate(change.latitude),
                      longitudePointB: this.formatCoordinate(change.longitude),
                  };

        this.form.patchValue(values);
        const latitudeControl = this.form.get(
            change.point === 'A' ? 'latitudePointA' : 'latitudePointB'
        );
        const longitudeControl = this.form.get(
            change.point === 'A' ? 'longitudePointA' : 'longitudePointB'
        );
        latitudeControl?.markAsTouched();
        longitudeControl?.markAsTouched();
        latitudeControl?.updateValueAndValidity();
        longitudeControl?.updateValueAndValidity();
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
            name: formValue.name ?? undefined,
            operator: formValue.operator ?? undefined,
            frequency: this.helper.formatFrequency(formValue.frequency),
            longitudePointA: formValue.longitudePointA ?? undefined,
            latitudePointA: formValue.latitudePointA ?? undefined,
            longitudePointB: formValue.longitudePointB ?? undefined,
            latitudePointB: formValue.latitudePointB ?? undefined,
            geomFile: formValue.geomFile ?? undefined,
        };

        if (this.isEditMode()) {
            const uniqId = this.activatedRoute.snapshot.queryParams['uniqId'];
            this.submitFacade.update({
                uniqId,
                ...payload,
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
        this.helper.navigateToRadioRelayLinksList();
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }

    private toCoordinateNumber(value: unknown): number | null {
        if (value === null || value === undefined || value === '') {
            return null;
        }
        const numericValue = Number(value);
        return Number.isFinite(numericValue) ? numericValue : null;
    }

    private formatCoordinate(value: number): string {
        return value.toFixed(7);
    }
}

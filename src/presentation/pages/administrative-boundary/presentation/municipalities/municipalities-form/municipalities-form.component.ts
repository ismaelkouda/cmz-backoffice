import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { map, tap } from 'rxjs';
import SweetAlert from 'sweetalert2';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { FormValidationService } from '@shared/domain/services/form-validation.service';

import { DepartmentsSelectFacade } from '@presentation/pages/administrative-boundary/application/services/departments/departments-select.facade';
import { MunicipalitiesFindOneFacade } from '@presentation/pages/administrative-boundary/application/services/municipalities/municipalities-find-one.facade';
import { MunicipalitiesFacade } from '@presentation/pages/administrative-boundary/application/services/municipalities/municipalities.facade';
import { MunicipalitiesFormControl } from '@presentation/pages/administrative-boundary/domain/controls/municipalities/municipalities-form.control';
import { MunicipalitiesFormHelperService } from '@presentation/pages/administrative-boundary/domain/services/municipalities/municipalities-form-helper.service';
import { FormValidators } from '@presentation/pages/administrative-boundary/domain/validators/form-validators';

@Component({
    selector: 'app-municipalities-form',
    templateUrl: './municipalities-form.component.html',
    styleUrls: ['./municipalities-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ReactiveFormsModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        ButtonModule,
        TagModule,
        ToastModule,
        TooltipModule,
    ],
    providers: [MunicipalitiesFormHelperService, FormValidationService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MunicipalitiesFormComponent implements OnInit {
    private readonly title = inject(Title);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly submitFacade = inject(MunicipalitiesFacade);
    private readonly departmentsFacade = inject(DepartmentsSelectFacade);
    private readonly facade = inject(MunicipalitiesFindOneFacade);
    private readonly translate = inject(TranslateService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly validationService = inject(FormValidationService);
    private readonly helperService = inject(MunicipalitiesFormHelperService);
    public readonly VALIDATION = FormValidators;
    private lastSuccess = this.submitFacade.actionSuccess();
    private itemPatched = false;
    readonly departments = toSignal(this.departmentsFacade.items$, {
        initialValue: [],
    });
    readonly loadingDepartments = toSignal(this.departmentsFacade.isLoading$, {
        initialValue: false,
    });
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
    public form: FormGroup<MunicipalitiesFormControl> =
        this.fb.group<MunicipalitiesFormControl>({
            code: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.CODE.MIN),
                    Validators.maxLength(FormValidators.CODE.MAX),
                    Validators.pattern(FormValidators.CODE.PATTERN),
                ],
            }),
            name: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.NAME.MIN),
                    Validators.maxLength(FormValidators.NAME.MAX),
                    Validators.pattern(FormValidators.NAME.PATTERN),
                ],
            }),
            department: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            description: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(FormValidators.DESCRIPTION.MIN),
                    Validators.maxLength(FormValidators.DESCRIPTION.MAX),
                    Validators.pattern(FormValidators.DESCRIPTION.PATTERN),
                ],
            }),
        });

    private readonly patchFormFromItem = effect(() => {
        const item = this.items();
        if (item && Object.keys(item).length > 0 && !this.itemPatched) {
            this.form.patchValue(
                {
                    code: item.code,
                    name: item.name,
                    department: item.department,
                    description: item.description,
                },
                { emitEvent: false }
            );
            this.itemPatched = true;
        }
    });

    constructor() {
        this.title.setTitle(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_FORM.TITLE'
        );
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams
            .pipe(
                map((p) => (p['uniqId'] as string) || ''),
                tap((uniqId) => {
                    if (uniqId) {
                        this.facade.reset();
                        this.facade.read({ uniqId }, true);
                    } else {
                        this.facade.reset();
                        this.form.reset();
                    }
                    this.departmentsFacade.readAll();
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
            'code',
            'name',
            'department',
            'description',
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
        const municipality = this.form.getRawValue();
        if (this.isEditMode()) {
            this.submitFacade.update({
                uniqId: this.paramsUniqId(),
                ...municipality,
            });
        } else {
            this.submitFacade.create(municipality);
        }
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }

    navigateToBack(): void {
        this.helperService.navigateToMunicipalitiesList();
    }
}

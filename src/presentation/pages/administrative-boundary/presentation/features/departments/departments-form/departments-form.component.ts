import { CommonModule } from '@angular/common';
import {
    Component,
    computed,
    effect,
    inject,
    Signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DEPARTMENTS_ROUTE } from '@presentation/pages/administrative-boundary/administrative-boundary.route';
import { DepartmentsFindoneFacade } from '@presentation/pages/administrative-boundary/core/application/services/departments/departments-findone.facade';
import { DepartmentsFacade } from '@presentation/pages/administrative-boundary/core/application/services/departments/departments.facade';
import { RegionsSelectFacade } from '@presentation/pages/administrative-boundary/core/application/services/regions/regions-select.facade';
import { DepartmentsFormControls } from '@presentation/pages/administrative-boundary/core/domain/controls/departments/departments-form.control';
import { FormValidators } from '@presentation/pages/administrative-boundary/core/domain/validators/form-validators';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { ADMINISTRATIVE_BOUNDARY_ROUTE } from '@shared/routes/routes';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { map } from 'rxjs';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-departments-form',
    templateUrl: './departments-form.component.html',
    styleUrls: ['./departments-form.component.scss'],
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
    providers: [MessageService],
})
export class DepartmentsFormComponent {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(DepartmentsFacade);
    private readonly regionsFacade = inject(RegionsSelectFacade);
    private readonly findOneFacade = inject(DepartmentsFindoneFacade);
    private readonly translate = inject(TranslateService);
    private readonly messageService = inject(MessageService);
    public readonly VALIDATION = FormValidators;
    readonly regions = toSignal(this.regionsFacade.items$, { initialValue: [] });
    readonly currentDepartment = toSignal(this.findOneFacade.item$, { initialValue: null });
    private readonly paramsCode: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(map(params => params['code'])),
        { initialValue: '' }
    );
    readonly isEditMode = computed(() => !!this.paramsCode());
    public form: FormGroup<DepartmentsFormControls> = this.fb.nonNullable.group<DepartmentsFormControls>({
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
        regionCode: new FormControl('', {
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

    constructor() {
        effect(() => {
            this.regionsFacade.readAll();
            const code = this.paramsCode();
            if (code) {
                this.findOneFacade.reset();
                this.findOneFacade.read({ code }, true);
            } else {
                this.findOneFacade.reset();
                this.form.reset();
            }
        });

        effect(() => {
            const department = this.currentDepartment();
            if (department && Object.keys(department).length > 0) {
                this.form.patchValue({
                    code: department.code,
                    name: department.name,
                    regionCode: department.region,
                    description: department.description,
                });
            }
        });
    }

    public getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        if (!control || !control.errors) return '';

        const errors = control.errors;
        if (errors['minlength']) {
            return `${this.translate.instant('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.VALIDATION.MIN_LENGTH')}: ${errors['minlength'].requiredLength}`;
        }
        if (errors['maxlength']) {
            return `${this.translate.instant('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.VALIDATION.MAX_LENGTH')}: ${errors['maxlength'].requiredLength}`;
        }
        if (errors['pattern']) {
            return this.translate.instant('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.VALIDATION.INVALID_FORMAT');
        }
        return this.translate.instant('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FORM.VALIDATION.INVALID_INPUT');
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.showValidationErrors();
            return;
        }

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(this.getSweetAlertTitle()),
            text: `${this.translate.instant(this.getSweetAlertMessage())}`,
            backdrop: false,
            confirmButtonText: this.translate.instant('COMMON.CONFIRM'),
            cancelButtonText: this.translate.instant('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = this.form.getRawValue();
                const id: string = this.paramsCode();
                if (this.isEditMode() && id) {
                    this.facade.update({ id, ...formData }).subscribe(() => {
                        this.onCancel()
                        this.facade.refreshWithLastFilterAndPage()
                    });
                } else {
                    this.facade.create(formData).subscribe(() => {
                        this.onCancel()
                        this.facade.refreshWithLastFilterAndPage()
                    });
                }
            }
        });
    }

    private getSweetAlertTitle(): string {
        return this.isEditMode() ? 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.TITLE_UPDATE' : 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.TITLE_CREATE';
    }

    private getSweetAlertMessage(): string {
        return this.isEditMode() ? 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.MESSAGE_UPDATE' : 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.MESSAGE_CREATE';
    }

    private showValidationErrors(): void {
        const errors = [];
        if (this.form.controls.code.invalid) {
            errors.push(this.getErrorMessage('code'));
        }
        if (this.form.controls.regionCode.invalid) {
            errors.push(this.getErrorMessage('regionCode'));
        }
        if (this.form.controls.name.invalid) {
            errors.push(this.getErrorMessage('name'));
        }
        if (this.form.controls.description.invalid) {
            errors.push(this.getErrorMessage('description'));
        }

        if (errors.length > 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreurs de validation',
                detail: errors.join('\n'),
                life: 5000,
            });
        }
    }

    onCancel(): void {
        this.router.navigate([ADMINISTRATIVE_BOUNDARY_ROUTE + '/' + DEPARTMENTS_ROUTE]);
    }
}

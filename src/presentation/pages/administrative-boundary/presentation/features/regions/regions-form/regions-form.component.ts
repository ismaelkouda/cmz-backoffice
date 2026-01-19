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
import { REGIONS_ROUTE } from '@presentation/pages/administrative-boundary/administrative-boundary.route';
import { RegionsFindoneFacade } from '@presentation/pages/administrative-boundary/core/application/services/regions/regions-findone.facade';
import { RegionsFacade } from '@presentation/pages/administrative-boundary/core/application/services/regions/regions.facade';
import { RegionsFormControl } from '@presentation/pages/administrative-boundary/core/domain/controls/regions/regions-form.control';
import { FormValidators } from '@presentation/pages/administrative-boundary/core/domain/validators/form-validators';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { ADMINISTRATIVE_BOUNDARY_ROUTE } from '@shared/routes/routes';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { map } from 'rxjs';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-regions-form',
    templateUrl: './regions-form.component.html',
    styleUrls: ['./regions-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ReactiveFormsModule,
        InputTextModule,
        TextareaModule,
        ButtonModule,
        TagModule,
        ToastModule,
        TooltipModule,
    ],
    providers: [MessageService],
})
export class RegionsFormComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(RegionsFacade);
    private readonly findOneFacade = inject(RegionsFindoneFacade);
    private readonly translate = inject(TranslateService);
    private readonly messageService = inject(MessageService);
    public readonly VALIDATION = FormValidators;
    readonly currentRegion = toSignal(this.findOneFacade.item$, { initialValue: null });
    private readonly paramsCode: Signal<string> = toSignal(
        this.route.queryParams.pipe(map(params => params['code'])),
        { initialValue: '' }
    );
    readonly isEditMode = computed(() => !!this.paramsCode());
    public form: FormGroup<RegionsFormControl> = this.fb.nonNullable.group<RegionsFormControl>({
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
            const code = this.paramsCode();
            if (code) {
                this.findOneFacade.read({ code });
            } else {
                this.findOneFacade.reset();
                this.form.reset();
            }
        });

        effect(() => {
            const region = this.currentRegion();
            if (region && Object.keys(region).length > 0) {
                this.form.patchValue({
                    code: region.code,
                    name: region.name,
                    description: region.description,
                });
            }
        });
    }

    public getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        if (!control || !control.errors) return '';

        const errors = control.errors;
        if (errors['minlength']) {
            return `${this.translate.instant('ADMINISTRATIVE_BOUNDARY.REGIONS.FORM.VALIDATION.MIN_LENGTH')}: ${errors['minlength'].requiredLength}`;
        }
        if (errors['maxlength']) {
            return `${this.translate.instant('ADMINISTRATIVE_BOUNDARY.REGIONS.FORM.VALIDATION.MAX_LENGTH')}: ${errors['maxlength'].requiredLength}`;
        }
        if (errors['pattern']) {
            return this.translate.instant('ADMINISTRATIVE_BOUNDARY.REGIONS.FORM.VALIDATION.INVALID_FORMAT');
        }
        return this.translate.instant('ADMINISTRATIVE_BOUNDARY.REGIONS.FORM.VALIDATION.INVALID_INPUT');
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
        return this.isEditMode() ? 'ADMINISTRATIVE_BOUNDARY.REGIONS.SWEET_ALERT.TITLE_UPDATE' : 'ADMINISTRATIVE_BOUNDARY.REGIONS.SWEET_ALERT.TITLE_CREATE';
    }

    private getSweetAlertMessage(): string {
        return this.isEditMode() ? 'ADMINISTRATIVE_BOUNDARY.REGIONS.SWEET_ALERT.MESSAGE_UPDATE' : 'ADMINISTRATIVE_BOUNDARY.REGIONS.SWEET_ALERT.MESSAGE_CREATE';
    }

    private showValidationErrors(): void {
        const errors = [];
        if (this.form.controls.code.invalid) {
            errors.push('Code: ' + this.getErrorMessage('code'));
        }
        if (this.form.controls.name.invalid) {
            errors.push('Nom: ' + this.getErrorMessage('name'));
        }
        if (this.form.controls.description.invalid) {
            errors.push('Description: ' + this.getErrorMessage('description'));
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
        this.router.navigate([ADMINISTRATIVE_BOUNDARY_ROUTE + '/' + REGIONS_ROUTE]);
    }
}

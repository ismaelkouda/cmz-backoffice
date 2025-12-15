import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LEGAL_NOTICE_ROUTE } from '@presentation/pages/content-management/content-management.routes';
import { LegalNoticeFacade } from '@presentation/pages/content-management/core/application/services/legal-notice.facade';
import { GetLegalNoticeByIdEntity } from '@presentation/pages/content-management/core/domain/entities/get-legal-notice-by-id.entity';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { semanticVersionValidator } from '@shared/domain/functions/semantic-version-validator';
import { CONTENT_MANAGEMENT_ROUTE } from '@shared/routes/routes';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-form-legal-notice',
    templateUrl: './form-legal-notice.component.html',
    styleUrls: ['./form-legal-notice.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ReactiveFormsModule,
        EditorModule,
        FileUploadModule,
        DatePickerModule,
        InputTextModule,
        TextareaModule,
        MultiSelectModule,
        SelectModule,
        ButtonModule,
        TagModule,
        InputNumberModule,
        ToastModule,
        TooltipModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService]
})
export class FormLegalNoticeComponent implements OnInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly legalNoticeFacade = inject(LegalNoticeFacade);
    private readonly translate = inject(TranslateService);
    private readonly titleService = inject(Title);

    public pageTitle$!: Observable<string>;
    public module!: string;
    public subModule!: string;

    public form!: FormGroup;
    public isEditMode = false;
    public currentId?: string;

    public isFormValid = false;
    public saveButtonState = {
        disabled: true,
        tooltip: '',
        severity: 'danger' as 'success' | 'warning' | 'danger' | 'info'
    }

    ngOnInit(): void {
        this.initForm();
        this.setupRouteData();
        this.setupFormValidation();
        this.checkEditMode();
    }

    private initForm(): void {
        this.form = this.fb.group({
            content: ['', Validators.required],
            version: ['', [Validators.required, semanticVersionValidator(), Validators.pattern(/^\d+(\.\d+){0,2}$/)]]
        });
    }

    private setupFormValidation(): void {
        this.form.statusChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.updateFormValidity();
                this.updateSaveButtonState();
            });

        this.form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.updateFormValidity();
                this.updateSaveButtonState();
            });
    }


    private updateFormValidity(): void {
        const isFormValid = this.form.valid;

        this.isFormValid = isFormValid;
        this.cdr.detectChanges();
    }

    private updateSaveButtonState(): void {
        const isFormValid = this.form.valid;
        const isPristine = this.form.pristine;

        if (!isFormValid) {
            this.saveButtonState = {
                disabled: true,
                tooltip: this.getValidationTooltip(),
                severity: 'danger'
            };
        } else if (isPristine) {
            this.saveButtonState = {
                disabled: true,
                tooltip: this.translate.instant('COMMON.VALIDATION.NO_CHANGES'),
                severity: 'info'
            };
        } else {
            this.saveButtonState = {
                disabled: false,
                tooltip: this.translate.instant('COMMON.SAVE'),
                severity: 'success'
            };
        }
    }

    public getValidationTooltip(): string {
        const errors: string[] = [];

        Object.keys(this.form.controls).forEach(key => {
            const control = this.form.get(key);
            if (control?.invalid && control?.touched) {
                const fieldLabel = this.getFieldLabel(key);
                const errorMessage = this.getControlErrorMessage(control);
                errors.push(`• ${fieldLabel}: ${errorMessage}`);
            }
        });

        return errors.join('\n');
    }

    public getFormErrors(): string[] {
        const errors: string[] = [];

        Object.keys(this.form.controls).forEach(key => {
            const control = this.form.get(key);
            if (control?.invalid && control?.touched) {
                const fieldLabel = this.getFieldLabel(key);
                const errorMessage = this.getControlErrorMessage(control);
                errors.push(`${fieldLabel}: ${errorMessage}`);
            }
        });

        return errors;
    }

    private getFieldLabel(fieldName: string): string {
        const labels: { [key: string]: string } = {
            content: this.translate.instant('CONTENT_MANAGEMENT.LEGAL_NOTICE.FORM.DESCRIPTION'),
            version: this.translate.instant('CONTENT_MANAGEMENT.LEGAL_NOTICE.FORM.VERSION')
        };
        return labels[fieldName] || fieldName;
    }


    private getControlErrorMessage(control: AbstractControl): string {
        if (control.hasError('required')) {
            return this.translate.instant('COMMON.VALIDATION.REQUIRED');
        } else if (control.hasError('minlength')) {
            return this.translate.instant('COMMON.VALIDATION.MIN_LENGTH', {
                length: control.errors?.['minlength']?.['requiredLength']
            });
        } else if (control.hasError('maxlength')) {
            return this.translate.instant('COMMON.VALIDATION.MAX_LENGTH', {
                length: control.errors?.['maxlength']?.['requiredLength']
            });
        } else if (control.hasError('pattern')) {
            return this.translate.instant('COMMON.VALIDATION.PATTERN');
        }
        return '';
    }

    private setupRouteData(): void {
        this.pageTitle$ = this.route.data.pipe(
            map(data => data['title'] || 'CONTENT_MANAGEMENT.LEGAL_NOTICE.LABEL')
        );

        this.route.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.module = data['module'] || 'CONTENT_MANAGEMENT.LABEL';
            this.subModule = data['subModule'] || 'CONTENT_MANAGEMENT.LEGAL_NOTICE.TITLE';
            this.titleService.setTitle(data['title'] ? this.translate.instant(data['title']) : 'CMZ');
        });
    }

    private checkEditMode(): void {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.isEditMode = true;
            this.currentId = id;
            this.legalNoticeFacade.getById(id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(item => {
                    console.log(item);
                    this.patchForm(item);
                });
        }
    }

    private patchForm(item: GetLegalNoticeByIdEntity): void {
        this.form.patchValue({
            content: item.content,
            version: item.version
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formData = this.prepareFormData();

        if (this.isEditMode && this.currentId) {
            this.legalNoticeFacade.update(this.currentId, formData).subscribe({
                next: () => {
                    this.onCancel();
                },
            });
        } else {
            this.legalNoticeFacade.create(formData).subscribe({
                next: () => {
                    this.onCancel();
                },
            });
        }
    }

    private prepareFormData(): FormData {
        const formData = new FormData();
        const values = this.form.value;

        formData.append('content', values.content || '');
        formData.append('version', String(values.version));

        return formData;
    }

    onCancel(): void {
        this.router.navigate([CONTENT_MANAGEMENT_ROUTE + '/' + LEGAL_NOTICE_ROUTE]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
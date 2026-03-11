import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    OnInit,
    Signal,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HomeFindOneFacade } from '@pages/content-management/application/services/home/home-find-one.facade';
import { HomeFacade } from '@pages/content-management/application/services/home/home.facade';
import { HomeFormControl } from '@pages/content-management/domain/controls/home/home-form.control';
import { HomeFormHelperService } from '@pages/content-management/domain/services/home/home-form-helper.service';
import { FormValidators } from '@pages/content-management/domain/validators/form-validators';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
    enumToFilterOptions,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { Platform } from '@shared/domain/enums/platform.enum';
import { FormValidationService } from '@shared/domain/services/form-validation.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
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
import { map, tap } from 'rxjs';
import SweetAlert from 'sweetalert2';

// import { formDataBuilder } from '@shared/constants/formDataBuilder.constant';

@Component({
    selector: 'app-home-form',
    templateUrl: './home-form.component.html',
    styleUrls: ['./home-form.component.scss'],
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
        DialogModule,
        TagModule,
        InputNumberModule,
        ToastModule,
        TooltipModule,
    ],
    providers: [HomeFormHelperService, MessageService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeFormComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    public readonly submitFacade = inject(HomeFacade);
    private readonly facade = inject(HomeFindOneFacade);
    private readonly translate = inject(TranslateService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly validationService = inject(FormValidationService);
    private readonly helperService = inject(HomeFormHelperService);
    public readonly VALIDATION = FormValidators;
    private lastSuccess = this.submitFacade.actionSuccess();
    private itemPatched = false;
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

    readonly platformOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(Platform, this.t.bind(this));
    });
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );

    public readonly imagePreview = signal<string | null>(null);
    public originalImageUrl!: string;
    public isPreviewVisible = false;
    public previewContent: SafeUrl | string | null = null;

    readonly form: FormGroup<HomeFormControl> =
        this.fb.nonNullable.group<HomeFormControl>(
            {
                title: new FormControl('', {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.minLength(FormValidators.TITLE.MIN),
                        Validators.maxLength(FormValidators.TITLE.MAX),
                        Validators.pattern(FormValidators.TITLE.PATTERN),
                    ],
                }),
                resume: new FormControl('', {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.minLength(FormValidators.RESUME.MIN),
                        Validators.maxLength(FormValidators.RESUME.MAX),
                        Validators.pattern(FormValidators.RESUME.PATTERN),
                    ],
                }),
                content: new FormControl('', {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.minLength(FormValidators.CONTENT.MIN),
                        this.htmlContentMaxLengthValidator(
                            FormValidators.CONTENT.STRIP_HTML_MAX
                        ),
                    ],
                }),
                image: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                buttonLabel: new FormControl('', {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.minLength(FormValidators.BUTTON_LABEL.MIN),
                        Validators.maxLength(FormValidators.BUTTON_LABEL.MAX),
                        Validators.pattern(FormValidators.BUTTON_LABEL.PATTERN),
                    ],
                }),
                buttonUrl: new FormControl('', {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.maxLength(FormValidators.BUTTON_URL.MAX),
                        Validators.pattern(FormValidators.BUTTON_URL.PATTERN),
                    ],
                }),
                platforms: new FormControl([], {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                startDate: new FormControl('', {
                    nonNullable: true,
                }),
                endDate: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
            },
            { validators: this.buttonFieldsConsistencyValidator() }
        );

    private htmlContentMaxLengthValidator(maxLength: number): any {
        return (control: any) => {
            if (!control.value) {
                return null;
            }

            const strippedText = control.value
                .replaceAll(/<[^>]*>/g, '')
                .trim();

            if (strippedText.length > maxLength) {
                return {
                    htmlMaxLength: {
                        actual: strippedText.length,
                        maxAllowed: maxLength,
                    },
                };
            }

            return null;
        };
    }

    private buttonFieldsConsistencyValidator(): any {
        return (group: FormGroup) => {
            const buttonLabel = group.get('buttonLabel')?.value;
            const buttonUrl = group.get('buttonUrl')?.value;

            if (
                buttonLabel &&
                buttonLabel.trim() &&
                (!buttonUrl || !buttonUrl.trim())
            ) {
                return { buttonLabelWithoutUrl: true };
            }

            if (
                buttonUrl &&
                buttonUrl.trim() &&
                (!buttonLabel || !buttonLabel.trim())
            ) {
                return { buttonUrlWithoutLabel: true };
            }

            return null;
        };
    }

    private readonly patchFormFromItem = effect(() => {
        const item = this.items();
        if (item && Object.keys(item).length > 0 && !this.itemPatched) {
            this.form.patchValue(
                {
                    title: item.title,
                    resume: item.resume,
                    content: item.content,
                    image: item.image,
                    buttonLabel: item.buttonLabel,
                    buttonUrl: item.buttonUrl,
                    platforms: item.platforms,
                    startDate: item.startDate,
                    endDate: item.endDate,
                },
                { emitEvent: false }
            );
            if (item.image) {
                this.imagePreview.set(item.image);
            }
            this.itemPatched = true;
        }
    });

    ngOnInit(): void {
        this.activatedRoute.queryParams
            .pipe(
                map((p) => (p['uniqId'] as string) || ''),
                tap((uniqId) => {
                    this.facade.reset();
                    if (uniqId) {
                        this.facade.read({ uniqId }, true);
                    } else {
                        this.form.reset();
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    public get allowedImageTypes(): string {
        return FormValidators.IMAGE.ALLOWED_TYPES.map((t) =>
            t.split('/')[1].toUpperCase()
        ).join(', ');
    }

    public getContentCharacterCount(): number {
        const content = this.form.get('content')?.value || '';
        return content.replaceAll(/<[^>]*>/g, '').trim().length;
    }

    public getContentCountStatus(): 'safe' | 'warning' | 'danger' {
        const count = this.getContentCharacterCount();
        const max = FormValidators.CONTENT.STRIP_HTML_MAX;

        if (count > max * 0.9) {
            return 'danger';
        }
        if (count > max * 0.7) {
            return 'warning';
        }
        return 'safe';
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
            'title',
            'resume',
            'content',
            'buttonLabel',
            'buttonUrl',
            'platforms',
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

    private validateImageFile(file: File): void {
        const imageControl = this.form.get('image');

        if (file.size > FormValidators.IMAGE.MAX_SIZE_MB * 1000000) {
            imageControl?.setErrors({
                fileTooLarge: {
                    maxSize: FormValidators.IMAGE.MAX_SIZE_MB,
                    actualSize: file.size,
                },
            });
            return;
        }

        this.checkImageDimensions(file).then((dimensions) => {
            if (
                dimensions.width > FormValidators.IMAGE.MAX_DIMENSIONS.WIDTH ||
                dimensions.height > FormValidators.IMAGE.MAX_DIMENSIONS.HEIGHT
            ) {
                imageControl?.setErrors({ imageDimensions: true });
            }
        });

        imageControl?.setErrors(null);
    }

    public removeImage(): void {
        this.imagePreview.set(null);
        this.form.get('image')?.reset();
        this.form.get('image')?.markAsTouched();
    }

    private checkImageDimensions(
        file: File
    ): Promise<{ width: number; height: number }> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = (): void => {
                resolve({ width: img.width, height: img.height });
            };
            img.src = URL.createObjectURL(file);
        });
    }

    onFileSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            const file = event.files[0];

            this.validateImageFile(file);

            this.form.patchValue({ image: file });

            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.imagePreview.set(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    restoreImage(): void {
        this.imagePreview.set(this.originalImageUrl);
        this.form.patchValue({ image: this.originalImageUrl });
    }

    openPreview(): void {
        this.previewContent = this.imagePreview();
        if (this.previewContent) {
            this.isPreviewVisible = true;
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
        const item = this.form.getRawValue();

        if (this.isEditMode()) {
            this.submitFacade.update({
                uniqId: this.paramsUniqId(),
                ...item,
            });
        } else {
            this.submitFacade.create(item);
        }
    }

    // private prepareSubmitData(): FormData {
    //     const formData = formDataBuilder(this.form.getRawValue());
    //     return formData;
    // }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }

    navigateToBack(): void {
        this.helperService.navigateToHomeList();
    }
}

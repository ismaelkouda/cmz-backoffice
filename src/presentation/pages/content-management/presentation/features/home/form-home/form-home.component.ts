import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HOME_ROUTE } from '@presentation/pages/content-management/content-management.routes';
import { HomeFacade } from '@presentation/pages/content-management/core/application/services/home.facade';
import { HomeEntity } from '@presentation/pages/content-management/core/domain/entities/home.entity';
import { FormValidators } from '@presentation/pages/content-management/core/domain/validators/form-validators';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { TypeMediaDto } from '@shared/data/dtos/type-media.dto';
import { CONTENT_MANAGEMENT_ROUTE } from '@shared/routes/routes';
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
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-form-home',
    templateUrl: './form-home.component.html',
    styleUrls: ['./form-home.component.scss'],
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService],
})
export class FormHomeComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly homeFacade = inject(HomeFacade);
    private readonly translate = inject(TranslateService);
    private readonly titleService = inject(Title);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly messageService = inject(MessageService);
    public readonly VALIDATION = FormValidators;

    public pageTitle$!: Observable<string>;
    public module = signal<string>('');
    public subModule = signal<string>('');
    public title = signal<string>('');

    public form!: FormGroup;
    public isEditMode = false;
    public currentId?: string;

    public currentType$ = new BehaviorSubject<TypeMediaDto>(TypeMediaDto.IMAGE);
    public isVideoType$ = this.currentType$.pipe(
        map((type) => type === TypeMediaDto.VIDEO)
    );
    public TypeMediaDto = TypeMediaDto;

    public typeOptions = [
        { label: 'Image', value: TypeMediaDto.IMAGE },
        { label: 'Video', value: TypeMediaDto.VIDEO },
    ];

    public platformOptions: any[] = [
        { label: 'Web', value: 'web' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'PWA', value: 'pwa' },
    ];

    public uploadedFile: File | null = null;
    public imagePreview: string | null = null;
    public originalImageUrl: string | null = null;
    public originalVideoUrl: string | null = null;
    public imageRemoved = false;

    public isPreviewVisible = false;
    public previewType: 'image' | 'video' = 'image';
    public previewContent: SafeUrl | string | null = null;

    ngOnInit(): void {
        this.initForm();
        this.setupRouteData();
        this.checkEditMode();
    }

    private initForm(): void {
        this.form = this.fb.group(
            {
                title: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(FormValidators.TITLE.MIN),
                        Validators.maxLength(FormValidators.TITLE.MAX),
                        Validators.pattern(FormValidators.TITLE.PATTERN),
                    ],
                ],
                resume: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(FormValidators.RESUME.MIN),
                        Validators.maxLength(FormValidators.RESUME.MAX),
                        Validators.pattern(FormValidators.RESUME.PATTERN),
                    ],
                ],
                content: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(FormValidators.CONTENT.MIN),
                        this.htmlContentMaxLengthValidator(
                            FormValidators.CONTENT.STRIP_HTML_MAX
                        ),
                    ],
                ],
                type: [TypeMediaDto.IMAGE, Validators.required],
                videoUrl: [''],
                imageFile: [null, [Validators.required]],
                buttonLabel: [
                    '',
                    [
                        Validators.minLength(FormValidators.BUTTON_LABEL.MIN),
                        Validators.maxLength(FormValidators.BUTTON_LABEL.MAX),
                        Validators.pattern(FormValidators.BUTTON_LABEL.PATTERN),
                    ],
                ],
                buttonUrl: [
                    '',
                    [
                        Validators.maxLength(FormValidators.BUTTON_URL.MAX),
                        Validators.pattern(FormValidators.BUTTON_URL.PATTERN),
                    ],
                ],
                platforms: [[], Validators.required],
                startDate: [null],
                endDate: [null],
                isActive: [true],
            },
            { validators: this.buttonFieldsConsistencyValidator() }
        );

        this.currentType$.next(TypeMediaDto.IMAGE);
        this.setupFormListeners();
    }

    public detectVideoPlatform(
        url: string
    ): 'youtube' | 'vimeo' | 'dailymotion' | 'other' {
        if (!url) return 'other';

        if (FormValidators.VIDEO_URL.PATTERNS.YOUTUBE.test(url)) {
            return 'youtube';
        }
        if (FormValidators.VIDEO_URL.PATTERNS.VIMEO.test(url)) {
            return 'vimeo';
        }
        if (FormValidators.VIDEO_URL.PATTERNS.DAILYMOTION.test(url)) {
            return 'dailymotion';
        }

        return 'other';
    }

    public getVideoPlatformIcon(platform: string): string {
        switch (platform) {
            case 'youtube':
                return 'pi pi-youtube text-danger';
            case 'vimeo':
                return 'pi pi-vimeo text-info';
            case 'dailymotion':
                return 'pi pi-play-circle text-primary';
            default:
                return 'pi pi-video text-muted';
        }
    }

    public getVideoPlatformName(platform: string): string {
        switch (platform) {
            case 'youtube':
                return 'YouTube';
            case 'vimeo':
                return 'Vimeo';
            case 'dailymotion':
                return 'Dailymotion';
            default:
                return 'Autre plateforme';
        }
    }

    public getFileSizeStatus(fileSize: number): string {
        const maxSize = FormValidators.IMAGE_FILE.MAX_SIZE_MB * 1024 * 1024;
        const sizeInMB = fileSize / 1024 / 1024;

        if (sizeInMB > FormValidators.IMAGE_FILE.MAX_SIZE_MB * 0.9) {
            return `⚠️ ${sizeInMB.toFixed(2)}/${FormValidators.IMAGE_FILE.MAX_SIZE_MB} MB (presque plein)`;
        }

        return `${sizeInMB.toFixed(2)}/${FormValidators.IMAGE_FILE.MAX_SIZE_MB} MB`;
    }

    private htmlContentMaxLengthValidator(maxLength: number): any {
        return (control: any) => {
            if (!control.value) {
                return null;
            }

            const strippedText = control.value.replace(/<[^>]*>/g, '').trim();

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

    public get allowedImageTypes(): string {
        return FormValidators.IMAGE_FILE.ALLOWED_TYPES.map((t) =>
            t.split('/')[1].toUpperCase()
        ).join(', ');
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

    public getContentCharacterCount(): number {
        const content = this.form.get('content')?.value || '';
        return content.replace(/<[^>]*>/g, '').trim().length;
    }

    public getContentCountStatus(): 'safe' | 'warning' | 'danger' {
        const count = this.getContentCharacterCount();
        const max = FormValidators.CONTENT.STRIP_HTML_MAX;

        if (count > max * 0.9) return 'danger';
        if (count > max * 0.7) return 'warning';
        return 'safe';
    }

    public getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        if (!control || !control.errors) return '';

        const errors = control.errors;

        if (errors['minlength']) {
            return `${this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.VALIDATION.MIN_LENGTH')}: ${errors['minlength'].requiredLength}`;
        }

        if (errors['maxlength']) {
            return `${this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.VALIDATION.MAX_LENGTH')}: ${errors['maxlength'].requiredLength}`;
        }

        if (errors['pattern']) {
            return this.translate.instant(
                'CONTENT_MANAGEMENT.HOME.FORM.VALIDATION.INVALID_FORMAT'
            );
        }

        if (errors['htmlMaxLength']) {
            return `${this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.VALIDATION.CONTENT_TOO_LONG')}: ${errors['htmlMaxLength'].actual}/${errors['htmlMaxLength'].maxAllowed}`;
        }

        if (errors['buttonLabelWithoutUrl']) {
            return this.translate.instant(
                'CONTENT_MANAGEMENT.HOME.FORM.VALIDATION.BUTTON_LABEL_WITHOUT_URL'
            );
        }

        if (errors['buttonUrlWithoutLabel']) {
            return this.translate.instant(
                'CONTENT_MANAGEMENT.HOME.FORM.VALIDATION.BUTTON_URL_WITHOUT_LABEL'
            );
        }

        if (fieldName === 'videoUrl') {
            if (errors['invalidVideoUrl']) {
                return this.translate.instant('VALIDATION.INVALID_VIDEO_URL');
            }
            if (errors['maxlength']) {
                return `${this.translate.instant('VALIDATION.MAX_LENGTH')}: ${errors['maxlength'].requiredLength}`;
            }
            if (errors['pattern']) {
                return this.translate.instant('VALIDATION.INVALID_URL_FORMAT');
            }
        }

        if (fieldName === 'imageFile') {
            if (errors['invalidImageType']) {
                return this.translate.instant('VALIDATION.INVALID_IMAGE_TYPE');
            }
            if (errors['fileTooLarge']) {
                return this.translate.instant('VALIDATION.FILE_TOO_LARGE', {
                    maxSize: FormValidators.IMAGE_FILE.MAX_SIZE_MB,
                });
            }
            if (errors['imageDimensions']) {
                return this.translate.instant(
                    'VALIDATION.IMAGE_DIMENSIONS_TOO_LARGE',
                    {
                        maxWidth:
                            FormValidators.IMAGE_FILE.MAX_DIMENSIONS.WIDTH,
                        maxHeight:
                            FormValidators.IMAGE_FILE.MAX_DIMENSIONS.HEIGHT,
                    }
                );
            }
        }

        return this.translate.instant(
            'CONTENT_MANAGEMENT.HOME.FORM.VALIDATION.INVALID_INPUT'
        );
    }

    private setupFormListeners(): void {
        this.form
            .get('type')
            ?.valueChanges.pipe(
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((type: TypeMediaDto) => {
                this.currentType$.next(type);
                this.updateMediaFieldsBasedOnType(type);
            });

        this.form
            .get('videoUrl')
            ?.valueChanges.pipe(
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((url: string) => {
                if (url && this.currentType$.value === TypeMediaDto.VIDEO) {
                    this.validateVideoUrl(url);
                }
            });

        combineLatest([
            this.form.statusChanges.pipe(startWith(this.form.status)),
            this.form.valueChanges.pipe(startWith(this.form.value)),
        ])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.cdr.markForCheck();
            });
    }

    private updateMediaFieldsBasedOnType(type: TypeMediaDto): void {
        const videoControl = this.form.get('videoUrl');
        const imageControl = this.form.get('imageFile');

        if (type === TypeMediaDto.VIDEO) {
            videoControl?.setValidators([Validators.required]);
            videoControl?.enable();

            imageControl?.clearValidators();
            imageControl?.reset();
            imageControl?.disable();

            this.uploadedFile = null;
            this.imagePreview = null;
            this.imageRemoved = false;
        } else {
            videoControl?.clearValidators();
            videoControl?.reset();
            videoControl?.disable();

            imageControl?.setValidators([Validators.required]);
            imageControl?.enable();
        }

        videoControl?.updateValueAndValidity({ emitEvent: false });
        imageControl?.updateValueAndValidity({ emitEvent: false });

        this.form.updateValueAndValidity();
        this.cdr.markForCheck();
    }

    private validateVideoUrl(url: string): void {
        if (!url.trim()) return;

        const urlPattern =
            /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com)\/.+$/;

        if (!urlPattern.test(url)) {
            this.form.get('videoUrl')?.setErrors({ invalidVideoUrl: true });
        }
    }

    private validateImageFile(file: File): void {
        const imageControl = this.form.get('imageFile');

        // Vérification du type
        if (!FormValidators.IMAGE_FILE.ALLOWED_TYPES.includes(file.type)) {
            imageControl?.setErrors({ invalidImageType: true });
            return;
        }

        // Vérification de la taille
        if (file.size > FormValidators.IMAGE_FILE.MAX_SIZE_MB * 1000000) {
            imageControl?.setErrors({
                fileTooLarge: {
                    maxSize: FormValidators.IMAGE_FILE.MAX_SIZE_MB,
                    actualSize: file.size,
                },
            });
            return;
        }

        // Vérification des dimensions (optionnelle)
        this.checkImageDimensions(file).then((dimensions) => {
            if (
                dimensions.width >
                    FormValidators.IMAGE_FILE.MAX_DIMENSIONS.WIDTH ||
                dimensions.height >
                    FormValidators.IMAGE_FILE.MAX_DIMENSIONS.HEIGHT
            ) {
                imageControl?.setErrors({ imageDimensions: true });
            }
        });

        imageControl?.setErrors(null);
    }

    public removeImage(): void {
        this.uploadedFile = null;
        this.imagePreview = null;
        this.form.patchValue({ imageFile: null });
        this.form.get('imageFile')?.markAsTouched();
        this.cdr.markForCheck();
    }

    private checkImageDimensions(
        file: File
    ): Promise<{ width: number; height: number }> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.src = URL.createObjectURL(file);
        });
    }

    private setupRouteData(): void {
        this.pageTitle$ = this.route.data.pipe(
            map((data) => data['title'] || 'CONTENT_MANAGEMENT.HOME.LABEL')
        );

        this.route.data
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
                this.module = data['module'] || 'CONTENT_MANAGEMENT.LABEL';
                this.subModule =
                    data['subModule'] || 'CONTENT_MANAGEMENT.HOME.TITLE';
                this.titleService.setTitle(
                    data['title']
                        ? this.translate.instant(data['title'])
                        : 'CMZ'
                );
            });
    }

    private checkEditMode(): void {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.isEditMode = true;
            this.currentId = id;
            this.loadHomeForEdit(id);
        }
    }

    private loadHomeForEdit(id: string): void {
        this.homeFacade
            .getHomeById(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((item) => {
                this.title.set(item.title);
                this.patchForm(item);
            });
    }

    private patchForm(item: HomeEntity): void {
        const formData = {
            title: item.title,
            resume: item.resume,
            content: item.content,
            type: item.type,
            videoUrl: item.videoUrl,
            imageFile: item.imageUrl,
            order: item.order,
            buttonLabel: item.buttonLabel,
            buttonUrl: item.buttonUrl,
            platforms: item.platforms,
            startDate: item.startDate ? new Date(item.startDate) : null,
            endDate: item.endDate ? new Date(item.endDate) : null,
            isActive: item.status,
        };

        if (item.type === TypeMediaDto.VIDEO) {
            formData.videoUrl = item.videoUrl || '';
        } else {
            formData.videoUrl = null;
            if (item.imageUrl) {
                formData.imageFile = item.imageUrl;
                this.imagePreview = item.imageUrl;
            }
        }

        this.form.patchValue(formData, { emitEvent: false });

        this.currentType$.next(item.type);
        this.updateMediaFieldsBasedOnType(item.type);

        this.cdr.markForCheck();
    }

    onFileSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            const file = event.files[0];
            this.imageRemoved = false;

            this.validateImageFile(file);

            this.uploadedFile = file;
            this.form.patchValue({ imageFile: file });

            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.imagePreview = e.target.result;
                this.imageRemoved = false;
                this.cdr.markForCheck();
            };
            reader.readAsDataURL(file);
        }
    }

    restoreImage(): void {
        this.imagePreview = this.originalImageUrl;
        this.uploadedFile = null;
        this.form.patchValue({ imageFile: this.originalImageUrl });
        this.imageRemoved = false;
        this.originalImageUrl = null;
        this.cdr.markForCheck();
    }

    openPreview(type: 'image' | 'video'): void {
        this.previewType = type;
        if (type === 'image') {
            this.previewContent = this.imagePreview;
        } else if (type === 'video') {
            const videoUrl = this.form.get('videoUrl')?.value;
            if (videoUrl) {
                this.previewContent =
                    this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
            }
        }

        if (this.previewContent) {
            this.isPreviewVisible = true;
        }
    }

    onSubmit(): void {
        /* if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.showValidationErrors();
            return;
        } */

        const formData = this.prepareSubmitData();

        const submitObservable =
            this.isEditMode && this.currentId
                ? this.homeFacade.updateHome(this.currentId, formData)
                : this.homeFacade.createHome(formData);

        submitObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: this.isEditMode
                        ? 'Bloc mis à jour avec succès'
                        : 'Bloc créé avec succès',
                });
                this.onCancel();
            },
            error: (error) => {
                console.error('Erreur lors de la sauvegarde:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Une erreur est survenue lors de la sauvegarde',
                });
            },
        });
    }

    private showValidationErrors(): void {
        const errors = [];

        if (this.form.get('title')?.invalid) {
            errors.push('Titre: ' + this.getErrorMessage('title'));
        }
        if (this.form.get('resume')?.invalid) {
            errors.push('Résumé: ' + this.getErrorMessage('resume'));
        }
        if (this.form.get('content')?.invalid) {
            errors.push('Contenu: ' + this.getErrorMessage('content'));
        }
        if (this.form.get('buttonLabel')?.invalid) {
            errors.push(
                'Label du bouton: ' + this.getErrorMessage('buttonLabel')
            );
        }
        if (this.form.get('buttonUrl')?.invalid) {
            errors.push('URL du bouton: ' + this.getErrorMessage('buttonUrl'));
        }
        if (this.form.errors?.['buttonLabelWithoutUrl']) {
            errors.push(
                this.translate.instant('VALIDATION.BUTTON_LABEL_WITHOUT_URL')
            );
        }
        if (this.form.errors?.['buttonUrlWithoutLabel']) {
            errors.push(
                this.translate.instant('VALIDATION.BUTTON_URL_WITHOUT_LABEL')
            );
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

    private prepareSubmitData(): FormData {
        const formData = new FormData();
        const values = this.form.value;

        formData.append('title', values.title);
        formData.append('resume', values.resume);
        formData.append('content', values.content || '');
        formData.append('type', values.type);
        formData.append('order', values.order?.toString() || '0');
        formData.append('button_label', values.buttonLabel || '');
        formData.append('button_url', values.buttonUrl || '');
        formData.append('is_active', String(values.isActive));

        this.appendPlatformsData(formData, values.platforms);

        if (values.startDate) {
            formData.append(
                'start_date',
                (values.startDate as Date).toISOString()
            );
        }
        if (values.endDate) {
            formData.append('end_date', (values.endDate as Date).toISOString());
        }

        if (values.type === TypeMediaDto.VIDEO && values.videoUrl) {
            formData.append('video_url', values.videoUrl);
        } else if (values.type === TypeMediaDto.IMAGE && this.uploadedFile) {
            formData.append('image_file', this.uploadedFile);
        }

        return formData;
    }

    private appendPlatformsData(formData: FormData, platforms: any[]): void {
        let platformArray = platforms;
        if (
            Array.isArray(platformArray) &&
            platformArray.length > 0 &&
            typeof platformArray[0] === 'object'
        ) {
            platformArray = platformArray.map((p: any) => p.id || p.value || p);
        }
        formData.append(
            'platforms',
            JSON.stringify(platformArray).toLowerCase()
        );
    }

    onCancel(): void {
        this.router.navigate([CONTENT_MANAGEMENT_ROUTE + '/' + HOME_ROUTE]);
    }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NEWS_ROUTE } from '@presentation/pages/content-management/content-management.routes';
import { NewsFacade } from '@presentation/pages/content-management/core/application/services/news.facade';
import { CategoryEntity } from '@presentation/pages/content-management/core/domain/entities/category.entity';
import { GetNewsByIdEntity } from '@presentation/pages/content-management/core/domain/entities/get-news-by-id.entity';
import { SubCategoryEntity } from '@presentation/pages/content-management/core/domain/entities/sub-category.entity';
import { ImageProcessingStore } from '@presentation/pages/content-management/core/domain/stores/image-processing.store';
import {
    ProcessingResult
} from '@presentation/pages/content-management/core/domain/types/image-processing.types';
import { ImageCropperComponent } from '@presentation/pages/content-management/presentation/shared/image-cropper/image-cropper.component';
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
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';
import { HashtagsInputComponent } from '../hashtags-input/hashtags-input.component';

const VALIDATION_CONSTANTS = {
    TITLE: {
        MIN: 3,
        MAX: 100,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*\/=°§]{3,}$/
    },
    RESUME: {
        MIN: 10,
        MAX: 250,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*\/=°§]{10,}$/
    },
    CONTENT: {
        MIN: 20,
        MAX: 2000,
        STRIP_HTML_MAX: 1000
    },
    BUTTON_LABEL: {
        MIN: 1,
        MAX: 30,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*\/=°§]{1,}$/
    },
    TIME_DURATION_IN_SECONDS: {
        MIN: 1,
        MAX: 10,
        STEP: 1
    },
    BUTTON_URL: {
        MAX: 500,
        PATTERN: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
    },
    VIDEO_URL: {
        MAX: 500,
        PATTERNS: {
            YOUTUBE: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
            VIMEO: /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/,
            DAILYMOTION: /^(https?:\/\/)?(www\.)?dailymotion\.com\/.+$/,
            GENERIC: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/
        }
    },

    IMAGE_FILE: {
        MAX_SIZE_MB: 2,
        ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        MAX_DIMENSIONS: {
            WIDTH: 1920,
            HEIGHT: 1080
        }
    }
};

@Component({
    selector: 'app-form-news',
    templateUrl: './form-news.component.html',
    styleUrls: ['./form-news.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        HashtagsInputComponent,
        ImageCropperComponent,
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
        ToastModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService]
})
export class FormNewsComponent implements OnInit {

    private readonly imageStore = inject(ImageProcessingStore);
    private readonly destroyRef = inject(DestroyRef);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly newsFacade = inject(NewsFacade);
    private readonly translate = inject(TranslateService);
    private readonly titleService = inject(Title);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly messageService = inject(MessageService);

    public readonly VALIDATION = VALIDATION_CONSTANTS;

    public categoriesOptions$: Observable<CategoryEntity[]> = this.newsFacade.getCategory();
    public isLoading$: Observable<boolean> = this.newsFacade.isLoading$;
    public selectedCategoryId$ = new BehaviorSubject<number | null>(null);
    public subCategoriesOptions$: Observable<SubCategoryEntity[]> = this.selectedCategoryId$.pipe(
        switchMap(categoryId => {
            if (!categoryId) {
                return of([]);
            }
            return this.categoriesOptions$.pipe(
                map(categories => {
                    const selectedCategory = categories.find(cat => cat.id === categoryId);
                    return selectedCategory ? selectedCategory.subCategories : [];
                })
            );
        })
    );
    public module = signal<string>('');
    public subModule = signal<string>('');
    public isEditMode = signal<boolean>(false);
    public currentId = signal<string | undefined>(undefined);
    public imagePreview = signal<string | null>(null);
    public uploadedFile = signal<File | null>(null);
    public imageRemoved = signal<boolean>(false);
    public originalImageUrl = signal<string | null>(null);
    public isPreviewVisible = signal<boolean>(false);
    public previewType = signal<'image' | 'video'>('image');
    public previewContent = signal<SafeUrl | string | null>(null);

    // Image Cropper Signals
    public showCropDialog = signal<boolean>(false);
    public imageForCropping = signal<string | null>(null);
    public selectedFileForCropping = signal<File | null>(null);

    public pageTitle$!: Observable<string>;

    public form!: FormGroup;

    public currentType$ = new BehaviorSubject<TypeMediaDto>(TypeMediaDto.IMAGE);
    public isVideoType$ = this.currentType$.pipe(
        map(type => type === TypeMediaDto.VIDEO)
    );
    public TypeMediaDto = TypeMediaDto;

    public typeOptions = [
        { label: 'Image', value: TypeMediaDto.IMAGE },
        { label: 'Video', value: TypeMediaDto.VIDEO }
    ];

    public platformOptions: any[] = [
        { label: 'Web', value: 'web' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'PWA', value: 'pwa' }
    ];

    public availableHashtags: string[] = ['#Informatique', '#Actualité', '#Innovation', '#Technologie'];

    ngOnInit(): void {
        this.initForm();
        this.setupRouteData();
        this.checkEditMode();
    }

    private initForm(): void {
        this.form = this.fb.group({
            title: ['', [
                Validators.required,
                Validators.minLength(VALIDATION_CONSTANTS.TITLE.MIN),
                Validators.maxLength(VALIDATION_CONSTANTS.TITLE.MAX),
                Validators.pattern(VALIDATION_CONSTANTS.TITLE.PATTERN)
            ]],
            resume: ['', [
                Validators.required,
                Validators.minLength(VALIDATION_CONSTANTS.RESUME.MIN),
                Validators.maxLength(VALIDATION_CONSTANTS.RESUME.MAX),
                Validators.pattern(VALIDATION_CONSTANTS.RESUME.PATTERN)
            ]],
            content: ['', [
                Validators.required,
                Validators.minLength(VALIDATION_CONSTANTS.CONTENT.MIN),
                this.htmlContentMaxLengthValidator(VALIDATION_CONSTANTS.CONTENT.STRIP_HTML_MAX)
            ]],
            type: [TypeMediaDto.IMAGE, Validators.required],
            videoUrl: [''],
            imageFile: [null, [Validators.required]],

            categoryId: [null, Validators.required],
            subCategoryId: [null],
            hashtags: this.fb.array<string>([]),
        }, { validators: this.buttonFieldsConsistencyValidator() });

        this.currentType$.next(TypeMediaDto.IMAGE);
        this.setupFormListeners();
    }

    public getFileSizeStatus(fileSize: number): string {
        const maxSize = VALIDATION_CONSTANTS.IMAGE_FILE.MAX_SIZE_MB * 1024 * 1024;
        const sizeInMB = fileSize / 1024 / 1024;

        if (sizeInMB > VALIDATION_CONSTANTS.IMAGE_FILE.MAX_SIZE_MB * 0.9) {
            return `⚠️ ${sizeInMB.toFixed(2)}/${VALIDATION_CONSTANTS.IMAGE_FILE.MAX_SIZE_MB} MB (presque plein)`;
        }

        return `${sizeInMB.toFixed(2)}/${VALIDATION_CONSTANTS.IMAGE_FILE.MAX_SIZE_MB} MB`;
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
                        maxAllowed: maxLength
                    }
                };
            }

            return null;
        };
    }

    public get allowedImageTypes(): string {
        return VALIDATION_CONSTANTS.IMAGE_FILE.ALLOWED_TYPES.map(t => t.split('/')[1].toUpperCase()).join(', ');
    }

    private buttonFieldsConsistencyValidator(): any {
        return (group: FormGroup) => {
            const buttonLabel = group.get('buttonLabel')?.value;
            const buttonUrl = group.get('buttonUrl')?.value;

            if (buttonLabel && buttonLabel.trim() && (!buttonUrl || !buttonUrl.trim())) {
                return { buttonLabelWithoutUrl: true };
            }

            if (buttonUrl && buttonUrl.trim() && (!buttonLabel || !buttonLabel.trim())) {
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
        const max = VALIDATION_CONSTANTS.CONTENT.STRIP_HTML_MAX;

        if (count > max * 0.9) return 'danger';
        if (count > max * 0.7) return 'warning';
        return 'safe';
    }

    public getErrorMessage(fieldName: string): string {
        const control = this.form.get(fieldName);
        if (!control || !control.errors) return '';

        const errors = control.errors;

        if (errors['min'] && fieldName === 'timeDurationInSeconds') {
            return `${this.translate.instant('CONTENT_MANAGEMENT.NEWS.FORM.VALIDATION.MIN_VALUE')}: ${errors['min'].min}`;
        }

        if (errors['max'] && fieldName === 'timeDurationInSeconds') {
            return `${this.translate.instant('CONTENT_MANAGEMENT.NEWS.FORM.VALIDATION.MAX_VALUE')}: ${errors['max'].max}`;
        }

        if (errors['minlength']) {
            return `${this.translate.instant('CONTENT_MANAGEMENT.NEWS.FORM.VALIDATION.MIN_LENGTH')}: ${errors['minlength'].requiredLength}`;
        }

        if (errors['maxlength']) {
            return `${this.translate.instant('CONTENT_MANAGEMENT.NEWS.FORM.VALIDATION.MAX_LENGTH')}: ${errors['maxlength'].requiredLength}`;
        }

        if (errors['pattern']) {
            return this.translate.instant('CONTENT_MANAGEMENT.NEWS.FORM.VALIDATION.INVALID_FORMAT');
        }

        if (errors['htmlMaxLength']) {
            return `${this.translate.instant('CONTENT_MANAGEMENT.NEWS.FORM.VALIDATION.CONTENT_TOO_LONG')}: ${errors['htmlMaxLength'].actual}/${errors['htmlMaxLength'].maxAllowed}`;
        }

        if (errors['buttonLabelWithoutUrl']) {
            return this.translate.instant('CONTENT_MANAGEMENT.NEWS.FORM.VALIDATION.BUTTON_LABEL_WITHOUT_URL');
        }

        if (errors['buttonUrlWithoutLabel']) {
            return this.translate.instant('CONTENT_MANAGEMENT.NEWS.FORM.VALIDATION.BUTTON_URL_WITHOUT_LABEL');
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
                    maxSize: VALIDATION_CONSTANTS.IMAGE_FILE.MAX_SIZE_MB
                });
            }
            if (errors['imageDimensions']) {
                return this.translate.instant('VALIDATION.IMAGE_DIMENSIONS_TOO_LARGE', {
                    maxWidth: VALIDATION_CONSTANTS.IMAGE_FILE.MAX_DIMENSIONS.WIDTH,
                    maxHeight: VALIDATION_CONSTANTS.IMAGE_FILE.MAX_DIMENSIONS.HEIGHT
                });
            }
        }


        return this.translate.instant('CONTENT_MANAGEMENT.NEWS.FORM.VALIDATION.INVALID_INPUT');
    }

    private setupFormListeners(): void {
        this.form.get('type')?.valueChanges.pipe(
            distinctUntilChanged(),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((type: TypeMediaDto) => {
            this.currentType$.next(type);
            this.updateMediaFieldsBasedOnType(type);
        });

        this.form.get('categoryId')?.valueChanges.pipe(
            distinctUntilChanged(),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((categoryId: number | null) => {
            if (this.form.get('subCategoryId')?.value) {
                this.form.get('subCategoryId')?.setValue(null, { emitEvent: false });
            }
            this.selectedCategoryId$.next(categoryId);
        });

        this.form.get('videoUrl')?.valueChanges.pipe(
            distinctUntilChanged(),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((url: string) => {
            if (url && this.currentType$.value === TypeMediaDto.VIDEO) {
                this.validateVideoUrl(url);
            }
        });

        combineLatest([
            this.form.statusChanges.pipe(startWith(this.form.status)),
            this.form.valueChanges.pipe(startWith(this.form.value))
        ]).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(() => {
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

            this.uploadedFile.set(null);
            this.imagePreview.set(null);
            this.imageRemoved.set(false);
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

        const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com)\/.+$/;

        if (!urlPattern.test(url)) {
            this.form.get('videoUrl')?.setErrors({ invalidVideoUrl: true });
        }
    }

    private validateImageFile(file: File): void {
        const imageControl = this.form.get('imageFile');

        if (!VALIDATION_CONSTANTS.IMAGE_FILE.ALLOWED_TYPES.includes(file.type)) {
            imageControl?.setErrors({ invalidImageType: true });
            return;
        }

        if (file.size > VALIDATION_CONSTANTS.IMAGE_FILE.MAX_SIZE_MB * 1000000) {
            imageControl?.setErrors({
                fileTooLarge: {
                    maxSize: VALIDATION_CONSTANTS.IMAGE_FILE.MAX_SIZE_MB,
                    actualSize: file.size
                }
            });
            return;
        }

        this.checkImageDimensions(file).then(dimensions => {
            if (dimensions.width > VALIDATION_CONSTANTS.IMAGE_FILE.MAX_DIMENSIONS.WIDTH ||
                dimensions.height > VALIDATION_CONSTANTS.IMAGE_FILE.MAX_DIMENSIONS.HEIGHT) {
                imageControl?.setErrors({ imageDimensions: true });
            }
        });

        imageControl?.setErrors(null);
    }

    public removeImage(): void {
        this.uploadedFile.set(null);
        this.imagePreview.set(null);
        this.form.patchValue({ imageFile: null });
        this.form.get('imageFile')?.markAsTouched();
        this.cdr.markForCheck();
    }

    private checkImageDimensions(file: File): Promise<{ width: number, height: number }> {
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
            map(data => data['title'] || 'CONTENT_MANAGEMENT.NEWS.LABEL')
        );

        this.route.data.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(data => {
            this.module.set(data['module'] || 'CONTENT_MANAGEMENT.LABEL');
            this.subModule.set(data['subModule'] || 'CONTENT_MANAGEMENT.NEWS.TITLE');
            this.titleService.setTitle(data['title'] ? this.translate.instant(data['title']) : 'CMZ');
        });
    }

    private checkEditMode(): void {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.isEditMode.set(true);
            this.currentId.set(id);
            this.loadNewsForEdit(id);
        }
    }

    private loadNewsForEdit(id: string): void {
        this.newsFacade.getNewsById(id).pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (item) => {
                this.patchForm(item);
            }
        });
    }

    private patchForm(item: GetNewsByIdEntity): void {
        const formData = {
            title: item.title,
            resume: item.resume,
            content: item.content,
            type: item.type,
            videoUrl: item.videoUrl || null,
            imageFile: item.imageFile || null,
            categoryId: item.categoryId || null,
            subCategoryId: item.subCategoryId || null,
            hashtags: item.hashtags || []
        };

        if (item.hashtags && Array.isArray(item.hashtags)) {
            while (this.hashtagsArray.length) {
                this.hashtagsArray.removeAt(0);
            }
            item.hashtags.forEach(hashtag => {
                this.onHashtagAdded(hashtag);
            });
        }

        if (item.type === TypeMediaDto.IMAGE && item.imageFile) {
            this.imagePreview.set(item.imageFile);
        }

        this.form.patchValue(formData, { emitEvent: false });

        this.currentType$.next(item.type);
        this.updateMediaFieldsBasedOnType(item.type);
        if (item.categoryId) {
            this.selectedCategoryId$.next(item.categoryId);
        }

        this.cdr.markForCheck();
    }

    onFileSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            const file = event.files[0];
            this.imageRemoved.set(false);

            this.validateImageFile(file);

            this.uploadedFile.set(file);
            this.form.patchValue({ imageFile: file });

            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.imagePreview.set(e.target.result);
                this.imageRemoved.set(false);
                /* this.imageForCropping.set(e.target.result);
                this.selectedFileForCropping.set(file);
                this.showCropDialog.set(true); */
                this.cdr.markForCheck();
            };
            reader.readAsDataURL(file);
        }
    }

    onCropComplete(result: ProcessingResult): void {
        const newFile = new File(
            [result.blob],
            `cropped_${this.selectedFileForCropping()?.name}`,
            { type: result.blob.type }
        );

        this.uploadedFile.set(newFile);
        this.form.patchValue({ imageFile: newFile });

        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.imagePreview.set(e.target.result);
            this.cdr.markForCheck();
        };
        reader.readAsDataURL(newFile);

        const compression = result.metadata.compressionRatio.toFixed(1);
        this.messageService.add({
            severity: 'success',
            summary: 'Image optimisée',
            detail: `Réduction de ${compression}%`,
            life: 3000
        });
    }

    // Gérer les erreurs
    onCropError(error: Error): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur de traitement',
            detail: error.message,
            life: 5000
        });
    }

    restoreImage(): void {
        this.imagePreview.set(this.originalImageUrl());
        this.uploadedFile.set(null);
        this.form.patchValue({ imageFile: this.originalImageUrl() });
        this.imageRemoved.set(false);
        this.originalImageUrl.set(null);
        this.cdr.markForCheck();
    }

    openPreview(type: 'image' | 'video'): void {
        this.previewType.set(type);

        if (type === 'image') {
            this.previewContent.set(this.imagePreview());
        } else if (type === 'video') {
            const videoUrl = this.form.get('videoUrl')?.value;
            if (videoUrl) {
                this.previewContent.set(this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl));
            }
        }

        if (this.previewContent()) {
            this.isPreviewVisible.set(true);
        }
    }

    private hashtagsArrayValidator(): ValidatorFn {
        return (control: AbstractControl) => {
            const array = control as FormArray;

            if (array.length === 0) {
                return { required: true };
            }

            if (array.length > 10) {
                return { maxHashtags: { max: 10, actual: array.length } };
            }

            const values = array.value as string[];
            const uniqueValues = new Set(values.map(v => v.toLowerCase()));

            if (uniqueValues.size !== values.length) {
                return { duplicateHashtags: true };
            }

            return null;
        };
    }

    get hashtagsArray(): FormArray {
        return this.form.get('hashtags') as FormArray;
    }

    public onHashtagsChanged(hashtags: string[]): void {
        console.log('Hashtags changés:', hashtags);
    }

    public onHashtagAdded(value: string): void {
        if (!value?.trim()) return;
        const formattedValue = value.startsWith('#') ? value : `#${value}`;

        this.hashtagsArray.push(this.fb.control(formattedValue, [
            Validators.required]));

        this.cdr.markForCheck();
    }

    public onHashtagRemoved(index: number): void {
        this.hashtagsArray.removeAt(index);
        this.hashtagsArray.updateValueAndValidity();
        this.cdr.markForCheck();
    }

    public onHashtagsCleared(): void {
        this.hashtagsArray.clear();
        this.hashtagsArray.updateValueAndValidity();
        this.cdr.markForCheck();
    }

    onSubmit(): void {
        /* if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.showValidationErrors();
            return;
        } */

        const formData = this.prepareSubmitData();

        const submitObservable = this.isEditMode() && this.currentId()
            ? this.newsFacade.updateNews(this.currentId()!, formData)
            : this.newsFacade.createNews(formData);

        submitObservable.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: this.isEditMode() ? 'News mise à jour avec succès' : 'News créée avec succès'
                });
                this.onCancel();
            },
            error: (error) => {
                console.error('Erreur lors de la sauvegarde:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Une erreur est survenue lors de la sauvegarde'
                });
            }
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
            errors.push('Label du bouton: ' + this.getErrorMessage('buttonLabel'));
        }
        if (this.form.get('buttonUrl')?.invalid) {
            errors.push('URL du bouton: ' + this.getErrorMessage('buttonUrl'));
        }
        if (this.form.errors?.['buttonLabelWithoutUrl']) {
            errors.push(this.translate.instant('VALIDATION.BUTTON_LABEL_WITHOUT_URL'));
        }
        if (this.form.errors?.['buttonUrlWithoutLabel']) {
            errors.push(this.translate.instant('VALIDATION.BUTTON_URL_WITHOUT_LABEL'));
        }

        if (errors.length > 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreurs de validation',
                detail: errors.join('\n'),
                life: 5000
            });
        }
    }

    private prepareSubmitData(): FormData {
        const values = this.form.getRawValue();
        const formData = new FormData();

        formData.append('title', values.title);
        formData.append('resume', values.resume);
        formData.append('content', values.content || '');
        formData.append('type', values.type);
        formData.append('category_id', values.categoryId?.toString() || '');

        if (values.subCategoryId) {
            formData.append('sub_category_id', values.subCategoryId.toString());
        }

        formData.append('hashtags', JSON.stringify(this.hashtagsArray.value || []));

        if (values.type === TypeMediaDto.VIDEO && values.videoUrl) {
            formData.append('video_url', values.videoUrl);
        } else if (values.type === TypeMediaDto.IMAGE && this.uploadedFile()) {
            formData.append('image_file', this.uploadedFile()!);
        } else if (values.type === TypeMediaDto.IMAGE && values.imageFile) {
            formData.append('image_file_url', values.imageFile);
        }

        return formData;
    }

    onCancel(): void {
        this.router.navigate([CONTENT_MANAGEMENT_ROUTE + '/' + NEWS_ROUTE]);
    }
}
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NEWS_ROUTE } from '@presentation/pages/content-management/content-management.routes';
import { NewsFacade } from '@presentation/pages/content-management/core/application/services/news.facade';
import { CategoryEntity } from '@presentation/pages/content-management/core/domain/entities/category.entity';
import { NewsEntity } from '@presentation/pages/content-management/core/domain/entities/news.entity';
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
import { Observable, Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';

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
export class FormNewsComponent implements OnInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly newsFacade = inject(NewsFacade);
    private readonly translate = inject(TranslateService);
    private readonly titleService = inject(Title);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly messageService = inject(MessageService);

    public pageTitle$!: Observable<string>;
    public module!: string;
    public subModule!: string;

    public form!: FormGroup;
    public isEditMode = false;
    public currentId?: string;

    public isVideoType = false;

    public typeOptions = [
        { label: 'Image', value: TypeMediaDto.IMAGE },
        { label: 'Video', value: TypeMediaDto.VIDEO }
    ];

    public platformOptions: any[] = [
        { label: 'Web', value: 'web' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'PWA', value: 'pwa' }
    ];

    public categoryOptions: Array<{ label: string; value: number }> = [];
    public subCategoryOptions: Array<{ label: string; value: number }> = [];
    public categories: CategoryEntity[] = [];
    public availableHashtags: string[] = ['#Informatique', '#Actualité', '#Innovation', '#Technologie'];

    // Fichiers uploadés
    public uploadedFile: File | null = null;
    public uploadedVideoFile: File | null = null;

    // Prévisualisations
    public imagePreview: string | null = null;
    public videoPreview: SafeUrl | string | null = null;

    // Original URLs (pour restauration)
    public originalImageUrl: string | null = null;
    public originalVideoUrl: string | null = null;

    // État suppression
    public imageRemoved = false;
    public videoRemoved = false;

    // Dialog prévisualisation
    public isPreviewVisible = false;
    public previewType: 'image' | 'video' = 'image';
    public previewContent: SafeUrl | string | null = null;

    public isFormValid = false;
    public saveButtonState = {
        disabled: true,
        tooltip: '',
        severity: 'danger' as 'success' | 'warning' | 'danger' | 'info'
    }

    ngOnInit(): void {
        this.initForm();
        this.setupRouteData();
        this.setupTypeListener();
        this.setupCategoryListener();
        this.checkEditMode();
        this.loadCategories();
        this.setupFormValidation();
    }

    private initForm(): void {
        this.form = this.fb.group({
            title: ['', Validators.required],
            resume: ['', Validators.required],
            content: [''],
            type: [TypeMediaDto.IMAGE, Validators.required],
            categoryId: ['', Validators.required],
            subCategoryId: [null],
            hashtags: [[], Validators.required],
            videoUrl: [''],
            isActive: [true],
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
        const isMediaValid = this.validateMediaSilent();

        this.isFormValid = isFormValid && isMediaValid;
        this.cdr.detectChanges();
    }

    private updateSaveButtonState(): void {
        const isFormValid = this.form.valid;
        const isMediaValid = this.validateMediaSilent();
        const isPristine = this.form.pristine && !this.uploadedFile && !this.uploadedVideoFile;

        if (!isFormValid || !isMediaValid) {
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

        // Vérifier les erreurs de formulaire
        Object.keys(this.form.controls).forEach(key => {
            const control = this.form.get(key);
            if (control?.invalid && control?.touched) {
                const fieldLabel = this.getFieldLabel(key);
                const errorMessage = this.getControlErrorMessage(control);
                errors.push(`• ${fieldLabel}: ${errorMessage}`);
            }
        });

        // Vérifier les erreurs de média
        if (!this.validateMediaSilent()) {
            const mediaType = this.isVideoType ?
                this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.VIDEO') :
                this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.IMAGE');
            errors.push(`• ${mediaType}: ${this.translate.instant('COMMON.VALIDATION.REQUIRED')}`);
        }

        return errors.join('\n');
    }

    // Ajoutez cette méthode publique (utilisée dans le template)
    public getFormErrors(): string[] {
        const errors: string[] = [];

        // Vérifier les erreurs de formulaire
        Object.keys(this.form.controls).forEach(key => {
            const control = this.form.get(key);
            if (control?.invalid && control?.touched) {
                const fieldLabel = this.getFieldLabel(key);
                const errorMessage = this.getControlErrorMessage(control);
                errors.push(`${fieldLabel}: ${errorMessage}`);
            }
        });

        // Vérifier les erreurs de média
        if (!this.validateMediaSilent()) {
            const mediaType = this.isVideoType ?
                this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.VIDEO') :
                this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.IMAGE');
            errors.push(`${mediaType}: ${this.translate.instant('COMMON.VALIDATION.REQUIRED')}`);
        }

        return errors;
    }

    // Méthodes helpers privées
    private getFieldLabel(fieldName: string): string {
        const labels: { [key: string]: string } = {
            title: this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.TITLE'),
            resume: this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.RESUME'),
            content: this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.DESCRIPTION'),
            type: this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.TYPE'),
            videoUrl: this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.VIDEO_URL'),
            buttonLabel: this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.BUTTON_LABEL'),
            buttonUrl: this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.BUTTON_URL'),
            platforms: this.translate.instant('CONTENT_MANAGEMENT.HOME.FORM.PLATFORMS')
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

    // Validation silencieuse (sans message d'erreur)
    private validateMediaSilent(): boolean {
        if (this.isVideoType) {
            const hasNewVideo = !!this.uploadedVideoFile;
            const hasVideoUrl = !!this.form.get('videoUrl')?.value?.trim();
            const hasOriginalVideo = !!this.originalVideoUrl && !this.videoRemoved;

            return hasNewVideo || hasVideoUrl || hasOriginalVideo;
        } else {
            const hasNewImage = !!this.uploadedFile;
            const hasOriginalImage = !!this.originalImageUrl && !this.imageRemoved;

            return hasNewImage || hasOriginalImage;
        }
    }

    private setupCategoryListener(): void {
        this.form.get('categoryId')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((categoryId: number) => {
                this.updateSubCategories(categoryId);
            });
    }

    private loadCategories(): void {
        this.newsFacade.getCategory().pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (categories) => {
                this.categories = categories;
                this.categoryOptions = categories.map(category => ({
                    label: category.name,
                    value: category.id
                }));
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Erreur lors du chargement des catégories:', error);
            }
        });
    }

    private updateSubCategories(categoryId: number): void {
        this.form.get('subCategoryId')?.setValue(null);

        const selectedCategory = this.categories.find(cat => cat.id === categoryId);

        if (selectedCategory && selectedCategory.subCategories.length > 0) {
            this.subCategoryOptions = selectedCategory.getSubCategoriesForSelect();
        } else {
            this.subCategoryOptions = [];
        }

        this.cdr.detectChanges();
    }

    private setupRouteData(): void {
        this.pageTitle$ = this.route.data.pipe(
            map(data => data['title'] || 'CONTENT_MANAGEMENT.NEWS.LABEL')
        );

        this.route.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.module = data['module'] || 'CONTENT_MANAGEMENT.LABEL';
            this.subModule = data['subModule'] || 'CONTENT_MANAGEMENT.NEWS.TITLE';
            this.titleService.setTitle(data['title'] ? this.translate.instant(data['title']) : 'CMZ');
        });
    }

    private setupTypeListener(): void {
        this.form.get('type')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value: TypeMediaDto) => {
                this.isVideoType = value === TypeMediaDto.VIDEO;
                this.updateValidatorsBasedOnType(value);
            });
    }

    private updateValidatorsBasedOnType(type: TypeMediaDto): void {
        const videoControl = this.form.get('videoUrl');

        // If type is video, we technically need a video. 
        // But since it can be either a new file upload OR an existing URL, validation is tricky.
        // We will validate on submit or assume logic:
        // If NO file AND NO existing URL => Invalid.

        if (type === TypeMediaDto.VIDEO) {
            // For now, removing strict "required" on control because we might use file upload instead.
            // We can check validity in onSubmit or custom validator.
            videoControl?.clearValidators();
        } else {
            videoControl?.clearValidators();
        }
        videoControl?.updateValueAndValidity();
    }

    private checkEditMode(): void {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.isEditMode = true;
            this.currentId = id;
            this.newsFacade.getNewsById(id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(item => {
                    this.patchForm(item);
                });
        }
    }

    private patchForm(item: NewsEntity): void {
        this.form.patchValue({
            title: item.title,
            resume: item.resume,
            content: item.content,
            type: item.type,
            categoryId: item.categoryId,
            subCategoryId: item.subCategoryId,
            hashtags: item.hashtags,
            videoUrl: item.videoUrl,
            isActive: item.status,
        });

        // Trigger type logic manually after patch
        this.isVideoType = item.type === TypeMediaDto.VIDEO;
        this.updateValidatorsBasedOnType(item.type);

        // Mettre à jour les sous-catégories basées sur la catégorie sélectionnée
        if (item.categoryId) {
            this.updateSubCategories(item.categoryId);
        }

        if (item.imageFile) {
            this.imagePreview = item.imageFile;
        }
        if (item.videoUrl) {
            this.videoPreview = item.videoUrl;
        }
    }

    onFileSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            this.uploadedFile = event.files[0];
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.imagePreview = e.target.result;
            };
            reader.readAsDataURL(this.uploadedFile as Blob);
        }
    }

    onVideoSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            this.uploadedVideoFile = event.files[0];
            // Create a local URL for preview
            const objectUrl = URL.createObjectURL(this.uploadedVideoFile as Blob);
            this.videoPreview = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        }
    }

    openPreview(type: 'image' | 'video'): void {
        this.previewType = type;
        if (type === 'image') {
            this.previewContent = this.imagePreview;
        } else {
            this.previewContent = this.videoPreview;
        }

        if (this.previewContent) {
            this.isPreviewVisible = true;
        }
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const formData = new FormData();
        const values = this.form.value;

        // Map form values to backend keys
        formData.append('title', values.title);
        formData.append('resume', values.resume);
        formData.append('content', values.content || '');
        formData.append('type', values.type);
        formData.append('category_id', values.categoryId?.toString() || '');
        if (values.subCategoryId) {
            formData.append('sub_category_id', values.subCategoryId.toString());
        }
        formData.append('hashtags', JSON.stringify(values.hashtags || []));
        formData.append('is_active', String(values.isActive));

        // Conditional appending
        if (this.isVideoType) {
            // Priority: New Video File > Existing Video URL
            if (this.uploadedVideoFile) {
                formData.append('video_file', this.uploadedVideoFile);
            } else if (values.videoUrl) {
                formData.append('video_url', values.videoUrl);
            }
        } else {
            if (this.uploadedFile) {
                formData.append('image_file', this.uploadedFile);
            }
        }

        if (this.isEditMode && this.currentId) {
            this.newsFacade.updateNews(this.currentId, formData).subscribe(() => {
                this.onCancel();
            });
        } else {
            this.newsFacade.createNews(formData).subscribe(() => {
                this.onCancel();
            });
        }
    }

    onCancel(): void {
        this.router.navigate([CONTENT_MANAGEMENT_ROUTE + '/' + NEWS_ROUTE]);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        // Revoke ObjectURL to prevent memory leaks if we created one
        if (this.videoPreview && typeof this.videoPreview === 'object') { // Check if it's SafeUrl wrapping a blob
            // Note: we can't easily extract the blob URL from SafeUrl to revoke it, 
            // but Angular handles cleanup reasonably well. 
            // Ideally we'd store the raw blob url too.
        }
    }
}






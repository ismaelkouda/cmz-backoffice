import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SLIDE_ROUTE } from '@presentation/pages/content-management/content-management.routes';
import { SlideFacade } from '@presentation/pages/content-management/core/application/services/slide.facade';
import { SlideEntity } from '@presentation/pages/content-management/core/domain/entities/slide.entity';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { TypeMediaDto } from '@shared/data/dtos/type-media.dto';
import { FileUploadI18nDirective } from '@shared/directives/file-upload-i18n.directive';
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
import { Observable, Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-form-slide',
    templateUrl: './form-slide.component.html',
    styleUrls: ['./form-slide.component.scss'],
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
        FileUploadI18nDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService]
})
export class FormSlideComponent implements OnInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    private readonly slideFacade = inject(SlideFacade);
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
        this.setupFormValidation();
        this.checkEditMode();
    }

    private initForm(): void {
        this.form = this.fb.group({
            title: ['', Validators.required],
            subtitle: ['', Validators.required],
            content: ['', Validators.required],
            type: [TypeMediaDto.IMAGE, Validators.required],
            videoUrl: [''],
            timeDurationInSeconds: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
            buttonLabel: ['', Validators.required],
            buttonUrl: ['', Validators.required],
            platforms: [[], Validators.required],
            startDate: [null],
            endDate: [null],
            isActive: [true]
        });
    }

    private setupFormValidation(): void {
        // Combiner validation form + validation média
        this.form.statusChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.updateFormValidity();
                this.updateSaveButtonState(); // ← AJOUTEZ CET APPEL
            });

        // Écouter les changements sur les médias
        this.form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.updateFormValidity();
                this.updateSaveButtonState(); // ← AJOUTEZ CET APPEL
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
                this.translate.instant('CONTENT_MANAGEMENT.SLIDE.FORM.VIDEO') :
                this.translate.instant('CONTENT_MANAGEMENT.SLIDE.FORM.IMAGE');
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
                this.translate.instant('CONTENT_MANAGEMENT.SLIDE.FORM.VIDEO') :
                this.translate.instant('CONTENT_MANAGEMENT.SLIDE.FORM.IMAGE');
            errors.push(`${mediaType}: ${this.translate.instant('COMMON.VALIDATION.REQUIRED')}`);
        }

        return errors;
    }

    // Méthodes helpers privées
    private getFieldLabel(fieldName: string): string {
        const labels: { [key: string]: string } = {
            title: this.translate.instant('CONTENT_MANAGEMENT.SLIDE.FORM.TITLE'),
            subtitle: this.translate.instant('CONTENT_MANAGEMENT.SLIDE.FORM.RESUME'),
            content: this.translate.instant('CONTENT_MANAGEMENT.SLIDE.FORM.DESCRIPTION'),
            type: this.translate.instant('CONTENT_MANAGEMENT.SLIDE.FORM.TYPE'),
            videoUrl: this.translate.instant('CONTENT_MANAGEMENT.SLIDE.FORM.VIDEO_URL'),
            timeDurationInSeconds: this.translate.instant('CONTENT_MANAGEMENT.SLIDE.FORM.DURATION'),
            buttonLabel: this.translate.instant('CONTENT_MANAGEMENT.SLIDE.FORM.BUTTON_LABEL'),
            buttonUrl: this.translate.instant('CONTENT_MANAGEMENT.SLIDE.FORM.BUTTON_URL'),
            platforms: this.translate.instant('CONTENT_MANAGEMENT.SLIDE.FORM.PLATFORMS')
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

    private setupRouteData(): void {
        this.pageTitle$ = this.route.data.pipe(
            map(data => data['title'] || 'CONTENT_MANAGEMENT.SLIDE.LABEL')
        );

        this.route.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.module = data['module'] || 'CONTENT_MANAGEMENT.LABEL';
            this.subModule = data['subModule'] || 'CONTENT_MANAGEMENT.SLIDE.TITLE';
            this.titleService.setTitle(data['title'] ? this.translate.instant(data['title']) : 'CMZ');
        });
    }

    private setupTypeListener(): void {
        this.form.get('type')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value: TypeMediaDto) => {
                this.isVideoType = value === TypeMediaDto.VIDEO;
                this.updateValidatorsBasedOnType(value);
                this.resetMediaOnTypeChange(value);
            });
    }

    private updateValidatorsBasedOnType(type: TypeMediaDto): void {
        const videoControl = this.form.get('videoUrl');
        if (type === TypeMediaDto.VIDEO) {
            videoControl?.clearValidators();
        } else {
            videoControl?.clearValidators();
        }
        videoControl?.updateValueAndValidity();
    }

    private resetMediaOnTypeChange(newType: TypeMediaDto): void {
        if (newType === TypeMediaDto.IMAGE) {
            // Si on passe de vidéo à image, reset les vidéos
            this.uploadedVideoFile = null;
            this.videoPreview = null;
            this.videoRemoved = false;
        } else {
            // Si on passe d'image à vidéo, reset les images
            this.uploadedFile = null;
            this.imagePreview = null;
            this.imageRemoved = false;
        }
        this.cdr.detectChanges();
    }

    private checkEditMode(): void {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.isEditMode = true;
            this.currentId = id;
            this.slideFacade.getSlideById(id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(item => {
                    console.log(item);
                    this.patchForm(item);
                });
        }
    }

    private patchForm(item: SlideEntity): void {
        this.form.patchValue({
            title: item.title,
            subtitle: item.subtitle,
            content: item.content,
            type: item.type,
            videoUrl: item.videoUrl,
            timeDurationInSeconds: item.timeDurationInSeconds,
            order: item.order,
            buttonLabel: item.buttonLabel,
            buttonUrl: item.buttonUrl,
            platforms: item.platforms,
            startDate: item.startDate ? new Date(item.startDate) : null,
            endDate: item.endDate ? new Date(item.endDate) : null,
            isActive: item.status
        });

        this.isVideoType = item.type === TypeMediaDto.VIDEO;
        this.updateValidatorsBasedOnType(item.type);

        // CORRECTION ICI : Utiliser image_url de l'API
        if (item.imageFile) {
            this.originalImageUrl = item.imageFile;
            this.imagePreview = item.imageFile;
        } else if (item.imageUrl) {
            this.originalImageUrl = item.imageUrl;
            this.imagePreview = item.imageUrl;
        } else {
            // Fallback: chercher dans l'objet directement
            const anyItem = item as any;
            if (anyItem.image_url) {
                this.originalImageUrl = anyItem.image_url;
                this.imagePreview = anyItem.image_url;
            }
        }

        // Pour la vidéo
        if (item.videoUrl) {
            this.originalVideoUrl = item.videoUrl;
            this.videoPreview = item.videoUrl;
        }

        this.cdr.detectChanges();
    }

    // ===== GESTION DES FICHIERS =====

    onFileSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            this.uploadedFile = event.files[0];
            this.imageRemoved = false; // Réactiver l'image

            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.imagePreview = e.target.result;
                this.cdr.detectChanges();
                this.showSuccessMessage('Image sélectionnée');
            };
            reader.readAsDataURL(this.uploadedFile as Blob);
        }
    }

    onVideoSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            this.uploadedVideoFile = event.files[0];
            this.videoRemoved = false; // Réactiver la vidéo

            // Créer une URL locale pour prévisualisation
            const objectUrl = URL.createObjectURL(this.uploadedVideoFile as Blob);
            this.videoPreview = this.sanitizer.bypassSecurityTrustUrl(objectUrl);

            this.cdr.detectChanges();
            this.showSuccessMessage('Vidéo sélectionnée');
        }
    }

    // ===== SUPPRESSION DES MÉDIAS =====

    removeImage(): void {
        if (this.isEditMode && this.originalImageUrl) {
            this.imageRemoved = true;
            this.imagePreview = null;
            this.uploadedFile = null;
            this.showWarnMessage('CONTENT_MANAGEMENT.SLIDE.MESSAGES.IMAGE_MARKED_FOR_DELETION');

        } else {
            this.imagePreview = null;
            this.uploadedFile = null;
            this.showInfoMessage('CONTENT_MANAGEMENT.SLIDE.MESSAGES.IMAGE_DELETED');
        }

        this.updateFormValidity();
        this.cdr.detectChanges();
    }


    removeVideo(): void {
        if (this.isEditMode && this.originalVideoUrl) {
            this.videoRemoved = true;
            this.videoPreview = null;
            this.uploadedVideoFile = null;
            this.form.get('videoUrl')?.setValue('');
            this.showWarnMessage('CONTENT_MANAGEMENT.SLIDE.MESSAGES.VIDEO_MARKED_FOR_DELETION');

        } else {
            this.videoPreview = null;
            this.uploadedVideoFile = null;
            this.form.get('videoUrl')?.setValue('');
            this.showInfoMessage('CONTENT_MANAGEMENT.SLIDE.MESSAGES.VIDEO_DELETED');
        }

        this.updateFormValidity();
        this.cdr.detectChanges();
    }

    restoreImage(): void {
        this.imageRemoved = false;
        this.imagePreview = this.originalImageUrl;
        this.showSuccessMessage('CONTENT_MANAGEMENT.SLIDE.MESSAGES.IMAGE_RESTORED');
        this.updateFormValidity();
        this.cdr.detectChanges();
    }

    restoreVideo(): void {
        this.videoRemoved = false;
        this.videoPreview = this.originalVideoUrl;
        this.showSuccessMessage('CONTENT_MANAGEMENT.SLIDE.MESSAGES.VIDEO_RESTORED');
        this.updateFormValidity();
        this.cdr.detectChanges();
    }

    // ===== PRÉVISUALISATION =====

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

    // ===== VALIDATION ET SOUMISSION =====

    private validateMedia(): { valid: boolean; message?: string } {
        if (this.isVideoType) {
            const hasNewVideo = !!this.uploadedVideoFile;
            const hasVideoUrl = !!this.form.get('videoUrl')?.value?.trim();
            const hasOriginalVideo = !!this.originalVideoUrl && !this.videoRemoved;

            if (!hasNewVideo && !hasVideoUrl && !hasOriginalVideo) {
                return {
                    valid: false,
                    message: 'CONTENT_MANAGEMENT.SLIDE.VALIDATION.VIDEO_REQUIRED'
                };
            }
        } else {
            const hasNewImage = !!this.uploadedFile;
            const hasOriginalImage = !!this.originalImageUrl && !this.imageRemoved;

            if (!hasNewImage && !hasOriginalImage) {
                return {
                    valid: false,
                    message: 'CONTENT_MANAGEMENT.SLIDE.VALIDATION.IMAGE_REQUIRED'
                };
            }
        }
        return { valid: true };
    }

    onSubmit(): void {
        // Valider le formulaire standard
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.showErrorMessage('COMMON.VALIDATION.FORM_ERRORS');
            return;
        }

        // Valider les médias avec message spécifique
        const mediaValidation = this.validateMedia();
        if (!mediaValidation.valid) {
            this.showErrorMessage(mediaValidation.message || 'COMMON.VALIDATION.MEDIA_REQUIRED');
            return;
        }

        // Créer FormData
        const formData = this.prepareFormData();

        if (this.isEditMode && this.currentId) {
            this.slideFacade.updateSlide(this.currentId, formData).subscribe({
                next: () => {
                    this.showSuccessMessage('CONTENT_MANAGEMENT.SLIDE.MESSAGES.UPDATE_SUCCESS');
                    this.onCancel();
                },
                error: (error) => {
                    console.error('Update error:', error);
                    this.showErrorMessage('CONTENT_MANAGEMENT.SLIDE.MESSAGES.UPDATE_ERROR');
                }
            });
        } else {
            this.slideFacade.createSlide(formData).subscribe({
                next: () => {
                    this.showSuccessMessage('CONTENT_MANAGEMENT.SLIDE.MESSAGES.CREATE_SUCCESS');
                    this.onCancel();
                },
                error: (error) => {
                    console.error('Create error:', error);
                    this.showErrorMessage('CONTENT_MANAGEMENT.SLIDE.MESSAGES.CREATE_ERROR');
                }
            });
        }
    }

    private prepareFormData(): FormData {
        const formData = new FormData();
        const values = this.form.value;

        // Données de base
        formData.append('title', values.title);
        formData.append('subtitle', values.subtitle);
        formData.append('content', values.content || '');
        formData.append('type', values.type);
        formData.append('time_duration_in_seconds', values.timeDurationInSeconds?.toString() || '0');
        formData.append('order', values.order?.toString() || '0');
        formData.append('button_label', values.buttonLabel);
        formData.append('button_url', values.buttonUrl);
        formData.append('is_active', String(values.isActive));

        // Gestion des médias
        this.appendMediaData(formData);

        // Plateformes
        this.appendPlatformsData(formData, values.platforms);

        // Dates
        if (values.startDate) {
            formData.append('start_date', (values.startDate as Date).toISOString());
        }
        if (values.endDate) {
            formData.append('end_date', (values.endDate as Date).toISOString());
        }

        return formData;
    }

    private appendMediaData(formData: FormData): void {
        if (this.isVideoType) {
            if (this.uploadedVideoFile) {
                formData.append('video_file', this.uploadedVideoFile);
            } else if (this.form.get('videoUrl')?.value?.trim()) {
                formData.append('video_url', this.form.get('videoUrl')?.value?.trim());
            } else if (this.videoRemoved) {
                formData.append('remove_video', 'true');
            }
        } else {
            if (this.uploadedFile) {
                formData.append('image_file', this.uploadedFile);
            } else if (this.imageRemoved) {
                formData.append('remove_image', 'true');
            }
        }
    }

    private appendPlatformsData(formData: FormData, platforms: any[]): void {
        let platformArray = platforms;
        if (Array.isArray(platformArray) && platformArray.length > 0 && typeof platformArray[0] === 'object') {
            platformArray = platformArray.map((p: any) => p.id || p.value || p);
        }
        formData.append('platforms', JSON.stringify(platformArray).toLowerCase());
    }



    // ===== MESSAGES TOAST =====

    private showSuccessMessage(message: string): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: this.translate.instant(message),
            life: 3000
        });
    }

    private showErrorMessage(message: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: this.translate.instant(message),
            life: 5000
        });
    }

    private showWarnMessage(message: string): void {
        this.messageService.add({
            severity: 'warn',
            summary: 'Attention',
            detail: this.translate.instant(message),
            life: 4000
        });
    }

    private showInfoMessage(message: string): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: this.translate.instant(message),
            life: 3000
        });
    }

    // ===== NAVIGATION =====

    onCancel(): void {
        this.router.navigate([CONTENT_MANAGEMENT_ROUTE + '/' + SLIDE_ROUTE]);
    }

    // ===== NETTOYAGE =====

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        // Nettoyer les URLs blob pour éviter les fuites mémoire
        if (this.videoPreview && typeof this.videoPreview === 'object') {
            // Angular gère le SafeUrl, mais si vous créez des URLs blob manuellement
            // Il faudrait les révoquer ici
        }
    }
}
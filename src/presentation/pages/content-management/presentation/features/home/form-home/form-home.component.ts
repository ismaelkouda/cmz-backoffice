import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HOME_ROUTE } from '@presentation/pages/content-management/content-management.routes';
import { HomeFacade } from '@presentation/pages/content-management/core/application/services/home.facade';
import { HomeEntity } from '@presentation/pages/content-management/core/domain/entities/home.entity';
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
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

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
        TooltipModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MessageService]
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

    public pageTitle$!: Observable<string>;
    public module!: string;
    public subModule!: string;

    public form!: FormGroup;
    public isEditMode = false;
    public currentId?: string;

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
        this.form = this.fb.group({
            title: ['', Validators.required],
            resume: ['', Validators.required],
            content: ['', Validators.required],
            type: [TypeMediaDto.IMAGE, Validators.required],
            videoUrl: [''],
            imageFile: [null, [Validators.required]],
            timeDurationInSeconds: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
            buttonLabel: [''],
            buttonUrl: [''],
            platforms: [[], Validators.required],
            startDate: [null],
            endDate: [null],
            isActive: [true]
        });

        this.currentType$.next(TypeMediaDto.IMAGE);
        this.setupFormListeners();
    }

    private setupFormListeners(): void {
        this.form.get('type')?.valueChanges.pipe(
            distinctUntilChanged(),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((type: TypeMediaDto) => {
            this.currentType$.next(type);
            this.updateMediaFieldsBasedOnType(type);
        });

        this.form.get('videoUrl')?.valueChanges.pipe(
            distinctUntilChanged(),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((url: string) => {
            if (url && this.currentType$.value === TypeMediaDto.VIDEO) {
                this.validateVideoUrl(url);
            }
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

        const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com)\/.+$/;

        if (!urlPattern.test(url)) {
            this.form.get('videoUrl')?.setErrors({ invalidVideoUrl: true });
        }
    }

    private setupRouteData(): void {
        this.pageTitle$ = this.route.data.pipe(
            map(data => data['title'] || 'CONTENT_MANAGEMENT.HOME.LABEL')
        );

        this.route.data.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(data => {
            this.module = data['module'] || 'CONTENT_MANAGEMENT.LABEL';
            this.subModule = data['subModule'] || 'CONTENT_MANAGEMENT.HOME.TITLE';
            this.titleService.setTitle(data['title'] ? this.translate.instant(data['title']) : 'CMZ');
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
        this.homeFacade.getHomeById(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(item => {
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
            imageFile: item.imageFile,
            timeDurationInSeconds: item.timeDurationInSeconds,
            order: item.order,
            buttonLabel: item.buttonLabel,
            buttonUrl: item.buttonUrl,
            platforms: item.platforms,
            startDate: item.startDate ? new Date(item.startDate) : null,
            endDate: item.endDate ? new Date(item.endDate) : null,
            isActive: item.status
        };

        if (item.type === TypeMediaDto.VIDEO) {
            formData.videoUrl = item.videoUrl || '';
            formData.imageFile = null;
        } else {
            formData.videoUrl = null;
            if (item.imageFile) {
                formData.imageFile = item.imageFile;
                this.imagePreview = item.imageFile;
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
                this.previewContent = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
            }
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

        const formData = this.prepareSubmitData();


        const submitObservable = this.isEditMode && this.currentId
            ? this.homeFacade.updateHome(this.currentId, formData)
            : this.homeFacade.createHome(formData);


        submitObservable.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: this.isEditMode ? 'News mise à jour avec succès' : 'News créée avec succès'
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

    private prepareSubmitData(): FormData {
        const formData = new FormData();
        const values = this.form.value;

        formData.append('title', values.title);
        formData.append('resume', values.resume);
        formData.append('content', values.content || '');
        formData.append('type', values.type);
        formData.append('time_duration_in_seconds', values.timeDurationInSeconds?.toString() || '0');
        formData.append('order', values.order?.toString() || '0');
        formData.append('button_label', values.buttonLabel);
        formData.append('button_url', values.buttonUrl);
        formData.append('is_active', String(values.isActive));

        this.appendPlatformsData(formData, values.platforms);

        if (values.startDate) {
            formData.append('start_date', (values.startDate as Date).toISOString());
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
        if (Array.isArray(platformArray) && platformArray.length > 0 && typeof platformArray[0] === 'object') {
            platformArray = platformArray.map((p: any) => p.id || p.value || p);
        }
        formData.append('platforms', JSON.stringify(platformArray).toLowerCase());
    }

    onCancel(): void {
        this.router.navigate([CONTENT_MANAGEMENT_ROUTE + '/' + HOME_ROUTE]);
    }
}
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
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, map, startWith } from 'rxjs';
import { HashtagsInputComponent } from '../hashtags-input/hashtags-input.component';

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

    public categoryOptions: Array<{ label: string; value: number }> = [];
    public subCategoryOptions: Array<{ label: string; value: number }> = [];
    public categories: CategoryEntity[] = [];
    public availableHashtags: string[] = ['#Informatique', '#Actualité', '#Innovation', '#Technologie'];


    ngOnInit(): void {
        this.initForm();
        this.setupRouteData();
        this.checkEditMode();
        this.loadCategories();
    }

    private initForm(): void {
        this.form = this.fb.group({
            title: ['', [Validators.required]],
            resume: ['', [Validators.required]],
            content: ['', Validators.required],
            type: [TypeMediaDto.IMAGE, Validators.required],
            categoryId: [null, Validators.required],
            subCategoryId: [null],
            hashtags: this.fb.array<string>([], this.hashtagsArrayValidator()),
            videoUrl: [null],
            imageFile: [null, [Validators.required]],
        });

        this.currentType$.next(TypeMediaDto.IMAGE);
        this.setupFormListeners();
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
            this.updateSubCategories(categoryId);
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

    private loadCategories(): void {
        this.newsFacade.getCategory().pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (categories) => {
                this.categories = categories;
                this.categoryOptions = categories.map(category => ({
                    label: category.name,
                    value: category.id
                }));
                this.cdr.markForCheck();
            },
            error: (error) => {
                console.error('Erreur lors du chargement des catégories:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger les catégories'
                });
            }
        });
    }

    private updateSubCategories(categoryId: number | null): void {
        this.form.get('subCategoryId')?.setValue(null, { emitEvent: false });

        if (!categoryId) {
            this.subCategoryOptions = [];
            this.cdr.markForCheck();
            return;
        }

        const selectedCategory = this.categories.find(cat => cat.id === categoryId);

        if (selectedCategory && selectedCategory.subCategories.length > 0) {
            this.subCategoryOptions = selectedCategory.getSubCategoriesForSelect();
        } else {
            this.subCategoryOptions = [];
        }

        this.cdr.markForCheck();
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

    private patchForm(item: NewsEntity): void {
        const formData = {
            title: item.title,
            resume: item.resume,
            content: item.content,
            type: item.type,
            videoUrl: item.videoUrl,
            imageFile: item.imageFile,
            categoryId: item.categoryId,
            subCategoryId: item.subCategoryId || null,
        };

        if (item.hashtags && Array.isArray(item.hashtags)) {
            this.hashtagsArray.clear();
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
            this.updateSubCategories(item.categoryId);
        }

        this.cdr.markForCheck();
    }

    onFileSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            const file = event.files[0];
            /* if (!file.type.startsWith('image/')) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Veuillez sélectionner une image valide'
                });
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'L\'image ne doit pas dépasser 2MB'
                });
                return;
            } */

            this.uploadedFile.set(file);
            this.form.patchValue({ imageFile: file });

            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.imagePreview.set(e.target.result);
                this.imageRemoved.set(false);
                this.cdr.markForCheck();
            };
            reader.readAsDataURL(file);
        }
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

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

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
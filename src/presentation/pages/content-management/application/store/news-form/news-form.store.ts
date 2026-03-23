import {
    Injectable,
    inject,
    signal,
    computed,
    effect,
    untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    AbstractControl,
    FormGroup,
    FormBuilder,
    FormControl,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { NewsCategoriesSelectFacade } from '@pages/content-management/application/services/news/news-categories-select.facade';
import { NewsFindOneFacade } from '@pages/content-management/application/services/news/news-find-one.facade';
import { NewsFormControl } from '@pages/content-management/domain/controls/news/news-form.control';
import { FormValidators } from '@pages/content-management/domain/validators/form-validators';
import { NewsSubCategoriesSelectProps } from '@presentation/pages/content-management/domain/interfaces/news/news-sub-categories-select.props.interface';
import { getEnumKeyByValue } from '@shared/components/filter/filter.types';
import { ImageUploadStateService } from '@shared/components/image-upload/domain/services/image-upload-state.service';
import { TypeMedia } from '@shared/domain/enums/type-media.enum';
import { MediaValue } from '@shared/domain/types/media.types';

export type CropperStatus = 'idle' | 'loading' | 'ready' | 'cropping' | 'error';
const VIDEO = getEnumKeyByValue(TypeMedia, TypeMedia.VIDEO) as string;
const IMAGE = getEnumKeyByValue(TypeMedia, TypeMedia.IMAGE) as string;

@Injectable()
export class NewsFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(NewsFindOneFacade);
    private readonly categoriesFacade = inject(NewsCategoriesSelectFacade);
    private readonly imageStore = inject(ImageUploadStateService);

    private readonly isPatching = signal(false);
    private readonly imageError = signal<string | null>(null);

    readonly form: FormGroup<NewsFormControl> = this.createForm();

    public readonly isEditMode = signal(false);
    readonly subCategories = signal<readonly NewsSubCategoriesSelectProps[]>(
        []
    );
    readonly loadingNewsSubCategories = signal<boolean>(false);
    readonly categories = toSignal(this.categoriesFacade.items$, {
        initialValue: [],
    });
    readonly loadingCategories = toSignal(this.categoriesFacade.isLoading$, {
        initialValue: false,
    });

    public readonly hashtagsArray = this.form.controls.hashtags;

    readonly typeControl = toSignal(this.form.controls.type.valueChanges, {
        initialValue: this.form.controls.type.value,
    });
    readonly categoryValue = toSignal(
        this.form.controls.category.valueChanges,
        {
            initialValue: this.form.controls.category.value,
        }
    );

    public readonly isVideoMode = computed(() => {
        const type = this.typeControl();
        return type === VIDEO;
    });
    public readonly isImageMode = computed(() => {
        const type = this.typeControl();
        return type === IMAGE;
    });
    readonly selectedCategory = computed(() => {
        if (this.isPatching()) {
            return undefined;
        }
        return this.categories().find((r) => r.value === this.categoryValue());
    });
    public readonly hashtagsErrors = computed(() => {
        const errors = this.hashtagsArray.errors;
        if (!errors) {
            return null;
        }

        return {
            minHashtags: errors['minHashtags'],
            maxHashtags: errors['maxHashtags'],
            duplicateHashtags: errors['duplicateHashtags'],
        };
    });
    public readonly hashtagsTouched = computed(
        () => this.hashtagsArray.touched
    );
    public readonly isImageReady = computed(() => {
        return this.imageStore.hasCroppedImage() || !!this.imageError();
    });
    public readonly imageErrorMessage = computed(() => this.imageError());

    private readonly item = this.facade.items;
    public readonly loading = this.facade.loading;

    private readonly typeMediaEffect = effect(() => {
        if (this.isPatching()) {
            return;
        }

        const type = this.typeControl();
        if (!type) {
            return;
        }

        untracked(() => {
            this.handleTypeChange(type);
        });
    });

    private handleTypeChange(type: string): void {
        this.resetMediaFields(type);
        this.updateValidatorsByType(type);
    }
    private readonly categoryEffect = effect(() => {
        if (this.isPatching()) {
            return;
        }
        const category = this.selectedCategory();
        this.loadingNewsSubCategories.set(true);
        if (category?.subCategories) {
            this.subCategories.set(category.subCategories);
            this.form.controls.subCategory.enable({ emitEvent: false });
            if (!this.form.controls.subCategory.value) {
                this.form.controls.subCategory.reset('', { emitEvent: false });
            }
        } else {
            this.subCategories.set([]);
            this.form.controls.subCategory.reset('', { emitEvent: false });
            this.form.controls.subCategory.disable({ emitEvent: false });
        }
        this.form.controls.subCategory.updateValueAndValidity({
            emitEvent: false,
        });
        this.loadingNewsSubCategories.set(false);
    });
    private readonly patchItemEffect = effect(() => {
        const item = this.item();
        if (!item) {
            return;
        }
        this.isPatching.set(true);
        this.form.patchValue(
            {
                type: item.type,
                video: item.video,
                title: item.title,
                resume: item.resume,
                content: item.content,
                category: item.category,
                subCategory: item.subCategory,
                hashtags: item.hashtags || [],
            },
            { emitEvent: false }
        );

        if (item.image) {
            this.handleExistingImage(item.image);
        } else {
            this.resetImage();
        }
        queueMicrotask(() => this.isPatching.set(false));
    });

    private async handleExistingImage(url: string): Promise<void> {
        try {
            const mediaValue: MediaValue = {
                type: 'remote',
                url: url,
            };

            this.form.controls.image.setValue(mediaValue, { emitEvent: false });
            await this.imageStore.hydrateExistingImage(url);

            if (!this.imageStore.hasCroppedImage()) {
                throw new Error(
                    'Image hydration failed - no preview available'
                );
            }

            this.imageError.set(null);
        } catch (error) {
            console.error('❌ Failed to handle existing image:', error);
            this.imageError.set('CONTENT_MANAGEMENT.NEWS.IMAGE_LOAD_ERROR');
            this.form.controls.image.setErrors({ imageLoadFailed: true });
        }
    }

    private createForm(): FormGroup<NewsFormControl> {
        return this.fb.nonNullable.group<NewsFormControl>(
            {
                type: new FormControl(IMAGE, {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
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
                image: new FormControl<MediaValue | null>(null, {
                    validators: [Validators.required],
                }),
                video: new FormControl('', {
                    nonNullable: true,
                }),
                category: new FormControl('', {
                    nonNullable: true,
                    validators: [Validators.required],
                }),
                subCategory: new FormControl(
                    { value: '', disabled: true },
                    { nonNullable: true }
                ),
                hashtags: new FormControl<string[]>([], {
                    nonNullable: true,
                    validators: [Validators.minLength(1)],
                }),
            },
            { validators: [this.typeMediaConsistencyValidator()] }
        );
    }

    private typeMediaConsistencyValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const type = control.get('type')?.value;
            const image = control.get('image')?.value;
            const video = control.get('video')?.value;

            if (type === IMAGE && !image) {
                return { imageRequired: true };
            }
            if (type === VIDEO && !video) {
                return { videoRequired: true };
            }
            return null;
        };
    }

    private updateValidatorsByType(type: string): void {
        const videoControl = this.form.controls.video;
        const imageControl = this.form.controls.image;
        const isVideo = type === VIDEO;
        const isImage = type === IMAGE;
        if (isVideo) {
            videoControl.setValidators([
                Validators.required,
                Validators.pattern(FormValidators.VIDEO.PATTERNS.GENERIC),
            ]);
        } else {
            videoControl.clearValidators();
        }
        if (isImage) {
            imageControl.setValidators([Validators.required]);
        } else {
            imageControl.clearValidators();
        }
        videoControl.updateValueAndValidity({ emitEvent: false });
        imageControl.updateValueAndValidity({ emitEvent: false });
    }

    public getSubmitValue(uniqId?: string): any {
        const raw = this.form.getRawValue();

        const basePayload = {
            ...raw,
            image: this.transformImageForApi(raw.image),
        };

        return uniqId ? { ...basePayload, uniqId } : basePayload;
    }

    private transformImageForApi(
        image: MediaValue | null
    ): string | File | null {
        if (!image) {
            return null;
        }

        return image.type === 'remote' ? image.url : image.file;
    }

    private resetMediaFields(type: string | undefined): void {
        if (!type) {
            return;
        }

        const resetMap: Record<string, () => void> = {
            [VIDEO]: () => {
                this.resetImage();
                this.resetImageStore();
            },
            [IMAGE]: () => {
                this.resetVideo();
            },
        };

        const resetAction = resetMap[type];
        if (resetAction) {
            resetAction();
        }
    }

    private htmlContentMaxLengthValidator(maxLength: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            const stripped = (control.value as string)
                .replaceAll(/<[^>]*>/g, '')
                .trim();
            if (stripped.length > maxLength) {
                return {
                    htmlMaxLength: {
                        actual: stripped.length,
                        maxAllowed: maxLength,
                    },
                };
            }
            return null;
        };
    }

    public onImageSelected(file: File): void {
        const mediaValue: MediaValue = {
            type: 'local',
            file: file,
        };

        this.form.controls.image.setValue(mediaValue);
        this.imageStore.openCropper(file);
        this.imageError.set(null);
    }
    public openCropperForExisting(): void {
        if (this.imageStore.hasCroppedImage()) {
            this.imageStore.openCropperWithExisting();
        }
    }
    public onCropConfirmed(blob: Blob): void {
        this.imageStore.confirmCrop(blob);
        const file = this.imageStore.getCurrentFile();
        if (file) {
            const mediaValue: MediaValue = {
                type: 'local',
                file: file,
            };

            this.form.controls.image.setValue(mediaValue);
            this.form.controls.image.markAsDirty();
            this.form.controls.image.markAsTouched();
            this.imageError.set(null);
        }
    }
    public onCropCancelled(): void {
        this.imageStore.abandonCrop();
    }
    public onImageCleared(): void {
        this.resetImage();
        this.form.controls.image.markAsTouched();
    }
    public getCurrentImageFile(): File | null {
        return this.imageStore.getCurrentFile();
    }
    public isImageAvailable(): boolean {
        return this.imageStore.hasCroppedImage();
    }

    private resetVideo(): void {
        this.form.controls.video.reset('', { emitEvent: false });
    }
    private resetImage(): void {
        this.form.controls.image.reset(null, { emitEvent: false });
        this.imageStore.resetImage();
        this.imageError.set(null);
    }

    private resetImageStore(): void {
        this.imageStore.resetImage();
    }

    public setEditMode(uniqId: string | null): void {
        this.isEditMode.set(!!uniqId);

        if (!uniqId) {
            this.form.reset();
            this.facade.reset();
            this.resetImageStore();
            this.imageError.set(null);
            this.form.controls.subCategory.disable({ emitEvent: false });
            return;
        }

        this.facade.read({ uniqId }, true);
        this.categoriesFacade.readAll();
    }

    public reset(): void {
        this.form.reset();
        this.facade.reset();
        this.resetImageStore();
        this.imageError.set(null);
        this.isEditMode.set(false);
        this.isPatching.set(false);
    }
}

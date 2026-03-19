import { Injectable, inject, signal, computed, effect } from '@angular/core';
import {
    AbstractControl,
    FormGroup,
    FormBuilder,
    FormControl,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { HomeFindOneFacade } from '@pages/content-management/application/services/home/home-find-one.facade';
import { HomeFormControl } from '@pages/content-management/domain/controls/home/home-form.control';
import { FormValidators } from '@pages/content-management/domain/validators/form-validators';
import { getEnumKeyByValue } from '@shared/components/filter/filter.types';
import { ImageUploadStateService } from '@shared/components/image-upload/domain/services/image-upload-state.service';
import { PLATFORM_ASPECT_RATIOS } from '@shared/components/image-upload/domain/types/image-upload.types';
import { Platform } from '@shared/domain/enums/platform.enum';
import { MediaValue } from '@shared/domain/types/media.types';

export type CropperStatus = 'idle' | 'loading' | 'ready' | 'cropping' | 'error';
const WEB = getEnumKeyByValue(Platform, Platform.WEB) as Platform;
const PWA = getEnumKeyByValue(Platform, Platform.PWA) as Platform;
const MOBILE = getEnumKeyByValue(Platform, Platform.MOBILE) as Platform;
@Injectable()
export class HomeFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(HomeFindOneFacade);
    private readonly imageStore = inject(ImageUploadStateService);

    private readonly isPatching = signal(false);
    private readonly imageError = signal<string | null>(null);

    readonly form: FormGroup<HomeFormControl> = this.createForm();

    public readonly isEditMode = signal(false);

    public readonly selectedPlatforms = computed(
        () => this.form.controls.platforms.value
    );
    public readonly activeCropAspectRatio = computed((): number => {
        const platforms = this.selectedPlatforms();
        if (!platforms?.length) {
            return PLATFORM_ASPECT_RATIOS[WEB];
        }

        const ratios = platforms.map((p) => PLATFORM_ASPECT_RATIOS[p]);
        const allSameRatio = ratios.every((r) => r === ratios[0]);

        if (allSameRatio) {
            return ratios[0];
        }

        if (platforms.includes(MOBILE)) {
            return PLATFORM_ASPECT_RATIOS[MOBILE];
        }
        if (platforms.includes(PWA)) {
            return PLATFORM_ASPECT_RATIOS[PWA];
        }
        return PLATFORM_ASPECT_RATIOS[WEB];
    });

    public readonly isImageReady = computed(() => {
        return this.imageStore.hasCroppedImage() || !!this.imageError();
    });

    public readonly imageErrorMessage = computed(() => this.imageError());

    private readonly item = this.facade.items;
    public readonly loading = this.facade.loading;

    private readonly patchItemEffect = effect(() => {
        const item = this.item();
        if (!item) {
            return;
        }
        this.isPatching.set(true);
        this.form.patchValue(
            {
                title: item.title,
                resume: item.resume,
                content: item.content,
                buttonLabel: item.buttonLabel,
                buttonUrl: item.buttonUrl,
                platforms: item.platforms,
                startDate: item.startDate,
                endDate: item.endDate,
            },
            { emitEvent: false }
        );
        if (item.image) {
            this.handleExistingImage(item.image);
        } else {
            this.form.controls.image.reset(null, { emitEvent: false });
            this.imageStore.resetImage();
            this.imageError.set(null);
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
            this.imageError.set('CONTENT_MANAGEMENT.HOME.IMAGE_LOAD_ERROR');
            this.form.controls.image.setErrors({ imageLoadFailed: true });
        }
    }

    private createForm(): FormGroup<HomeFormControl> {
        return this.fb.nonNullable.group<HomeFormControl>(
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
                image: new FormControl<MediaValue | null>(null, {
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
                startDate: new FormControl<Date | null>(null, {
                    nonNullable: true,
                }),
                endDate: new FormControl<Date | null>(null, {
                    nonNullable: true,
                }),
            },
            { validators: [this.buttonFieldsConsistencyValidator()] }
        );
    }

    private buttonFieldsConsistencyValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const label = control.get('buttonLabel')?.value?.trim() as string;
            const url = control.get('buttonUrl')?.value?.trim() as string;
            if (label && !url) {
                return { buttonLabelWithoutUrl: true };
            }
            if (url && !label) {
                return { buttonUrlWithoutLabel: true };
            }
            return null;
        };
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

    // ========== MÉTHODES PUBLIQUES POUR L'INTERACTION ==========
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
        this.form.controls.image.reset(null);
        this.imageStore.resetImage();
        this.form.controls.image.markAsTouched();
        this.imageError.set(null);
    }

    public getCurrentImageFile(): File | null {
        return this.imageStore.getCurrentFile();
    }

    public isImageAvailable(): boolean {
        return this.imageStore.hasCroppedImage();
    }

    public resetImage(): void {
        this.form.controls.image.reset(null, { emitEvent: false });
        this.imageStore.resetImage();
        this.imageError.set(null);
    }

    public setEditMode(uniqId: string | null): void {
        this.isEditMode.set(!!uniqId);

        if (!uniqId) {
            this.form.reset();
            this.facade.reset();
            this.imageStore.resetImage();
            this.imageError.set(null);
            return;
        }

        this.facade.read({ uniqId }, true);
    }

    public reset(): void {
        this.form.reset();
        this.facade.reset();
        this.imageStore.resetImage();
        this.imageError.set(null);
        this.isEditMode.set(false);
        this.isPatching.set(false);
    }
}

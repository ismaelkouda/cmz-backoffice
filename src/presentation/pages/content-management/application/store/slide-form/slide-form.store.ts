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
import { SlideFindOneFacade } from '@pages/content-management/application/services/slide/slide-find-one.facade';
import { SlideFormControl } from '@pages/content-management/domain/controls/slide/slide-form.control';
import { FormValidators } from '@pages/content-management/domain/validators/form-validators';
import { getEnumKeyByValue } from '@shared/components/filter/filter.types';
import { PLATFORM_ASPECT_RATIOS } from '@shared/components/image-upload/domain/types/image-upload.types';
import { Platform } from '@shared/domain/enums/platform.enum';
import { TypeMedia } from '@shared/domain/enums/type-media.enum';
import { MediaValue } from '@shared/domain/types/media.types';

export type CropperStatus = 'idle' | 'loading' | 'ready' | 'cropping' | 'error';
const VIDEO = getEnumKeyByValue(TypeMedia, TypeMedia.VIDEO) as string;
const IMAGE = getEnumKeyByValue(TypeMedia, TypeMedia.IMAGE) as string;
const WEB = getEnumKeyByValue(Platform, Platform.WEB) as Platform;
const PWA = getEnumKeyByValue(Platform, Platform.PWA) as Platform;
const MOBILE = getEnumKeyByValue(Platform, Platform.MOBILE) as Platform;

@Injectable()
export class SlideFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(SlideFindOneFacade);

    private readonly imageError = signal<string | null>(null);
    public readonly imageFile = signal<File | string | null>(null);

    readonly form: FormGroup<SlideFormControl> = this.createForm();

    public readonly isEditMode = signal(false);

    readonly typeControl = toSignal(this.form.controls.type.valueChanges, {
        initialValue: this.form.controls.type.value,
    });

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
    public readonly imageErrorMessage = computed(() => this.imageError());
    public readonly hasImage = computed(() => !!this.imageFile());

    public readonly isVideoMode = computed(() => {
        const type = this.typeControl();
        return type === VIDEO;
    });
    public readonly isImageMode = computed(() => {
        const type = this.typeControl();
        return type === IMAGE;
    });

    public readonly item = this.facade.items;
    public readonly loading = this.facade.loading;

    private readonly typeMediaEffect = effect(() => {
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

    private readonly patchItemEffect = effect(() => {
        const item = this.item();

        if (!item || Object.keys(item).length === 0) {
            return;
        }
        if (!this.form.pristine) {
            return;
        }

        this.form.patchValue(
            {
                timeDuration: item.timeDuration,
                type: item.type,
                video: item.video,
                title: item.title,
                subtitle: item.subtitle,
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
            this.resetImage();
        }
    });

    private async handleExistingImage(url: string): Promise<void> {
        try {
            const mediaValue: MediaValue = {
                type: 'remote',
                url: url,
            };
            this.imageFile.set(url);
            this.form.controls.image.setValue(mediaValue, { emitEvent: false });
            this.imageError.set(null);
        } catch (error) {
            console.error('❌ Failed to handle existing image:', error);
            this.imageError.set('CONTENT_MANAGEMENT.SLIDE.IMAGE_LOAD_ERROR');
            this.form.controls.image.setErrors({ imageLoadFailed: true });
        }
    }

    private createForm(): FormGroup<SlideFormControl> {
        return this.fb.nonNullable.group<SlideFormControl>(
            {
                timeDuration: new FormControl(5, {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.min(FormValidators.TIME_DURATION.MIN),
                        Validators.max(FormValidators.TIME_DURATION.MAX),
                    ],
                }),
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
                subtitle: new FormControl('', {
                    nonNullable: true,
                    validators: [
                        Validators.required,
                        Validators.minLength(FormValidators.SUBTITLE.MIN),
                        Validators.maxLength(FormValidators.SUBTITLE.MAX),
                        Validators.pattern(FormValidators.SUBTITLE.PATTERN),
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
                image: new FormControl(null, {
                    validators: [Validators.required],
                }),
                video: new FormControl('', {
                    nonNullable: true,
                }),
                buttonLabel: new FormControl('', {
                    nonNullable: true,
                    validators: [
                        Validators.minLength(FormValidators.BUTTON_LABEL.MIN),
                        Validators.maxLength(FormValidators.BUTTON_LABEL.MAX),
                        Validators.pattern(FormValidators.BUTTON_LABEL.PATTERN),
                    ],
                }),
                buttonUrl: new FormControl('', {
                    nonNullable: true,
                    validators: [
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
            {
                validators: [
                    this.buttonFieldsConsistencyValidator(),
                    this.typeMediaConsistencyValidator(),
                ],
            }
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

    public setEditMode(uniqId: string | null): void {
        this.isEditMode.set(!!uniqId);

        if (!uniqId) {
            this.form.reset({
                timeDuration: 5,
            });
            this.facade.reset();
            return;
        }

        this.facade.read({ uniqId }, true);
    }

    public setImage(file: File): void {
        const mediaValue: MediaValue = {
            type: 'local',
            file: file,
        };
        this.imageFile.set(file);
        this.form.controls.image.setValue(mediaValue);
        this.form.controls.image.markAsTouched();
        this.imageError.set(null);
    }

    public resetImage(): void {
        this.imageFile.set(null);
        this.form.controls.image.reset(null);
    }

    private resetMediaFields(type: string | undefined): void {
        if (!type) {
            return;
        }

        const resetMap: Record<string, () => void> = {
            [VIDEO]: () => {
                this.resetImage();
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

    private resetVideo(): void {
        this.form.controls.video.reset('', { emitEvent: false });
    }

    public reset(): void {
        this.form.reset({
            timeDuration: 5,
        });
        this.imageFile.set(null);
        this.imageError.set(null);
        this.isEditMode.set(false);
    }
}

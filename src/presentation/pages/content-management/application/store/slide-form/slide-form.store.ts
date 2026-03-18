import { Injectable, inject, signal, computed, effect } from '@angular/core';
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
import { ImageUploadStateService } from '@shared/components/image-upload/domain/services/image-upload-state.service';
import { PLATFORM_ASPECT_RATIOS } from '@shared/components/image-upload/domain/types/image-upload.types';
import { Platform } from '@shared/domain/enums/platform.enum';
import { TypeMedia } from '@shared/domain/enums/type-media.enum';

export type CropperStatus = 'idle' | 'loading' | 'ready' | 'cropping' | 'error';
const VIDEO = getEnumKeyByValue(TypeMedia, TypeMedia.VIDEO) as string;
const IMAGE = getEnumKeyByValue(TypeMedia, TypeMedia.IMAGE) as string;

@Injectable()
export class SlideFormStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(SlideFindOneFacade);
    private readonly imageStore = inject(ImageUploadStateService);

    private readonly isPatching = signal(false);

    readonly form: FormGroup<SlideFormControl> = this.createForm();

    readonly typeControl = toSignal(this.form.controls.type.valueChanges, {
        initialValue: this.form.controls.type.value,
    });

    public readonly isEditMode = signal(false);

    public readonly isVideoMode = computed(() => {
        const type = this.typeControl();
        return type === VIDEO;
    });
    public readonly isImageMode = computed(() => {
        const type = this.typeControl();
        return type === IMAGE;
    });
    public readonly selectedPlatforms = computed(
        () => this.form.controls.platforms.value
    );
    public readonly activeCropAspectRatio = computed((): number => {
        const platforms = this.selectedPlatforms();
        if (!platforms?.length) {
            return PLATFORM_ASPECT_RATIOS[Platform.WEB];
        }

        const ratios = platforms.map((p) => PLATFORM_ASPECT_RATIOS[p]);
        const allSameRatio = ratios.every((r) => r === ratios[0]);

        if (allSameRatio) {
            return ratios[0];
        }

        if (platforms.includes(Platform.MOBILE)) {
            return PLATFORM_ASPECT_RATIOS[Platform.MOBILE];
        }
        if (platforms.includes(Platform.PWA)) {
            return PLATFORM_ASPECT_RATIOS[Platform.PWA];
        }
        return PLATFORM_ASPECT_RATIOS[Platform.WEB];
    });

    private readonly item = this.facade.items;
    public readonly loading = this.facade.loading;

    private readonly patchItemEffect = effect(() => {
        const item = this.item();
        if (!item) {
            return;
        }

        this.isPatching.set(true);
        this.form.patchValue({ ...item });
        queueMicrotask(() => this.isPatching.set(false));
    });

    private readonly typeMediaEffect = effect(() => {
        if (this.isPatching()) {
            return;
        }
        const type = this.typeControl();
        if (!type) {
            return;
        }
        this.resetMediaFields(type);
        this.updateValidatorsByType(type);
    });

    private createForm(): FormGroup<SlideFormControl> {
        return this.fb.nonNullable.group<SlideFormControl>({
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
                nonNullable: true,
                validators: [Validators.required],
            }),

            video: new FormControl('', {
                nonNullable: true,
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
            }),
        });
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

    private resetImageStore(): void {
        this.imageStore.resetImage();
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

    public resetImage(): void {
        this.form.controls.image.reset(null, { emitEvent: false });
    }

    public resetVideo(): void {
        this.form.controls.video.reset('', { emitEvent: false });
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
}

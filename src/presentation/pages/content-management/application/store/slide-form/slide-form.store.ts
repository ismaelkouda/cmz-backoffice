import {
    Injectable,
    inject,
    signal,
    computed,
    effect,
    runInInjectionContext,
    Injector,
    OnDestroy,
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

export type CropperStatus = 'idle' | 'loading' | 'ready' | 'cropping' | 'error';
const VIDEO = getEnumKeyByValue(TypeMedia, TypeMedia.VIDEO);
const IMAGE = getEnumKeyByValue(TypeMedia, TypeMedia.IMAGE);
export interface CropperState {
    status: CropperStatus;
    errorMessage: string | null;
    sourceFile: File | null;
    croppedBlob: Blob | null;
    previewUrl: string | null;
    isOpen: boolean;
    rotation: number;
    flipH: boolean;
    flipV: boolean;
}
const INITIAL_CROPPER_STATE: CropperState = {
    status: 'idle',
    errorMessage: null,
    sourceFile: null,
    croppedBlob: null,
    previewUrl: null,
    isOpen: false,
    rotation: 0,
    flipH: false,
    flipV: false,
};

@Injectable()
export class SlideFormStore implements OnDestroy {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(SlideFindOneFacade);
    private readonly injector = inject(Injector);

    readonly form: FormGroup<SlideFormControl> = this.createForm();

    readonly typeControl = toSignal(this.form.controls.type.valueChanges, {
        initialValue: this.form.controls.type.value,
    });

    public readonly isEditMode = signal(false);
    private readonly isPatching = signal(false);
    private readonly cropperState = signal<CropperState>({
        ...INITIAL_CROPPER_STATE,
    });

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
    readonly cropperIsOpen = computed(() => this.cropperState().isOpen);
    readonly cropperStatus = computed(() => this.cropperState().status);
    readonly cropperSourceFile = computed(() => this.cropperState().sourceFile);
    readonly cropperPreviewUrl = computed(() => this.cropperState().previewUrl);
    readonly cropperRotation = computed(() => this.cropperState().rotation);
    readonly cropperFlipH = computed(() => this.cropperState().flipH);
    readonly cropperFlipV = computed(() => this.cropperState().flipV);
    readonly cropperErrorMessage = computed(
        () => this.cropperState().errorMessage
    );
    readonly hasCroppedImage = computed(() => !!this.cropperState().previewUrl);

    private readonly patchItemEffect = effect(() => {
        const item = this.item();
        if (!item) {
            return;
        }
        runInInjectionContext(this.injector, () => {
            this.isPatching.set(true);
            this.form.patchValue({ ...item });
            queueMicrotask(() => this.isPatching.set(false));
        });
    });
    private readonly typeMediaEffect = effect(() => {
        if (this.isPatching()) {
            return;
        }
        const type = this.typeControl();
        if (!type) {
            return;
        }
        console.log('type: ', type);
        this.resetMediaFields(type);
        this.updateValidatorsByType(type);
    });

    private readonly item = this.facade.items;
    public readonly loading = this.facade.loading;

    ngOnDestroy(): void {
        const { previewUrl } = this.cropperState();
        this.revokePreviewUrl(previewUrl);
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
                type: new FormControl(IMAGE ?? '', {
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

        const isVideo = type === VIDEO;
        console.log('isVideo: ', isVideo);

        if (isVideo) {
            this.resetImage();
        } else {
            this.resetVideo();
        }
    }

    public setDetailsMode(uniqId: string | null): void {
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

    public openCropper(file: File): void {
        const { previewUrl } = this.cropperState();
        this.revokePreviewUrl(previewUrl);

        this.cropperState.update((s) => ({
            ...s,
            isOpen: true,
            status: 'loading',
            sourceFile: file,
            errorMessage: null,
            rotation: 0,
            flipH: false,
            flipV: false,
        }));
    }

    public onCropperImageLoaded(): void {
        this.cropperState.update((s) => ({ ...s, status: 'ready' }));
    }

    public onCropperImageLoadFailed(): void {
        this.cropperState.update((s) => ({
            ...s,
            status: 'error',
            errorMessage: 'CONTENT_MANAGEMENT.SLIDE.CROPPER.ERROR_LOAD_FAILED',
            sourceFile: null,
        }));
    }

    public confirmCrop(blob: Blob): void {
        this.cropperState.update((s) => ({ ...s, status: 'cropping' }));

        const { previewUrl } = this.cropperState();
        this.revokePreviewUrl(previewUrl);

        const preview = URL.createObjectURL(blob);
        const sourceFile = this.cropperState().sourceFile;
        const originalName = sourceFile?.name ?? 'image';
        const ext = this.resolveExtension(blob.type);
        const fileName = `${originalName.replace(/\.[^.]+$/, '')}_cropped.${ext}`;
        const file = new File([blob], fileName, { type: blob.type });

        this.cropperState.update((s) => ({
            ...s,
            status: 'idle',
            croppedBlob: blob,
            previewUrl: preview,
            isOpen: false,
        }));

        this.form.controls.image.setValue(file);
        this.form.controls.image.markAsDirty();
        this.form.controls.image.markAsTouched();
    }

    public abandonCrop(): void {
        const state = this.cropperState();
        const hadExistingImage = !!state.previewUrl;
        this.revokePreviewUrl(state.previewUrl);
        this.cropperState.update((s) => ({
            ...s,
            isOpen: false,
            status: 'idle',
            errorMessage: null,
            sourceFile: null,
        }));
        if (!hadExistingImage) {
            this.form.controls.image.reset(null);
        }
    }

    public rotateCropper(direction: 'left' | 'right'): void {
        this.cropperState.update((s) => ({
            ...s,
            rotation:
                direction === 'right'
                    ? (s.rotation + 90) % 360
                    : (s.rotation - 90 + 360) % 360,
        }));
    }

    public flipCropperHorizontal(): void {
        this.cropperState.update((s) => ({ ...s, flipH: !s.flipH }));
    }

    public flipCropperVertical(): void {
        this.cropperState.update((s) => ({ ...s, flipV: !s.flipV }));
    }

    public resetCropperTransforms(): void {
        this.cropperState.update((s) => ({
            ...s,
            rotation: 0,
            flipH: false,
            flipV: false,
        }));
    }

    private revokePreviewUrl(url: string | null): void {
        if (url) {
            URL.revokeObjectURL(url);
        }
    }

    private resolveExtension(mimeType: string): string {
        const map: Record<string, string> = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/webp': 'webp',
            'image/gif': 'gif',
        };
        return map[mimeType] ?? 'png';
    }

    public resetImage(): void {
        console.log('resetImage: ');
        this.cropperState.set({ ...INITIAL_CROPPER_STATE });
        this.form.controls.image.reset(null, { emitEvent: false });
    }

    public resetVideo(): void {
        console.log('resetVideo: ');
        this.form.controls.video.reset('', { emitEvent: false });
    }
}

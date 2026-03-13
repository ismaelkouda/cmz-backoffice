import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { HomeFormStore } from '@presentation/pages/content-management/application/store/home-form/home-form.store';
import { SlideFormStore } from '@presentation/pages/content-management/application/store/slide-form/slide-form.store';
import { ImageUploadFormControlType } from '@shared/components/image-upload/domain/types/image-upload-form-control.type';
import { PLATFORM_ASPECT_RATIOS } from '@shared/components/image-upload/domain/types/image-upload.types';
import { Platform } from '@shared/domain/enums/platform.enum';
import { RouteContextType } from '@shared/domain/types/route-context.types';

export type CropperStatus = 'idle' | 'loading' | 'ready' | 'cropping' | 'error';
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
export class ImageUploadStateService implements OnDestroy {
    private readonly homeState = inject(HomeFormStore);
    private readonly slideState = inject(SlideFormStore);

    private readonly context = signal<RouteContextType | null>(null);

    readonly homeForm = this.homeState.form;
    readonly homeLoading = this.homeState.loading;

    readonly slideForm = this.slideState.form;
    readonly slideLoading = this.slideState.loading;

    readonly form = computed<ImageUploadFormControlType | null>(() => {
        const ctx = this.context();

        switch (ctx) {
            case 'home-blocks':
                return this.homeForm;

            case 'sliders':
                return this.slideForm;

            default:
                return null;
        }
    });

    readonly loading = computed(() => {
        const ctx = this.context();
        switch (ctx) {
            case 'home-blocks':
                return this.homeLoading();
            case 'sliders':
                return this.slideLoading();
            default:
                return false;
        }
    });

    private readonly cropperState = signal<CropperState>({
        ...INITIAL_CROPPER_STATE,
    });
    public readonly selectedPlatforms = computed(
        () => this.form()?.controls.platforms.value
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
            errorMessage: 'CONTENT_MANAGEMENT.HOME.CROPPER.ERROR_LOAD_FAILED',
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

        const form = this.form();
        if (!form) {
            return;
        }
        form.controls.image.setValue(file);
        form.controls.image.markAsDirty();
        form.controls.image.markAsTouched();
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
            this.form()?.controls.image.reset(null);
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
        this.cropperState.set({ ...INITIAL_CROPPER_STATE });
        this.form()?.controls.image.reset(null, { emitEvent: false });
    }

    ngOnDestroy(): void {
        const { previewUrl } = this.cropperState();
        this.revokePreviewUrl(previewUrl);
    }
}

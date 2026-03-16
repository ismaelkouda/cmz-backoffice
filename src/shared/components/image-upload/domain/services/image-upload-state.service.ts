import { Injectable, signal, computed, OnDestroy } from '@angular/core';
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
    private readonly context = signal<RouteContextType | null>(null);

    private readonly cropperState = signal<CropperState>({
        ...INITIAL_CROPPER_STATE,
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

    public getCurrentFile(): File | null {
        const state = this.cropperState();
        if (state.croppedBlob && state.sourceFile) {
            const ext = this.resolveExtension(state.croppedBlob.type);
            const fileName = `${state.sourceFile.name.replace(/\.[^.]+$/, '')}_cropped.${ext}`;
            return new File([state.croppedBlob], fileName, {
                type: state.croppedBlob.type,
            });
        }
        return null;
    }

    public confirmCrop(blob: Blob): void {
        this.cropperState.update((s) => ({ ...s, status: 'cropping' }));

        const { previewUrl, sourceFile } = this.cropperState();
        this.revokePreviewUrl(previewUrl);

        const preview = URL.createObjectURL(blob);

        this.cropperState.update((s) => ({
            ...s,
            status: 'idle',
            croppedBlob: blob,
            sourceFile: sourceFile,
            previewUrl: preview,
            isOpen: false,
        }));
    }

    public abandonCrop(): void {
        const state = this.cropperState();
        this.revokePreviewUrl(state.previewUrl);
        this.cropperState.update((s) => ({
            ...s,
            isOpen: false,
            status: 'idle',
            errorMessage: null,
            sourceFile: null,
        }));
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
    }

    ngOnDestroy(): void {
        const { previewUrl } = this.cropperState();
        this.revokePreviewUrl(previewUrl);
    }
}

import { Injectable, signal, computed, OnDestroy } from '@angular/core';

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
    isOriginal: boolean;
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
    isOriginal: false,
};
@Injectable()
export class ImageUploadStateService implements OnDestroy {
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
    readonly isOriginalImage = computed(() => this.cropperState().isOriginal);

    public openCropper(file: File): void {
        console.log('file: ', file);
        const { previewUrl } = this.cropperState();
        this.revokePreviewUrl(previewUrl);

        this.cropperState.update((s) => ({
            ...s,
            isOpen: true,
            status: 'loading',
            croppedBlob: null,
            sourceFile: file,
            errorMessage: null,
            rotation: 0,
            flipH: false,
            flipV: false,
            isOriginal: false,
        }));
    }

    public async hydrateExistingImage(url: string): Promise<void> {
        try {
            this.cropperState.update((s) => ({
                ...s,
                status: 'loading',
                errorMessage: null,
            }));

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const file = new File([blob], url.split('/').pop() || 'image.jpg', {
                type: blob.type,
            });
            const previewUrl = URL.createObjectURL(blob);

            this.cropperState.update((s) => ({
                ...s,
                isOpen: false,
                previewUrl,
                status: 'ready',
                sourceFile: file,
                croppedBlob: null,
                errorMessage: null,
                rotation: 0,
                flipH: false,
                flipV: false,
                isOriginal: true,
            }));
        } catch (error) {
            console.error('Failed to hydrate image:', error);
            this.cropperState.update((s) => ({
                ...s,
                status: 'error',
                errorMessage:
                    'CONTENT_MANAGEMENT.HOME.CROPPER.ERROR_LOAD_FAILED',
            }));
        }
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
        if (state.croppedBlob) {
            const ext = this.resolveExtension(state.croppedBlob.type);
            const fileName = state.sourceFile
                ? `${state.sourceFile.name.replace(/\.[^.]+$/, '')}_cropped.${ext}`
                : `image_${Date.now()}.${ext}`;

            return new File([state.croppedBlob], fileName, {
                type: state.croppedBlob.type,
            });
        }
        return state.sourceFile;
    }

    public openCropperWithExisting(): void {
        const state = this.cropperState();
        if (!state.sourceFile) {
            return;
        }

        this.cropperState.update((s) => ({
            ...s,
            isOpen: true,
            status: 'ready',
        }));
    }

    public confirmCrop(blob: Blob): void {
        const { previewUrl, sourceFile } = this.cropperState();
        this.revokePreviewUrl(previewUrl);

        const preview = URL.createObjectURL(blob);

        this.cropperState.update((s) => ({
            ...s,
            status: 'ready',
            croppedBlob: blob,
            sourceFile: sourceFile,
            previewUrl: preview,
            isOpen: false,
            rotation: 0,
            flipH: false,
            flipV: false,
            isOriginal: false,
        }));
    }

    public getCroppedBlob(): Blob | null {
        return this.cropperState().croppedBlob;
    }

    public abandonCrop(): void {
        const state = this.cropperState();
        this.revokePreviewUrl(state.previewUrl);
        // this.cropperState.update((s) => ({
        //     ...s,
        //     isOpen: false,
        //     status: 'idle',
        //     errorMessage: null,
        //     sourceFile: null,
        // }));
        if (state.isOpen) {
            this.cropperState.update((s) => ({
                ...s,
                isOpen: false,
                status: 'ready',
                errorMessage: null,
                rotation: 0,
                flipH: false,
                flipV: false,
            }));
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
        if (url && url.startsWith('blob:')) {
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
        const { previewUrl } = this.cropperState();
        this.revokePreviewUrl(previewUrl);
        this.cropperState.set({ ...INITIAL_CROPPER_STATE });
    }

    ngOnDestroy(): void {
        const { previewUrl } = this.cropperState();
        this.revokePreviewUrl(previewUrl);
    }
}

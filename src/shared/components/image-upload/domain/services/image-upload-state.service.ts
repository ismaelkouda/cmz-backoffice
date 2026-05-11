import {
    Injectable,
    signal,
    computed,
    WritableSignal,
    Signal,
} from '@angular/core';

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

export interface CropperStore {
    state: WritableSignal<CropperState>;
    status: Signal<CropperStatus>;
    isIdle: Signal<boolean>;
    isLoading: Signal<boolean>;
    isReady: Signal<boolean>;
    hasError: Signal<boolean>;
    sourceFile: Signal<File | null>;
    previewUrl: Signal<string | null>;
    hasImage: Signal<boolean>;
    fileName: Signal<string | undefined>;
    fileSize: Signal<number | undefined>;
    isOpen: Signal<boolean>;
    cropperRotation: Signal<number>;
    cropperFlipH: Signal<boolean>;
    cropperFlipV: Signal<boolean>;
    isOriginalImage: Signal<boolean>;
}

const createInitialState = (): CropperState => ({
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
});

@Injectable({ providedIn: 'root' })
export class ImageUploadStateService {
    private readonly stores = new Map<string, WritableSignal<CropperState>>();

    public getStore(id: string): WritableSignal<CropperState> {
        let store = this.stores.get(id);

        if (!store) {
            store = signal(createInitialState());
            this.stores.set(id, store);
        }

        return store;
    }

    public connect(id: string): CropperStore {
        const state = this.getStore(id);
        console.log('state: ', state());

        return {
            state,
            status: computed(() => state().status),
            isIdle: computed(() => state().status === 'idle'),
            isLoading: computed(() => state().status === 'loading'),
            isReady: computed(() => state().status === 'ready'),
            hasError: computed(() => state().status === 'error'),
            sourceFile: computed(() => state().sourceFile),
            previewUrl: computed(() => state().previewUrl),
            hasImage: computed(() => !!state().previewUrl),
            fileName: computed(() => state().sourceFile?.name),
            fileSize: computed(() => state().sourceFile?.size),
            isOpen: computed(() => state().isOpen),
            cropperRotation: computed(() => state().rotation),
            cropperFlipH: computed(() => state().flipH),
            cropperFlipV: computed(() => state().flipV),
            isOriginalImage: computed(() => state().isOriginal),
        };
    }

    public openCropper(id: string, file: File): void {
        const store = this.getStore(id);
        const currentState = store();

        if (currentState.previewUrl) {
            this.revokeUrl(currentState.previewUrl);
        }

        store.update((s) => ({
            ...s,
            isOpen: true,
            status: 'loading',
            croppedBlob: null,
            sourceFile: file,
            previewUrl: null,
            errorMessage: null,
            rotation: 0,
            flipH: false,
            flipV: false,
            isOriginal: false,
        }));
    }

    public confirmCrop(id: string, blob: Blob | null): void {
        const store = this.getStore(id);
        const currentState = store();

        if (currentState.previewUrl) {
            this.revokeUrl(currentState.previewUrl);
        }

        if (!blob) {
            return;
        }

        const previewUrl = URL.createObjectURL(blob);
        store.update((s) => ({
            ...s,
            status: 'ready',
            croppedBlob: blob,
            previewUrl,
            isOpen: false,
            rotation: 0,
            flipH: false,
            flipV: false,
            isOriginal: false,
            errorMessage: null,
        }));
    }

    public async hydrate(id: string, url: string): Promise<void> {
        const store = this.getStore(id);

        console.log('hydrate called');

        store.update((s) => ({
            ...s,
            status: 'loading',
            errorMessage: null,
        }));

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const fileName = url.split('/').pop() || 'image.jpg';
            const file = new File([blob], fileName, { type: blob.type });

            const currentState = store();
            if (currentState.previewUrl) {
                this.revokeUrl(currentState.previewUrl);
            }

            const previewUrl = URL.createObjectURL(blob);
            store.update((s) => ({
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
            store.update((s) => ({
                ...s,
                status: 'error',
                errorMessage:
                    'CONTENT_MANAGEMENT.HOME.CROPPER.ERROR_LOAD_FAILED',
            }));
        }
    }

    public setReady(id: string): void {
        this.getStore(id).update((s) => ({ ...s, status: 'ready' }));
    }

    public setError(id: string, message: string): void {
        this.getStore(id).update((s) => ({
            ...s,
            status: 'error',
            errorMessage: message,
        }));
    }

    public setLoaded(id: string): void {
        this.getStore(id).update((s) => ({ ...s, status: 'ready' }));
    }

    public setFailed(id: string): void {
        this.getStore(id).update((s) => ({
            ...s,
            status: 'error',
            errorMessage: 'CONTENT_MANAGEMENT.HOME.CROPPER.ERROR_LOAD_FAILED',
            sourceFile: null,
            previewUrl: null,
        }));
    }

    public getCurrentFile(id: string): File | null {
        const store = this.getStore(id);
        const state = store();

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

    public openCropperWithExisting(id: string): void {
        const store = this.getStore(id);
        const state = store();

        if (!state.sourceFile) {
            console.warn(`No source file found for cropper ${id}`);
            return;
        }

        store.update((s) => ({
            ...s,
            isOpen: true,
            status: 'ready',
        }));
    }

    public getCroppedBlob(id: string): Blob | null {
        return this.getStore(id)().croppedBlob;
    }

    public abandonCrop(id: string): void {
        const store = this.getStore(id);
        const state = store();

        if (state.isOpen) {
            store.update((s) => ({
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

    public setPreviewFromFile(id: string, file: File): void {
        const store = this.getStore(id);

        const currentState = store();

        if (currentState.previewUrl) {
            this.revokeUrl(currentState.previewUrl);
        }

        const previewUrl = URL.createObjectURL(file);

        store.update((s) => ({
            ...s,
            sourceFile: file,
            previewUrl,
            status: 'ready',
            errorMessage: null,
            isOpen: false,
        }));
    }

    public rotateCropper(id: string, direction: 'left' | 'right'): void {
        this.getStore(id).update((s) => ({
            ...s,
            rotation:
                direction === 'right'
                    ? (s.rotation + 90) % 360
                    : (s.rotation - 90 + 360) % 360,
        }));
    }

    public flipCropperHorizontal(id: string): void {
        this.getStore(id).update((s) => ({ ...s, flipH: !s.flipH }));
    }

    public flipCropperVertical(id: string): void {
        this.getStore(id).update((s) => ({ ...s, flipV: !s.flipV }));
    }

    public resetCropperTransforms(id: string): void {
        this.getStore(id).update((s) => ({
            ...s,
            rotation: 0,
            flipH: false,
            flipV: false,
        }));
    }

    private revokeUrl(url: string | null): void {
        if (url?.startsWith('blob:')) {
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

    public reset(id: string): void {
        const store = this.getStore(id);
        const state = store();

        if (state.previewUrl) {
            this.revokeUrl(state.previewUrl);
        }
        console.log('reset: ');
        store.set(createInitialState());
    }

    public destroy(id: string): void {
        const store = this.stores.get(id);
        if (store) {
            const state = store();
            if (state.previewUrl) {
                this.revokeUrl(state.previewUrl);
            }
            this.stores.delete(id);
        }
    }
}

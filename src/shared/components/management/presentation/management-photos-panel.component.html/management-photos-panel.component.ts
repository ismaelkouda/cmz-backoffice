import {
    Component,
    input,
    computed,
    ChangeDetectionStrategy,
    inject,
    signal,
    effect,
    untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { ImageCropDialogComponent } from '@shared/components/image-crop-dialog/image-crop-dialog.component';
import { ImagePreviewDialogComponent } from '@shared/components/image-preview-dialog/image-preview-dialog.component';
import { ImageUploadStateService } from '@shared/components/image-upload/domain/services/image-upload-state.service';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { ImageZoomComponent } from '@shared/components/image-zoom/image-zoom.component';
import { ManagementEntityType } from '@shared/components/management/domain/types/management-entity.type';
import { ManagementFormStore } from '@shared/components/management/presentation/store/management-form.store';
import { MediaValue } from '@shared/domain/types/media.types';

@Component({
    selector: 'app-management-photos-panel',
    standalone: true,
    imports: [
        TranslateModule,
        ImageUploadComponent,
        ImagePreviewDialogComponent,
        ImageCropDialogComponent,
        ImageZoomComponent,
    ],
    templateUrl: './management-photos-panel.component.html',
    styleUrls: ['./management-photos-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementPhotosPanelComponent {
    public readonly instanceId = input.required<string>();

    public readonly store = inject(ManagementFormStore);
    protected readonly imageStore = inject(ImageUploadStateService);

    public readonly item = input.required<ManagementEntityType>();
    public readonly loading = input.required<boolean>();

    readonly previewVisible = signal(false);

    readonly imageVm = computed(() =>
        this.imageStore.connect(this.instanceId())
    );

    readonly cropperState = computed(() =>
        this.imageStore.getStore(this.instanceId())()
    );

    readonly placePhotoSignal = toSignal(
        this.store.form.controls.placePhoto.valueChanges,
        {
            initialValue: this.store.form.controls.placePhoto.value,
        }
    );

    protected readonly placePhoto = computed(
        (): MediaValue | string | undefined => {
            const placePhoto = this.placePhotoSignal();
            const currentItem = this.item();

            return placePhoto ?? currentItem?.placePhoto;
        }
    );

    protected readonly placePhotoUrl = computed((): string | null => {
        const value = this.placePhoto();
        if (!value) {
            return null;
        }
        if (typeof value === 'string') {
            return value || null;
        }
        if (value.type === 'remote') {
            return value.url || null;
        }
        return null;
    });

    protected readonly accessPhoto = computed((): string | null => {
        return this.item()?.accessPlacePhoto || null;
    });

    protected readonly hasPhotos = computed((): boolean => {
        return !!(this.placePhotoUrl() || this.accessPhoto());
    });

    protected openAccessPreview(): void {
        const url = this.accessPhoto();
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    readonly isIdle = computed(() => !this.imageVm().hasImage());
    readonly hasError = computed(() => this.imageVm().hasError());
    readonly hasImage = computed(() => this.imageVm().hasImage());
    readonly fileName = computed(() => this.imageVm().fileName() ?? null);
    readonly fileSize = computed(() => this.imageVm().fileSize() ?? null);
    readonly previewUrl = computed(() => this.imageVm().previewUrl());

    private previousDetailsType = false;

    constructor() {
        this.initializeImageHydration();
        this.resetImage();
    }

    private resetImage(): void {
        effect(() => {
            const current = this.store.shouldShowDetailsTypeField();

            if (current && !this.previousDetailsType) {
                untracked(() => {
                    this.onImageCleared();
                });
            }

            this.previousDetailsType = current;
        });
    }

    private initializeImageHydration(): void {
        effect(() => {
            const currentItem = this.item();
            const media = this.placePhotoSignal();
            const hasPreview = this.previewUrl();

            if (hasPreview || !media) {
                return;
            }

            if (media.type === 'remote' && media.url) {
                this.imageStore.hydrate(this.instanceId(), media.url);
            }

            if (media.type === 'local' && media.file) {
                this.imageStore.setPreviewFromFile(
                    this.instanceId(),
                    media.file
                );
            }

            if (!media && currentItem?.placePhoto) {
                this.imageStore.hydrate(
                    this.instanceId(),
                    currentItem.placePhoto
                );
            }
        });
    }

    protected isApprovalType(value: 'edit' | 'callback' | 'view'): boolean {
        return this.store.isApprovalType(value);
    }

    public onCropConfirmed(event: Blob): void {
        this.imageStore.confirmCrop(this.instanceId(), event);
        const file = this.imageStore.getCurrentFile(this.instanceId());
        if (file) {
            this.store.setImage(file);
        }
    }

    protected openImagePreview(): void {
        if (this.store.hasImage()) {
            this.previewVisible.set(true);
        }
    }

    protected onImageCleared(): void {
        this.store.resetImage();
        this.imageStore.reset(this.instanceId());
    }

    protected onImageLoaded(): void {
        this.imageStore.setLoaded(this.instanceId());
    }

    protected onImageFailed(): void {
        this.imageStore.setFailed(this.instanceId());
    }

    protected onImageRotate(direction: 'left' | 'right'): void {
        this.imageStore.rotateCropper(this.instanceId(), direction);
    }

    protected onImageFlipHorizontal(): void {
        this.imageStore.flipCropperHorizontal(this.instanceId());
    }

    protected onImageFlipVertical(): void {
        this.imageStore.flipCropperVertical(this.instanceId());
    }

    protected onImageResetTransforms(): void {
        this.imageStore.resetCropperTransforms(this.instanceId());
    }

    public closeImagePreview(): void {
        this.previewVisible.set(false);
    }

    protected onCloseCropDialog(): void {
        this.imageStore.abandonCrop(this.instanceId());
    }
}

import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    computed,
    ChangeDetectionStrategy,
    inject,
    signal,
    effect,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ImageCropDialogComponent } from '@shared/components/image-crop-dialog/image-crop-dialog.component';
import { ImagePreviewData } from '@shared/components/image-preview-dialog/domain/types/image-preview.types';
import { ImagePreviewDialogComponent } from '@shared/components/image-preview-dialog/image-preview-dialog.component';
import { ImageUploadStateService } from '@shared/components/image-upload/domain/services/image-upload-state.service';
import { ImageSelectedResult } from '@shared/components/image-upload/domain/types/image-upload.types';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { ImageZoomComponent } from '@shared/components/image-zoom/image-zoom.component';

import { ManagementFormStore } from '../store/management-form.store';

@Component({
    selector: 'app-management-photos-panel',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ImageZoomComponent,
        ImageUploadComponent,
        ImagePreviewDialogComponent,
        ImageCropDialogComponent,
    ],
    providers: [ManagementFormStore, ImageUploadStateService],
    templateUrl: './management-photos-panel.component.html',
    styleUrls: ['./management-photos-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementPhotosPanelComponent {
    private readonly store = inject(ManagementFormStore);
    private readonly imageStore = inject(ImageUploadStateService);
    public readonly item = input.required<any>();
    public readonly loading = input.required<boolean>();

    readonly previewVisible = signal(false);

    protected readonly placePhoto = computed((): string | null => {
        return this.item()?.placePhoto ?? null;
    });

    protected readonly accessPhoto = computed((): string | null => {
        return this.item()?.accessPlacePhoto ?? null;
    });

    // protected readonly placeDescription = computed((): string | null => {
    //     return this.item()?.placeDescription ?? null;
    // });

    protected readonly hasPhotos = computed((): boolean => {
        return !!(this.placePhoto() || this.accessPhoto());
    });

    protected readonly photosCount = computed((): number => {
        let count = 0;
        if (this.placePhoto()) {
            count++;
        }
        if (this.accessPhoto()) {
            count++;
        }
        return count;
    });

    protected readonly photosStatus = computed(
        (): { label: string; class: string } | null => {
            const count = this.photosCount();

            if (count === 2) {
                return {
                    label: 'MANAGEMENT.FORM.PICTURES.STATUS.COMPLETE',
                    class: 'status-complete',
                };
            }

            if (count === 1) {
                return {
                    label: 'MANAGEMENT.FORM.PICTURES.STATUS.PARTIAL',
                    class: 'status-partial',
                };
            }

            if (count === 0) {
                return {
                    label: 'MANAGEMENT.FORM.PICTURES.STATUS.MISSING',
                    class: 'status-missing',
                };
            }

            return null;
        }
    );

    protected onImageError(type: 'place' | 'access'): void {
        console.error(
            `Failed to load ${type} photo for item:`,
            this.item()?.uniqId
        );
    }

    protected isValidImageUrl(url: string | null): boolean {
        if (!url) {
            return false;
        }

        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    private readonly syncImage = effect(() => {
        const file = this.imageStore.getCurrentFile();

        if (file) {
            this.store.setImage(file);
        }
    });

    readonly previewImageData = computed<ImagePreviewData>(() => {
        const previewUrl = this.imageStore.cropperPreviewUrl();
        const mediaValue = this.store.form.controls.placePhoto.value;

        let fileName: string | null = null;
        let fileSize: number | undefined = undefined;

        if (mediaValue) {
            fileName = mediaValue.name;
            fileSize = mediaValue.size;
        }

        return {
            url: previewUrl || '',
            fileName,
            fileSize: this.formatFileSize(fileSize),
        };
    });

    private formatFileSize(size?: number): string | null {
        if (!size) {
            return null;
        }

        return size < 1024 * 1024
            ? `${(size / 1024).toFixed(0)} Ko`
            : `${(size / (1024 * 1024)).toFixed(1)} Mo`;
    }

    public onImageSelected({ file }: ImageSelectedResult): void {
        this.imageStore.openCropper(file);
    }

    public onImageCleared(): void {
        this.imageStore.resetImage();
        this.store.resetImage();
    }

    public openImagePreview(): void {
        if (this.store.hasImage()) {
            this.previewVisible.set(true);
        }
    }

    public onCropConfirmed(blob: Blob): void {
        this.imageStore.confirmCrop(blob);
        const file = this.imageStore.getCurrentFile();
        if (file) {
            this.store.form.controls.placePhoto.setValue(file);
            this.store.form.controls.placePhoto.markAsDirty();
            this.store.form.controls.placePhoto.markAsTouched();
        }
    }

    public closeImagePreview(): void {
        this.previewVisible.set(false);
    }
}

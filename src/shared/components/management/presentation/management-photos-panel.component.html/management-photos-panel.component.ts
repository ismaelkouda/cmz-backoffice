import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    computed,
    ChangeDetectionStrategy,
    inject,
    signal,
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
        CommonModule,
        TranslateModule,
        ImageZoomComponent,
        ImageUploadComponent,
        ImagePreviewDialogComponent,
        ImageCropDialogComponent,
    ],
    providers: [ImageUploadStateService],
    templateUrl: './management-photos-panel.component.html',
    styleUrls: ['./management-photos-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementPhotosPanelComponent {
    public readonly instanceId = signal('ManagementPhotosPanelComponent');
    public readonly store = inject(ManagementFormStore);
    protected readonly imageStore = inject(ImageUploadStateService);
    protected readonly imageState = this.imageStore.getStore(this.instanceId());

    public readonly item = input.required<ManagementEntityType>();
    public readonly loading = input.required<boolean>();

    readonly previewVisible = signal(false);

    protected isApprovalType(value: 'edit' | 'callback' | 'details'): boolean {
        return this.store.isApprovalType(value);
    }

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

    protected readonly accessPhoto = computed((): string | null => {
        return this.item()?.accessPlacePhoto ?? null;
    });

    protected readonly hasPhotos = computed((): boolean => {
        return !!(this.placePhoto() || this.accessPhoto());
    });

    // private readonly syncHydrate = effect(() => {
    //     const item = this.store.item();
    //     const mode = this.store.approvalType();

    //     if (mode !== 'details' || !item?.placePhoto) {
    //         console.log('!item?.placePhoto: ', !item?.placePhoto);
    //         return;
    //     }

    //     if (item?.placePhoto) {
    //         console.log('mode: ', mode);
    //         console.log('item?.placePhoto: ', item?.placePhoto);
    //         this.imageStore.reset(this.instanceId());
    //         return;
    //     }

    //     this.imageStore.hydrate(this.instanceId(), item.placePhoto);
    // });

    readonly approvalTypeSignal = toSignal(
        this.store.form.controls.approvalType.valueChanges,
        {
            initialValue: this.store.form.controls.approvalType.value,
        }
    );

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
}

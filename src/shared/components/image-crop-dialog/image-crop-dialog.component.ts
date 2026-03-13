import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Platform } from '@shared/domain/enums/platform.enum';
import {
    ImageCropperComponent,
    ImageCroppedEvent,
    LoadedImage,
} from 'ngx-image-cropper';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

import { PLATFORM_RATIO_LABELS } from '../image-upload/domain/types/image-upload.types';

@Component({
    selector: 'app-image-crop-dialog',
    templateUrl: './image-crop-dialog.component.html',
    styleUrls: ['./image-crop-dialog.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ImageCropperComponent,
        DialogModule,
        ButtonModule,
        TooltipModule,
        DividerModule,
        ProgressSpinnerModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropDialogComponent {
    readonly outputFormat = input<'png' | 'jpeg' | 'webp'>('png');
    readonly visible = input.required<boolean>();
    readonly sourceFile = input<File | null>(null);
    readonly aspectRatio = input<number>(16 / 9);
    readonly rotation = input<number>(0);
    readonly flipH = input<boolean>(false);
    readonly flipV = input<boolean>(false);
    readonly targetPlatforms = input<Platform[]>([Platform.WEB]);
    readonly isLoading = input<boolean>(false);

    readonly imageCropped = output<Blob | null>();
    readonly cropCancelled = output();
    readonly imageLoaded = output<LoadedImage>();
    readonly loadFailed = output();
    readonly rotateLeft = output();
    readonly rotateRight = output();
    readonly flipHorizontal = output();
    readonly flipVertical = output();
    readonly resetTransforms = output();

    readonly cropperReady = signal(false);
    private readonly lastCroppedBlob = signal<Blob | null>(null);

    readonly dialogHeader = computed(() => {
        const platform = this.targetPlatforms()[0];
        const label = platform ? PLATFORM_RATIO_LABELS[platform] : '';
        return label;
    });

    readonly aspectRatioLabel = computed(() => {
        const ratio = this.aspectRatio();
        if (Math.abs(ratio - 16 / 9) < 0.01) {
            return '16:9';
        }
        if (Math.abs(ratio - 9 / 16) < 0.01) {
            return '9:16';
        }
        if (Math.abs(ratio - 1) < 0.01) {
            return '1:1';
        }
        if (Math.abs(ratio - 4 / 3) < 0.01) {
            return '4:3';
        }
        return `${ratio.toFixed(2)}:1`;
    });

    readonly canConfirm = computed((): boolean => {
        const isReady = this.cropperReady();
        const hasBlob = !!this.lastCroppedBlob;
        return isReady && hasBlob;
    });

    readonly rotationLabel = computed(() => `${this.rotation()}°`);

    onImageLoaded(image: LoadedImage): void {
        this.cropperReady.set(true);
        this.imageLoaded.emit(image);
    }

    onLoadImageFailed(): void {
        this.cropperReady.set(false);
        this.loadFailed.emit();
    }

    onImageCropped(event: ImageCroppedEvent): void {
        if (event.blob) {
            this.lastCroppedBlob.set(event.blob);
        }
    }

    onConfirm(): void {
        if (this.lastCroppedBlob) {
            this.imageCropped.emit(this.lastCroppedBlob());
            this.lastCroppedBlob.set(null);
            this.cropperReady.set(false);
        }
    }

    onCancel(): void {
        this.lastCroppedBlob.set(null);
        this.cropperReady.set(false);
        this.cropCancelled.emit();
    }
}

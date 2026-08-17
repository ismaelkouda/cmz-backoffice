import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ImagePreviewData } from '@shared/components/image-preview-dialog/domain/types/image-preview.types';
import { ImageUploadStateService } from '@shared/components/image-upload/domain/services/image-upload-state.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

import { ImageZoomComponent } from '../image-zoom/image-zoom.component';

@Component({
    selector: 'app-image-preview-dialog',
    templateUrl: './image-preview-dialog.component.html',
    styleUrls: ['./image-preview-dialog.component.scss'],
    standalone: true,
    imports: [
        TranslateModule,
        DialogModule,
        ImageZoomComponent,
        ButtonModule,
        TooltipModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagePreviewDialogComponent {
    private readonly store = inject(ImageUploadStateService);
    public readonly instanceId = input.required<string>();
    readonly visible = input.required<boolean>();
    readonly title = input<string>('IMAGE_PREVIEW.TITLE');

    readonly hide = output();

    readonly imageLoaded = signal(false);
    readonly imageError = signal(false);

    readonly image = computed<ImagePreviewData>(() => {
        const file = this.store.getCurrentFile(this.instanceId());

        return {
            url: file instanceof File ? URL.createObjectURL(file) : '',
            fileName: file?.name,
            fileSize: this.formatFileSize(file?.size),
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

    onDialogShow(): void {
        this.imageError.set(false);
    }

    onImageLoad(): void {
        this.imageLoaded.set(true);
        this.imageError.set(false);
    }

    onImageError(): void {
        this.imageLoaded.set(false);
        this.imageError.set(true);
    }

    onCloseDialog(): void {
        this.imageLoaded.set(false);
        this.imageError.set(false);
        this.hide.emit();
    }
}

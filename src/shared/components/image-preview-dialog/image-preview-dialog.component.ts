import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ImagePreviewData } from '@shared/components/image-preview-dialog/domain/types/image-preview.types';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-image-preview-dialog',
    templateUrl: './image-preview-dialog.component.html',
    styleUrls: ['./image-preview-dialog.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        DialogModule,
        ButtonModule,
        TooltipModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagePreviewDialogComponent {
    readonly visible = input.required<boolean>();
    readonly imageData = input.required<ImagePreviewData>();
    readonly title = input<string>('IMAGE_PREVIEW.TITLE');

    readonly hide = output();

    readonly imageLoaded = signal(false);
    readonly imageError = signal(false);

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

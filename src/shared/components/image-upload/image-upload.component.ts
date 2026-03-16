import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
    signal,
    ElementRef,
    viewChild,
    inject,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { ImageUploadStateService } from './domain/services/image-upload-state.service';
import {
    DEFAULT_IMAGE_UPLOAD_CONFIG,
    ImageUploadConfig,
    ImageUploadError,
    ImageSelectedResult,
    ImageUploadStatus,
    PLATFORM_ASPECT_RATIOS,
    PLATFORM_RATIO_LABELS,
    PLATFORM_ICONS,
} from './domain/types/image-upload.types';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        TooltipModule,
        ButtonModule,
        BadgeModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent implements ControlValueAccessor {
    readonly store = inject(ImageUploadStateService);
    readonly config = input<ImageUploadConfig>(DEFAULT_IMAGE_UPLOAD_CONFIG);

    readonly imageSelected = output<ImageSelectedResult>();
    readonly imageError = output<ImageUploadError>();
    readonly viewImage = output();
    readonly imageCleared = output();

    readonly status = signal<ImageUploadStatus>('idle');
    readonly validationError = signal<ImageUploadError | null>(null);
    readonly disabled = signal(false);

    private readonly fileInputRef =
        viewChild<ElementRef<HTMLInputElement>>('fileInput');

    private onChange: (value: File | null) => void = () => {
        /* empty */
    };
    private onTouched: () => void = () => {
        /* empty */
    };

    /* private createPreview(file: File): void {
        const url = URL.createObjectURL(file);
        this.previewUrl.set(url);
    }
    readonly fileName = signal<string | null>(null);
    readonly fileSize = signal<number | null>(null); */

    readonly displayFormats = computed(() => {
        return this.config()
            .acceptedTypes.map((type) =>
                type.replace('image/', '').toUpperCase()
            )
            .join(', ');
    });

    readonly formatBadges = computed(() => {
        return this.config().acceptedTypes.map((type) => ({
            original: type,
            display: type.replace('image/', '').toUpperCase(),
            icon: this.getFormatIcon(type),
        }));
    });

    readonly acceptAttribute = computed(() =>
        this.config().acceptedTypes.join(',')
    );

    readonly maxSizeMb = computed(() =>
        (this.config().maxSizeBytes / (1024 * 1024)).toFixed(0)
    );

    readonly hasCroppedImage = computed(() => this.store.hasCroppedImage());

    readonly fileName = computed(() => {
        const sourceFile = this.store.cropperSourceFile();
        return sourceFile?.name ?? null;
    });

    readonly fileSize = computed(() => {
        const sourceFile = this.store.cropperSourceFile();
        return sourceFile?.size ?? null;
    });

    readonly fileSizeMb = computed(() => {
        const size = this.fileSize();
        if (!size) {
            return null;
        }
        return size < 1024 * 1024
            ? `${(size / 1024).toFixed(0)} Ko`
            : `${(size / (1024 * 1024)).toFixed(1)} Mo`;
    });

    readonly platformHints = computed(() => {
        return this.config().targetPlatforms.map((p) => ({
            platform: p,
            label: PLATFORM_RATIO_LABELS[p],
            icon: PLATFORM_ICONS[p],
            ratio: PLATFORM_ASPECT_RATIOS[p],
        }));
    });

    readonly hasError = computed(() => this.status() === 'error');
    readonly isIdle = computed(
        () => !this.hasCroppedImage() && this.status() !== 'error'
    );

    private getFormatIcon(type: string): string {
        const format = type.replace('image/', '');
        switch (format) {
            case 'png':
                return 'pi pi-image';
            case 'jpeg':
            case 'jpg':
                return 'pi pi-file';
            case 'webp':
                return 'pi pi-globe';
            case 'gif':
                return 'pi pi-video';
            default:
                return 'pi pi-file';
        }
    }

    public openPreview(): void {
        this.viewImage.emit();
    }

    public openFilePicker(): void {
        this.fileInputRef()?.nativeElement?.click();
    }

    public onFileInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';
        if (!file) {
            return;
        }
        this.processFile(file, event);
    }

    public clearFile(event: Event): void {
        event.stopPropagation();
        this.store.resetImage();
        this.status.set('idle');
        this.validationError.set(null);
        this.onChange(null);
        this.onTouched();
        this.imageCleared.emit();
    }

    private processFile(file: File, event: Event): void {
        this.onTouched();

        if (!this.config().acceptedTypes.includes(file.type)) {
            const error: ImageUploadError = {
                type: 'INVALID_TYPE',
                file,
                acceptedTypes: this.config().acceptedTypes,
            };
            this.setError(error);
            return;
        }

        if (file.size > this.config().maxSizeBytes) {
            const error: ImageUploadError = {
                type: 'FILE_TOO_LARGE',
                file,
                maxSizeBytes: this.config().maxSizeBytes,
                actualSizeBytes: file.size,
            };
            this.setError(error);
            return;
        }

        this.status.set('selected');
        this.validationError.set(null);
        this.onChange(file);

        this.imageSelected.emit({ file, event: event });
    }

    private setError(error: ImageUploadError): void {
        this.status.set('error');
        this.validationError.set(error);
        this.onChange(null);
        this.imageError.emit(error);
    }

    public writeValue(value: File | null): void {
        if (value) {
            this.status.set('selected');
        } else {
            this.status.set('idle');
        }
    }

    public registerOnChange(fn: (value: File | null) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
}

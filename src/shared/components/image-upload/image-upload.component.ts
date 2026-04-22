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
    forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { ImageUploadStateService } from './domain/services/image-upload-state.service';
import {
    DEFAULT_IMAGE_UPLOAD_CONFIG,
    ImageUploadConfig,
    ImageUploadError,
    PLATFORM_ASPECT_RATIOS,
    PLATFORM_RATIO_LABELS,
    PLATFORM_ICONS,
} from './domain/types/image-upload.types';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss'],
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ImageUploadComponent),
            multi: true,
        },
    ],
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
    readonly service = inject(ImageUploadStateService);

    readonly config = input<ImageUploadConfig>(DEFAULT_IMAGE_UPLOAD_CONFIG);
    readonly instanceId = input.required<string>();

    readonly imageCleared = output();
    readonly imageError = output<ImageUploadError>();
    readonly viewImage = output();

    readonly vm = computed(() => this.service.connect(this.instanceId()));

    readonly disabled = signal(false);
    readonly validationError = signal<ImageUploadError | null>(null);

    private readonly fileInputRef =
        viewChild<ElementRef<HTMLInputElement>>('fileInput');

    private onChange: (value: File | null) => void = () => {
        /* empty */
    };
    private onTouched: () => void = () => {
        /* empty */
    };

    readonly isIdle = computed(
        () => !this.vm().hasImage() && !this.vm().hasError()
    );

    readonly hasError = computed(() => this.vm().hasError());
    readonly hasImage = computed(() => this.vm().hasImage());

    readonly fileName = computed(() => this.vm().fileName() ?? null);
    readonly fileSize = computed(() => this.vm().fileSize() ?? null);

    readonly fileSizeMb = computed(() => {
        const size = this.vm().fileSize();
        if (!size) {
            return null;
        }

        return size < 1024 * 1024
            ? `${(size / 1024).toFixed(0)} Ko`
            : `${(size / (1024 * 1024)).toFixed(1)} Mo`;
    });

    readonly previewUrl = computed(() => this.vm().previewUrl());

    readonly displayFormats = computed(() => {
        return this.config()
            .acceptedTypes.map((type) =>
                type.replace('image/', '').toUpperCase()
            )
            .join(', ');
    });

    readonly acceptAttribute = computed(() =>
        this.config().acceptedTypes.join(',')
    );

    readonly maxSizeMb = computed(() =>
        (this.config().maxSizeBytes / (1024 * 1024)).toFixed(0)
    );

    readonly formatBadges = computed(() => {
        return this.config().acceptedTypes.map((type) => ({
            original: type,
            display: type.replace('image/', '').toUpperCase(),
            icon: this.getFormatIcon(type),
        }));
    });

    readonly platformHints = computed(() => {
        return this.config().targetPlatforms.map((p) => ({
            platform: p,
            label: PLATFORM_RATIO_LABELS[p],
            icon: PLATFORM_ICONS[p],
            ratio: PLATFORM_ASPECT_RATIOS[p],
        }));
    });

    public openFilePicker(): void {
        this.fileInputRef()?.nativeElement?.click();
    }

    public onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';
        if (!file) {
            return;
        }
        this.onTouched();
        this.processFile(file);
    }

    private processFile(file: File): void {
        const config = this.config();

        if (!config.acceptedTypes.includes(file.type)) {
            return this.setError({
                type: 'INVALID_TYPE',
                file,
                acceptedTypes: config.acceptedTypes,
            });
        }

        if (file.size > config.maxSizeBytes) {
            return this.setError({
                type: 'FILE_TOO_LARGE',
                file,
                maxSizeBytes: config.maxSizeBytes,
                actualSizeBytes: file.size,
            });
        }

        this.validationError.set(null);
        this.service.openCropper(this.instanceId(), file);
        this.onChange(file);
    }

    public clearFile(event: Event): void {
        event.stopPropagation();
        this.service.reset(this.instanceId());
        this.validationError.set(null);
        this.onChange(null);
        this.onTouched();
        this.imageCleared.emit();
    }

    public openPreview(): void {
        this.viewImage.emit();
    }

    private setError(error: ImageUploadError): void {
        this.validationError.set(error);
        this.onChange(null);
        this.imageError.emit(error);
    }

    writeValue(file: File | null): void {
        if (!file) {
            this.service.reset(this.instanceId());
            return;
        }
        console.log('writeValue called', file);

        const preview = URL.createObjectURL(file);
        this.service.hydrate(this.instanceId(), preview);
    }

    public registerOnChange(fn: (value: File | null) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

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
}

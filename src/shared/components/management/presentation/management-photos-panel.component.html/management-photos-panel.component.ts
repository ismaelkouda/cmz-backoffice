import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    computed,
    ChangeDetectionStrategy,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ImageZoomComponent } from '@shared/components/image-zoom/image-zoom.component';

@Component({
    selector: 'app-management-photos-panel',
    standalone: true,
    imports: [CommonModule, TranslateModule, ImageZoomComponent],
    templateUrl: './management-photos-panel.component.html',
    styleUrls: ['./management-photos-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementPhotosPanelComponent {
    public readonly item = input.required<any>();
    public readonly loading = input.required<boolean>();

    protected readonly placePhoto = computed((): string | null => {
        return this.item()?.placePhoto ?? null;
    });

    protected readonly accessPhoto = computed((): string | null => {
        return this.item()?.accessPlacePhoto ?? null;
    });

    protected readonly placeDescription = computed((): string | null => {
        return this.item()?.placeDescription ?? null;
    });

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
}

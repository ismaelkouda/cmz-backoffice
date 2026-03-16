import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    computed,
    ChangeDetectionStrategy,
    output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { operatorsTagStyle } from '@shared/domain/functions/operators-tag-style.function';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-management-info-panel',
    standalone: true,
    imports: [
        CommonModule,
        SkeletonModule,
        TranslateModule,
        TagModule,
        TooltipModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './management-info-panel.component.html',
    styleUrls: ['./management-info-panel.component.scss'],
})
export class ManagementInfoPanelComponent {
    public readonly item = input.required<any>();
    public readonly loading = input.required<boolean>();

    public readonly copy = output<string>();

    protected readonly coordinates = computed((): string => {
        const currentItem = this.item();
        if (!currentItem?.location?.coordinates) {
            return '';
        }

        const { latitude, longitude } = currentItem.location.coordinates;
        return latitude && longitude ? `${latitude}, ${longitude}` : '';
    });

    protected onCopyCoordinates(): void {
        const coords = this.coordinates();
        if (coords) {
            this.copy.emit(coords);
        }
    }

    protected getOperatorTagStyle(operator: string): Record<string, string> {
        return operatorsTagStyle(operator);
    }
}

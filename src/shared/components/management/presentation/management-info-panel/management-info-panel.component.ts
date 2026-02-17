import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    computed,
    ChangeDetectionStrategy,
    output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { operatorsTagStyle } from '@shared/domain/functions/operators-tag-style.function';

@Component({
    selector: 'app-management-info-panel',
    standalone: true,
    imports: [CommonModule, TranslateModule, TagModule, TooltipModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './management-info-panel.component.html',
    styleUrls: ['./management-info-panel.component.scss'],
})
export class ManagementInfoPanelComponent {
    public readonly item = input.required<any>();
    public readonly loading = input<boolean>(false);
    public readonly showCommentSections = input<boolean>(true);

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

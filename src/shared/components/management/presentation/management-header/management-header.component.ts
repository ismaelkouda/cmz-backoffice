import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    output,
    computed,
    ChangeDetectionStrategy,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TypeReport } from '@shared/domain/enums/type-report.enum';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';

import { ManagementEntityType } from '../../domain/types/management-entity.type';

@Component({
    selector: 'app-management-header',
    standalone: true,
    imports: [CommonModule, TranslateModule, SkeletonModule, TooltipModule],
    templateUrl: `./management-header.component.html`,
    styleUrls: ['./management-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementHeaderComponent {
    public readonly item = input.required<ManagementEntityType>();
    public readonly uniqId = input.required<string>();
    public readonly loading = input.required<boolean>();

    public readonly copyItem = output<string>();

    protected readonly mainTitle = computed((): string => {
        return this.item()?.title ?? '';
    });

    protected readonly isReport = computed((): boolean => {
        const item = this.item();
        if (!item || !item.type) {
            return false;
        }

        console.log('item: ', item);
        console.log('item?.type: ', item?.type);

        return (
            item?.type === TypeReport.PROCESSING ||
            item?.type === TypeReport.FINALIZATION
        );
    });

    protected readonly confirmCount = computed((): number => {
        return this.item()?.confirmCount ?? 0;
    });

    protected onCopyId(): void {
        const id = this.uniqId();
        if (id) {
            this.copyItem.emit(id);
        }
    }
}

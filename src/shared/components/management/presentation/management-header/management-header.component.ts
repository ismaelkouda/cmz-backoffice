import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    output,
    computed,
    ChangeDetectionStrategy,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { State as FinalizationState } from '@pages/finalization/domain/enums/details/details-state/details-state.enum';
import { State as ProcessingState } from '@pages/processing/domain/enums/details/details-state/details-state.enum';
import { Status } from '@pages/requests/domain/enums/details/details-status/details-status.enum';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { ManagementEntityType } from '../../domain/types/management-entity.type';

@Component({
    selector: 'app-management-header',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        SkeletonModule,
        TooltipModule,
        TagModule,
    ],
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

        return (
            item?.type === TypeReport.PROCESSING ||
            item?.type === TypeReport.FINALIZATION
        );
    });

    protected readonly confirmCount = computed((): number => {
        return this.item()?.confirmCount ?? 0;
    });

    protected readonly source = computed((): ReportSource | undefined => {
        return this.item()?.source;
    });

    protected readonly status = computed(
        (): ProcessingState | FinalizationState | Status | undefined => {
            return this.item()?.dialogState;
        }
    );

    protected onCopyId(): void {
        const id = this.uniqId();
        if (id) {
            this.copyItem.emit(id);
        }
    }
}

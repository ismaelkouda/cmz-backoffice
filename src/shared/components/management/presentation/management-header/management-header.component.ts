import { CommonModule } from '@angular/common';
import {
    Component,
    input,
    output,
    computed,
    ChangeDetectionStrategy,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-management-header',
    standalone: true,
    imports: [CommonModule, TranslateModule, SkeletonModule, TooltipModule],
    templateUrl: `./management-header.component.html`,
    styleUrls: ['./management-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementHeaderComponent {
    public readonly item = input.required<any>();
    public readonly uniqId = input.required<string>();
    public readonly loading = input.required<boolean>();

    public readonly copyItem = output<string>();

    protected readonly mainTitle = computed((): string => {
        return this.item()?.title ?? '';
    });

    protected readonly isReport = computed((): boolean => {
        const item = this.item();
        return !!(item?.inProcessing || item?.inFinalization);
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

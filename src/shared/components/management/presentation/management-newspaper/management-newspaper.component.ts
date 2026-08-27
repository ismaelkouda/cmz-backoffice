import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
    OnDestroy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReportNewspaperFacade } from '@shared/components/report-newspaper/application/services/report-newspaper.facade';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-management-newspaper',
    standalone: true,
    imports: [TranslateModule, DatePipe, SkeletonModule, TableModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './management-newspaper.component.html',
    styleUrls: ['./management-newspaper.component.scss'],
})
export class ManagementNewspaperComponent implements OnDestroy {
    readonly uniqId = input.required<string>();

    private readonly facade = inject(ReportNewspaperFacade);

    protected readonly items = computed(() => this.facade.items() ?? []);
    protected readonly loading = this.facade.loading;
    protected readonly error = this.facade.error;

    protected readonly skeletonRows = [1, 2, 3, 4, 5];

    private lastLoadedUniqId: string | null = null;

    constructor() {
        effect(() => {
            const currentUniqId = this.uniqId();
            if (currentUniqId && currentUniqId !== this.lastLoadedUniqId) {
                this.lastLoadedUniqId = currentUniqId;
                this.facade.read(
                    { uniqId: currentUniqId },
                    { forceRefresh: true }
                );
            }
        });
    }

    ngOnDestroy(): void {
        this.facade.reset();
        this.lastLoadedUniqId = null;
    }
}

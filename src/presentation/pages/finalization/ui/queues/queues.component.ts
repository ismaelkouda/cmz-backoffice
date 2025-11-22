import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { QueuesFacade } from '@presentation/pages/finalization/application/queues.facade';
import { QueuesFilter } from '@presentation/pages/finalization/domain/value-objects/queues-filter.vo';
import { FilterQueuesComponent } from '@presentation/pages/finalization/feature/queues/filter-queues/filter-queues.component';
import { TableQueuesComponent } from '@presentation/pages/finalization/feature/queues/table-queues/table-queues.component';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable, Subject, takeUntil } from 'rxjs';
import { QueuesFilterPayloadEntity } from '../../domain/entities/queues/queues-filter-payload.entity';
import { QueuesEntity } from '../../domain/entities/queues/queues.entity';

@Component({
    selector: 'app-queues',
    standalone: true,
    templateUrl: './queues.component.html',
    styleUrls: ['./queues.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterQueuesComponent,
        TableQueuesComponent,
        ManagementComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueuesComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<QueuesEntity>>;
    public queues$!: Observable<QueuesEntity[]>;
    public spinner$!: Observable<boolean>;
    private readonly destroy$ = new Subject<void>();
    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly queuesFacade: QueuesFacade
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'REPORTS_PROCESSING.QUEUES.TITLE'
                );
                this.module = data['module'] ?? 'REPORTS_PROCESSING.LABEL';
                this.subModule =
                    data['subModule'] ?? 'REPORTS_PROCESSING.QUEUES.LABEL';
            });

        this.queues$ = this.queuesFacade.queues$;
        this.pagination$ = this.queuesFacade.pagination$;
        this.spinner$ = this.queuesFacade.isLoading$;

        const defaultFilter = QueuesFilter.create({
            created_from: '',
            created_to: '',
        });

        this.queuesFacade.fetchQueues(defaultFilter);
    }

    public filter(filterData: QueuesFilterPayloadEntity): void {
        const filter = QueuesFilter.create(filterData);
        this.queuesFacade.fetchQueues(filter);
    }

    public onPageChange(event: number): void {
        this.queuesFacade.changePage(event + 1);
    }

    public onQueuesAction(item: QueuesEntity): void {
        this.selectedReportId = item.uniqId;
        this.reportTreatmentVisible = true;
    }

    public onReportTreatmentQueuesd(): void {
        this.reportTreatmentVisible = false;
        this.selectedReportId = null;
    }

    public onQueuesJournal(item: QueuesEntity): void {
        // Journal modal integration will be implemented later.
        console.log('Journal requested for:', item.uniqId);
    }

    public refreshQueues(): void {
        this.queuesFacade.refresh();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

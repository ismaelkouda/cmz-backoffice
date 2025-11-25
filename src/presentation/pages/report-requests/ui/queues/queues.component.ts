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
import { QueuesFacade } from '@presentation/pages/report-requests/application/queues.facade';
import { QueuesFilterPayloadEntity } from '@presentation/pages/report-requests/domain/entities/queues/queues-filter-payload.entity';
import { QueuesEntity } from '@presentation/pages/report-requests/domain/entities/queues/queues.entity';
import { QueuesFilter } from '@presentation/pages/report-requests/domain/value-objects/queues-filter.vo';
import { FilterQueuesComponent } from '@presentation/pages/report-requests/feature/queues/filter-queues/filter-queues.component';
import { TableQueuesComponent } from '@presentation/pages/report-requests/feature/queues/table-queues/table-queues.component';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable, Subject, takeUntil } from 'rxjs';

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
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly queuesFacade = inject(QueuesFacade);
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<QueuesEntity>>;
    public queues$!: Observable<QueuesEntity[]>;
    public loading$!: Observable<boolean>;
    private readonly destroy$ = new Subject<void>();
    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;

    ngOnInit(): void {
        this.setupRouteData();
        this.setupObservables();
        this.loadData();
    }

    private loadData(): void {
        const defaultFilter = QueuesFilter.create(
            {} as QueuesFilterPayloadEntity
        );
        this.queuesFacade.fetchQueues(defaultFilter, '1', false);
    }

    private setupRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'REPORTS_REQUESTS.QUEUES.TITLE'
                );
                this.module = data['module'] ?? 'REPORTS_REQUESTS.LABEL';
                this.subModule =
                    data['subModule'] ?? 'REPORTS_REQUESTS.QUEUES.LABEL';
            });
    }

    private setupObservables(): void {
        this.queues$ = this.queuesFacade.queues$;
        this.pagination$ = this.queuesFacade.pagination$;
        this.loading$ = this.queuesFacade.isLoading$;
    }

    public filter(filterData: QueuesFilterPayloadEntity): void {
        const filter = QueuesFilter.create(filterData);
        this.queuesFacade.fetchQueues(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.queuesFacade.changePage(event + 1);
    }

    public onQueuesAction(item: QueuesEntity): void {
        this.selectedReportId = item.uniqId;
        this.reportTreatmentVisible = true;
    }

    public onReportTreatmentClosed(): void {
        this.reportTreatmentVisible = false;
        this.selectedReportId = null;
    }

    public refreshQueues(): void {
        this.queuesFacade.refresh();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

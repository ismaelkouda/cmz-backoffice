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
import { QueueFacade } from '@pages/reports-processing/application/queue.facade';
import { QueueFilter } from '@presentation/pages/reports-processing/domain/value-objects/queue-filter.vo';
import { FilterQueueComponent } from '@presentation/pages/reports-processing/feature/queue/filter-queue/filter-queue.component';
import { TableQueueComponent } from '@presentation/pages/reports-processing/feature/queue/table-queue/table-queue.component';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable, Subject, takeUntil } from 'rxjs';
import { QueueFilterPayloadEntity } from '../../domain/entities/queue/queue-filter-payload.entity';
import { QueueEntity } from '../../domain/entities/queue/queue.entity';

@Component({
    selector: 'app-queue',
    standalone: true,
    templateUrl: './queue.component.html',
    styleUrls: ['./queue.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterQueueComponent,
        TableQueueComponent,
        ManagementComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueueComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<QueueEntity>>;
    public queues$!: Observable<QueueEntity[]>;
    public spinner$!: Observable<boolean>;
    private readonly destroy$ = new Subject<void>();
    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly queueFacade: QueueFacade
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'REPORT_PROCESSING.QUEUE.TITLE'
                );
                this.module = data['module'] ?? 'REPORT_PROCESSING.LABEL';
                this.subModule =
                    data['subModule'] ?? 'REPORT_PROCESSING.QUEUE.LABEL';
            });

        this.queues$ = this.queueFacade.queues$;
        this.pagination$ = this.queueFacade.pagination$;
        this.spinner$ = this.queueFacade.isLoading$;

        const defaultFilter = QueueFilter.create({
            created_from: '',
            created_to: '',
        });

        this.queueFacade.fetchQueue(defaultFilter);
    }

    public filter(filterData: QueueFilterPayloadEntity): void {
        const filter = QueueFilter.create(filterData);
        this.queueFacade.fetchQueue(filter);
    }

    public onPageChange(event: number): void {
        this.queueFacade.changePage(event + 1);
    }

    public onQueueAction(item: QueueEntity): void {
        this.selectedReportId = item.uniqId;
        this.reportTreatmentVisible = true;
    }

    public onReportTreatmentQueued(): void {
        this.reportTreatmentVisible = false;
        this.selectedReportId = null;
    }

    public onQueueJournal(item: QueueEntity): void {
        // Journal modal integration will be implemented later.
        console.log('Journal requested for:', item.uniqId);
    }

    public refreshQueues(): void {
        this.queueFacade.refresh();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

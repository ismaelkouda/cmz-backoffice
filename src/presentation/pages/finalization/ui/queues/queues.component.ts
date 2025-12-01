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
import { ManagementFacade } from '@presentation/pages/reports-processing/application/management.facade';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
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
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly queuesFacade = inject(QueuesFacade);
    private readonly managementFacade = inject(ManagementFacade);
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
                    data['title'] ?? 'FINALIZATION.QUEUES.TITLE'
                );
                this.module = data['module'] ?? 'FINALIZATION.LABEL';
                this.subModule =
                    data['subModule'] ?? 'FINALIZATION.QUEUES.LABEL';
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
        console.log("onQueuesAction", item);
        this.selectedReportId = item.uniqId;
        this.reportTreatmentVisible = true;
    }

    public onReportTreatmentQueues(): void {
        this.reportTreatmentVisible = false;
        this.selectedReportId = null;
    }

    public onQueuesTake(item: QueuesEntity): void {
        this.managementFacade.take(
            { decision: '', reason: '', comment: '', uniqId: item.uniqId },
            'reports-processing'
        );
    }

    public refreshQueues(): void {
        this.queuesFacade.refresh();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

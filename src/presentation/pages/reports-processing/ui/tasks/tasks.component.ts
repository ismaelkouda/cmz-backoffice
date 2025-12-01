import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TasksFacade } from '@presentation/pages/reports-processing/application/tasks.facade';
import { TasksFilter } from '@presentation/pages/reports-processing/domain/value-objects/tasks-filter.vo';
import { FilterTasksComponent } from '@presentation/pages/reports-processing/feature/tasks/filter-tasks/filter-tasks.component';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TasksFilterPayloadEntity } from '../../domain/entities/tasks/tasks-filter-payload.entity';
import { TasksEntity } from '../../domain/entities/tasks/tasks.entity';
import {
    TableTasksComponent,
    TreatmentRequested,
} from '../../feature/tasks/table-tasks/table-tasks.component';

@Component({
    selector: 'app-tasks',
    standalone: true,
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterTasksComponent,
        TableTasksComponent,
        ManagementComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly tasksFacade = inject(TasksFacade);
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<TasksEntity>>;
    public tasks$!: Observable<TasksEntity[]>;
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
        const defaultFilter = TasksFilter.create(
            {} as TasksFilterPayloadEntity
        );
        this.tasksFacade.fetchTasks(defaultFilter, '1', false);
    }

    private setupRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'REPORTS_PROCESSING.TASKS.TITLE'
                );
                this.module = data['module'] ?? 'REPORTS_PROCESSING.LABEL';
                this.subModule =
                    data['subModule'] ?? 'REPORTS_PROCESSING.TASKS.LABEL';
            });
    }

    private setupObservables(): void {
        this.tasks$ = this.tasksFacade.tasks$;
        this.pagination$ = this.tasksFacade.pagination$;
        this.loading$ = this.tasksFacade.isLoading$;
    }

    public filter(filterData: TasksFilterPayloadEntity): void {
        const filter = TasksFilter.create(filterData);
        this.tasksFacade.fetchTasks(filter);
    }

    public onPageChange(event: number): void {
        this.tasksFacade.changePage(event + 1);
    }

    public onTasksAction({
        item,
        action,
    }: {
        item: TasksEntity;
        action: TreatmentRequested;
    }): void {
        if (action === 'treat') {
            this.selectedReportId = item.uniqId;
            this.reportTreatmentVisible = true;
        } else if (action === 'action') {
            this.router.navigate([item.uniqId], {
                relativeTo: this.activatedRoute,
            });
        }
    }

    public onReportTreatmentTasksd(): void {
        this.reportTreatmentVisible = false;
        this.selectedReportId = null;
    }

    public refreshTasks(): void {
        this.tasksFacade.refresh();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

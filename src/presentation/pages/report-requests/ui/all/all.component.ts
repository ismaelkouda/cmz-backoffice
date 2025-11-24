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
import { AllFacade } from '@presentation/pages/report-requests/application/all.facade';
import { AllEntity } from '@presentation/pages/report-requests/domain/entities/all/all.entity';
import { AllFilter } from '@presentation/pages/report-requests/domain/value-objects/all-filter.vo';
import { FilterAllComponent } from '@presentation/pages/report-requests/feature/all/filter-all/filter-all.component';
import { TableAllComponent } from '@presentation/pages/report-requests/feature/all/table-all/table-all.component';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AllFilterPayloadEntity } from '../../domain/entities/all/all-filter-payload.entity';

@Component({
    selector: 'app-all',
    standalone: true,
    templateUrl: './all.component.html',
    styleUrls: ['./all.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterAllComponent,
        TableAllComponent,
        ManagementComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<AllEntity>>;
    public all$!: Observable<AllEntity[]>;
    public loading$!: Observable<boolean>;
    private readonly destroy$ = new Subject<void>();
    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly allFacade: AllFacade
    ) {}

    ngOnInit(): void {
        this.setupRouteData();
        this.setupObservables();
        this.loadDataIntelligently();
    }

    private loadDataIntelligently(): void {
        const defaultFilter = AllFilter.create({} as AllFilterPayloadEntity);
        this.allFacade.fetchAll(defaultFilter, '1', false);
    }

    private setupRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'REPORTS_REQUESTS.ALL.TITLE'
                );
                this.module = data['module'] ?? 'REPORTS_REQUESTS.LABEL';
                this.subModule =
                    data['subModule'] ?? 'REPORTS_REQUESTS.ALL.LABEL';
            });
    }

    private setupObservables(): void {
        this.all$ = this.allFacade.all$;
        this.pagination$ = this.allFacade.pagination$;
        this.loading$ = this.allFacade.isLoading$;
    }

    public filter(filterData: AllFilterPayloadEntity): void {
        const filter = AllFilter.create(filterData);
        this.allFacade.fetchAll(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.allFacade.changePage(event + 1);
    }

    public onAllAction(item: AllEntity): void {
        this.selectedReportId = item.uniqId;
        this.reportTreatmentVisible = true;
    }

    public onReportTreatmentClosed(): void {
        this.reportTreatmentVisible = false;
        this.selectedReportId = null;
    }

    public refreshAll(): void {
        this.allFacade.refresh();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

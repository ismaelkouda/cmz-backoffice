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
import { AllFacade } from '@presentation/pages/reports-processing/application/all.facade';
import { AllEntity } from '@presentation/pages/reports-processing/domain/entities/all/all.entity';
import { AllFilter } from '@presentation/pages/reports-processing/domain/value-objects/all-filter.vo';
import { FilterAllComponent } from '@presentation/pages/reports-processing/feature/all/filter-all/filter-all.component';
import { TableAllComponent } from '@presentation/pages/reports-processing/feature/all/table-all/table-all.component';
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
    public spinner$!: Observable<boolean>;
    private readonly destroy$ = new Subject<void>();
    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly allFacade: AllFacade
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'REPORTS_PROCESSING.ALL.TITLE'
                );
                this.module = data['module'] ?? 'REPORTS_PROCESSING.LABEL';
                this.subModule =
                    data['subModule'] ?? 'REPORTS_PROCESSING.ALL.LABEL';
            });

        this.all$ = this.allFacade.all$;
        this.pagination$ = this.allFacade.pagination$;
        this.spinner$ = this.allFacade.isLoading$;

        const defaultFilter = AllFilter.create({
            created_from: '',
            created_to: '',
        });
        this.allFacade.fetchAll(defaultFilter);
    }

    public filter(filterData: AllFilterPayloadEntity): void {
        const filter = AllFilter.create(filterData);
        this.allFacade.fetchAll(filter);
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

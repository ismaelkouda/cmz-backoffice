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
import { WaitingFacade } from '@presentation/pages/report-requests/application/waiting.facade';
import { WaitingFilterPayloadEntity } from '@presentation/pages/report-requests/domain/entities/waiting/waiting-filter-payload.entity';
import {
    TQueueManagementParams,
    WaitingEntity,
} from '@presentation/pages/report-requests/domain/entities/waiting/waiting.entity';
import { WaitingFilter } from '@presentation/pages/report-requests/domain/value-objects/waiting-filter.vo';
import { FilterWaitingComponent } from '@presentation/pages/report-requests/feature/waiting/filter-waiting/filter-waiting.component';
import { TableWaitingComponent } from '@presentation/pages/report-requests/feature/waiting/table-waiting/table-waiting.component';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-waiting',
    standalone: true,
    templateUrl: './waiting.component.html',
    styleUrls: ['./waiting.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterWaitingComponent,
        TableWaitingComponent,
        ManagementComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitingComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<WaitingEntity>>;
    public listWaiting$!: Observable<WaitingEntity[]>;
    public isLoading$!: Observable<boolean>;
    private readonly destroy$ = new Subject<void>();
    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;
    public selectManagementParams!: TQueueManagementParams;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly waitingFacade: WaitingFacade
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'REPORT_REQUESTS.WAITING.TITLE'
                );
                this.module = data['module'] ?? 'REPORT_REQUESTS.LABEL';
                this.subModule =
                    data['subModule'] ?? 'REPORT_REQUESTS.WAITING.LABEL';
            });

        this.listWaiting$ = this.waitingFacade.waiting$;
        this.pagination$ = this.waitingFacade.pagination$;
        this.isLoading$ = this.waitingFacade.isLoading$;

        const defaultFilter = WaitingFilter.create({
            created_from: '',
            created_to: '',
        });
        this.waitingFacade.fetchWaiting(defaultFilter);
    }

    public filter(filterData: WaitingFilterPayloadEntity): void {
        const filter = WaitingFilter.create(filterData);
        this.waitingFacade.fetchWaiting(filter);
    }

    public onPageChange(event: number): void {
        this.waitingFacade.changePage(event + 1);
    }

    public onWaitingAction(item: WaitingEntity): void {
        this.selectedReportId = item.uniqId;
        this.selectManagementParams = item.managementParams();
        this.reportTreatmentVisible = true;
    }

    public onReportTreatmentClosed(): void {
        this.reportTreatmentVisible = false;
        this.selectedReportId = null;
    }

    public refreshWaiting(): void {
        this.waitingFacade.refresh();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

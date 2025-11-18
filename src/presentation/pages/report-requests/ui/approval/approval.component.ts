import { CommonModule } from '@angular/common';
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
import { ApprovalFacade } from '@presentation/pages/report-requests/application/approval.facade';
import { ApprovalEntity } from '@presentation/pages/report-requests/domain/entities/approval/approval.entity';
import { ApprovalFilter } from '@presentation/pages/report-requests/domain/value-objects/approval-filter.vo';
import { FilterApprovalComponent } from '@presentation/pages/report-requests/feature/approval/filter-approval/filter-approval.component';
import { TableApprovalComponent } from '@presentation/pages/report-requests/feature/approval/table-approval/table-approval.component';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApprovalFilterPayloadEntity } from '../../domain/entities/approval/approval-filter-payload.entity';

@Component({
    selector: 'app-approval',
    standalone: true,
    templateUrl: './approval.component.html',
    styleUrls: ['./approval.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterApprovalComponent,
        TableApprovalComponent,
        ManagementComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<ApprovalEntity>>;
    public approvals$!: Observable<ApprovalEntity[]>;
    public spinner$!: Observable<boolean>;
    private readonly destroy$ = new Subject<void>();
    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly approvalFacade: ApprovalFacade
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'REPORT_REQUESTS.APPROVAL.TITLE'
                );
                this.module = data['module'] ?? 'REPORT_REQUESTS.LABEL';
                this.subModule =
                    data['subModule'] ?? 'REPORT_REQUESTS.APPROVAL.LABEL';
            });

        this.approvals$ = this.approvalFacade.approvals$;
        this.pagination$ = this.approvalFacade.pagination$;
        this.spinner$ = this.approvalFacade.isLoading$;

        const defaultFilter = ApprovalFilter.create({
            created_from: '',
            created_to: '',
        });

        this.approvalFacade.fetchApprovals(defaultFilter);
    }

    public filter(filterData: ApprovalFilterPayloadEntity): void {
        const filter = ApprovalFilter.create(filterData);
        this.approvalFacade.fetchApprovals(filter);
    }

    public onPageChange(event: number): void {
        this.approvalFacade.changePage(event + 1);
    }

    public onApprovalAction(item: ApprovalEntity): void {
        this.selectedReportId = item.uniqId;
        this.reportTreatmentVisible = true;
    }

    public onReportTreatmentClosed(): void {
        this.reportTreatmentVisible = false;
        this.selectedReportId = null;
    }

    public refreshApprovals(): void {
        this.approvalFacade.refresh();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

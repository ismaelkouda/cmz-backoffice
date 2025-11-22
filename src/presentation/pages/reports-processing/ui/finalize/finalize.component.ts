import { CommonModule } from '@angular/common';
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
import { FinalizeFacade } from '@pages/reports-processing/application/finalize.facade';
import { FinalizeFilter } from '@pages/reports-processing/domain/value-objects/finalize-filter.vo';
import { FilterFinalizeComponent } from '@pages/reports-processing/feature/finalize/filter-finalize/filter-finalize.component';
import { TableFinalizeComponent } from '@pages/reports-processing/feature/finalize/table-finalize/table-finalize.component';
import { FinalizeEntity } from '@presentation/pages/reports-processing/domain/entities/finalize/finalize.entity';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FinalizeFilterPayloadEntity } from '../../domain/entities/finalize/finalize-filter-payload.entity';
import { ManagementComponent } from '../management/management.component';

@Component({
    selector: 'app-finalize',
    standalone: true,
    templateUrl: './finalize.component.html',
    styleUrls: ['./finalize.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterFinalizeComponent,
        TableFinalizeComponent,
        ManagementComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalizeComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<FinalizeEntity>>;
    public finalizes$!: Observable<FinalizeEntity[]>;
    public spinner$!: Observable<boolean>;
    private readonly destroy$ = new Subject<void>();
    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly finalizeFacade: FinalizeFacade
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'REPORTS_PROCESSING.FINALIZE.TITLE'
                );
                this.module = data['module'] ?? 'REPORTS_PROCESSING.LABEL';
                this.subModule =
                    data['subModule'] ?? 'REPORTS_PROCESSING.FINALIZE.LABEL';
            });

        this.finalizes$ = this.finalizeFacade.finalizes$;
        this.pagination$ = this.finalizeFacade.pagination$;
        this.spinner$ = this.finalizeFacade.isLoading$;

        const defaultFilter = FinalizeFilter.create({
            created_from: '',
            created_to: '',
        });

        this.finalizeFacade.fetchFinalizes(defaultFilter);
    }

    public filter(filterData: FinalizeFilterPayloadEntity): void {
        const filter = FinalizeFilter.create(filterData);
        this.finalizeFacade.fetchFinalizes(filter);
    }

    public onPageChange(event: number): void {
        this.finalizeFacade.changePage(event + 1);
    }

    public onFinalizeAction(item: FinalizeEntity): void {
        this.selectedReportId = item.uniqId;
        this.reportTreatmentVisible = true;
    }

    public onReportTreatmentClosed(): void {
        this.reportTreatmentVisible = false;
        this.selectedReportId = null;
    }

    public refreshFinalizes(): void {
        this.finalizeFacade.refresh();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

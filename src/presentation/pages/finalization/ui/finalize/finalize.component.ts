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
import { FinalizeFacade } from '@pages/finalization/application/finalize.facade';
import { FinalizeFilter } from '@pages/finalization/domain/value-objects/finalize-filter.vo';
import { FilterFinalizeComponent } from '@pages/finalization/feature/finalize/filter-finalize/filter-finalize.component';
import { TableFinalizeComponent } from '@pages/finalization/feature/finalize/table-finalize/table-finalize.component';
import { FinalizeEntity } from '@presentation/pages/finalization/domain/entities/finalize/finalize.entity';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FinalizeFilterPayloadEntity } from '../../domain/entities/finalize/finalize-filter-payload.entity';

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
                    data['title'] ?? 'FINALIZATION.FINALIZE.TITLE'
                );
                this.module = data['module'] ?? 'FINALIZATION.LABEL';
                this.subModule =
                    data['subModule'] ?? 'FINALIZATION.FINALIZE.LABEL';
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

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
import { TreatmentFacade } from '@pages/reports-processing/application/treatment.facade';
import { TreatmentFilter } from '@pages/reports-processing/domain/value-objects/treatment-filter.vo';
import { FilterTreatmentComponent } from '@pages/reports-processing/feature/treatment/filter-treatment/filter-treatment.component';
import { TableTreatmentComponent } from '@pages/reports-processing/feature/treatment/table-treatment/table-treatment.component';
import { TreatmentEntity } from '@presentation/pages/reports-processing/domain/entities/treatment/treatment.entity';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TreatmentFilterPayloadEntity } from '../../domain/entities/treatment/treatment-filter-payload.entity';

@Component({
    selector: 'app-treatment',
    standalone: true,
    templateUrl: './treatment.component.html',
    styleUrls: ['./treatment.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterTreatmentComponent,
        TableTreatmentComponent,
        ManagementComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreatmentComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<TreatmentEntity>>;
    public treatments$!: Observable<TreatmentEntity[]>;
    public spinner$!: Observable<boolean>;
    private readonly destroy$ = new Subject<void>();

    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly treatmentFacade: TreatmentFacade
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'REPORTS_PROCESSING.TREATMENT.TITLE'
                );
                this.module = data['module'] ?? 'REPORTS_PROCESSING.LABEL';
                this.subModule =
                    data['subModule'] ?? 'REPORTS_PROCESSING.TREATMENT.LABEL';
            });

        this.treatments$ = this.treatmentFacade.treatments$;
        this.pagination$ = this.treatmentFacade.pagination$;
        this.spinner$ = this.treatmentFacade.isLoading$;

        const defaultFilter = TreatmentFilter.create({
            created_from: '',
            created_to: '',
        });

        this.treatmentFacade.fetchTreatments(defaultFilter);
    }

    public filter(filterData: TreatmentFilterPayloadEntity): void {
        const filter = TreatmentFilter.create(filterData);
        this.treatmentFacade.fetchTreatments(filter);
    }

    public onPageChange(event: number): void {
        this.treatmentFacade.changePage(event + 1);
    }

    public handleTreatment(item: TreatmentEntity): void {
        this.selectedReportId = item.uniqId;
        this.reportTreatmentVisible = true;
    }

    public onReportTreatmentClosed(): void {
        this.reportTreatmentVisible = false;
        this.selectedReportId = null;
    }

    public handleNewspaper(item: TreatmentEntity): void {
        // Journal modal integration will be implemented later.
        console.log('Journal requested for:', item.uniqId);
    }

    public refreshTreatments(): void {
        this.treatmentFacade.refresh();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

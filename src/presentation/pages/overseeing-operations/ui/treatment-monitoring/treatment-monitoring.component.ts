import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { BreadcrumbComponent } from 'shared/components/breadcrumb/breadcrumb.component';
import { ParginationComponent } from '../../../../../shared/components/pargination/pargination.component';
import { PatrimoineHeaderComponent } from '../../../../../shared/components/patrimoine-header/patrimoine-header.component';
import {
    LIST_REQUESTS_SERVICE,
    T_LIST_REQUESTS_SERVICE,
} from '../../../../../shared/enum/list-requests-service';
import { ApplicantInterface } from '../../../../../shared/interfaces/applicant';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { TreatmentMonitoringInterface } from '../../../../../shared/interfaces/treatment-monitoring.interface';
import {
    T_TREATMENT_MONITORING_STATE_ENUM,
    TREATMENT_MONITORING_STATE_ENUM,
} from '../../data-access/treatment-monitoring/enums/treatment-monitoring-state.enum';
import {
    T_TREATMENT_MONITORING_STEP_ENUM,
    TREATMENT_MONITORING_STEP_ENUM,
} from '../../data-access/treatment-monitoring/enums/treatment-monitoring-step.enum';
import { TreatmentMonitoringFilterInterface } from '../../data-access/treatment-monitoring/interfaces/treatment-monitoring-filter.interface';
import { TreatmentMonitoringApiService } from '../../data-access/treatment-monitoring/services/treatment-monitoring-api.service';
import { FilterTreatmentMonitoringComponent } from '../../feature/treatment-monitoring/filter-treatment-monitoring/filter-treatment-monitoring.component';
import { TableTreatmentMonitoringComponent } from '../../feature/treatment-monitoring/table-treatment-monitoring/table-treatment-monitoring.component';
import { SharedService } from './../../../../../shared/services/shared.service';

@Component({
    selector: 'app-treatment-monitoring',
    standalone: true,
    templateUrl: './treatment-monitoring.component.html',
    imports: [
        PatrimoineHeaderComponent,
        FilterTreatmentMonitoringComponent,
        TableTreatmentMonitoringComponent,
        ParginationComponent,
        BreadcrumbComponent,
        TranslateModule,
        AsyncPipe,
    ],
})
export class TreatmentMonitoringComponent implements OnInit, OnDestroy {
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<TreatmentMonitoringInterface>>;
    public listTreatmentMonitoring$!: Observable<
        Array<TreatmentMonitoringInterface>
    >;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();
    public listTreatmentMonitoringStep: Array<T_TREATMENT_MONITORING_STEP_ENUM> =
        Object.values(TREATMENT_MONITORING_STEP_ENUM);
    public listTreatmentMonitoringState: Array<T_TREATMENT_MONITORING_STATE_ENUM> =
        Object.values(TREATMENT_MONITORING_STATE_ENUM);

    public listOperations: Array<T_LIST_REQUESTS_SERVICE> = Object.values(
        LIST_REQUESTS_SERVICE
    );
    public listApplicants$!: Observable<Array<ApplicantInterface>>;

    constructor(
        private sharedService: SharedService,
        private activatedRoute: ActivatedRoute,
        private treatmentMonitoringApiService: TreatmentMonitoringApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data['module'];
            this.subModule = data['subModule'][1];
        });
        this.sharedService.fetchApplicants();
        this.listApplicants$ = this.sharedService.getApplicants();

        this.listTreatmentMonitoring$ =
            this.treatmentMonitoringApiService.getTreatmentMonitoring();
        this.pagination$ =
            this.treatmentMonitoringApiService.getTreatmentMonitoringPagination();

        combineLatest([
            this.treatmentMonitoringApiService.getDataFilterTreatmentMonitoring(),
            this.treatmentMonitoringApiService.getDataNbrPageTreatmentMonitoring(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.treatmentMonitoringApiService.fetchTreatmentMonitoring(
                filterData,
                nbrPageData
            );
        });
        this.treatmentMonitoringApiService
            .isLoadingTreatmentMonitoring()
            .subscribe((spinner) => {
                this.spinner = spinner;
            });
    }

    public filter(filterData: TreatmentMonitoringFilterInterface): void {
        this.treatmentMonitoringApiService.fetchTreatmentMonitoring(filterData);
    }

    public onPageChange(event: number): void {
        this.treatmentMonitoringApiService
            .getDataFilterTreatmentMonitoring()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.treatmentMonitoringApiService.fetchTreatmentMonitoring(
                    filterData,
                    JSON.stringify(event + 1)
                );
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

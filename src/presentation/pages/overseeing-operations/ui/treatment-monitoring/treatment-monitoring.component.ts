import { SharedService } from './../../../../../shared/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { TreatmentMonitoringFilterInterface } from '../../data-access/treatment-monitoring/interfaces/treatment-monitoring-filter.interface';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { TreatmentMonitoringApiService } from '../../data-access/treatment-monitoring/services/treatment-monitoring-api.service';
import { TreatmentMonitoringInterface } from '../../../../../shared/interfaces/treatment-monitoring.interface';
import {
    T_TREATMENT_MONITORING_STEP_ENUM,
    TREATMENT_MONITORING_STEP_ENUM,
} from '../../data-access/treatment-monitoring/enums/treatment-monitoring-step.enum';
import {
    T_TREATMENT_MONITORING_STATE_ENUM,
    TREATMENT_MONITORING_STATE_ENUM,
} from '../../data-access/treatment-monitoring/enums/treatment-monitoring-state.enum';
import {
    LIST_REQUESTS_SERVICE,
    T_LIST_REQUESTS_SERVICE,
} from '../../../../../shared/enum/list-requests-service';
import { ApplicantInterface } from '../../../../../shared/interfaces/applicant';

@Component({
    selector: 'app-treatment-monitoring',
    templateUrl: './treatment-monitoring.component.html',
})
export class TreatmentMonitoringComponent implements OnInit {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<TreatmentMonitoringInterface>>;
    public listTreatmentMonitoring$: Observable<
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
    public listApplicants$: Observable<Array<ApplicantInterface>>;

    constructor(
        private sharedService: SharedService,
        private activatedRoute: ActivatedRoute,
        private treatmentMonitoringApiService: TreatmentMonitoringApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[1];
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

import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TreatmentMonitoringFilterInterface } from '../../../data-access/treatment-monitoring/interfaces/treatment-monitoring-filter.interface';
import { TranslateService } from '@ngx-translate/core';
import { ApplicantInterface } from '../../../../../../shared/interfaces/applicant';
import { T_TREATMENT_MONITORING_STEP_ENUM } from '../../../data-access/treatment-monitoring/enums/treatment-monitoring-step.enum';
import { T_TREATMENT_MONITORING_STATE_ENUM } from '../../../data-access/treatment-monitoring/enums/treatment-monitoring-state.enum';
import { T_LIST_REQUESTS_SERVICE } from '../../../../../../shared/enum/list-requests-service';
import { TreatmentMonitoringFilterFormInterface } from '../../../data-access/treatment-monitoring/interfaces/treatment-monitoring-filter-form.interface';
import { TreatmentMonitoringApiService } from '../../../data-access/treatment-monitoring/services/treatment-monitoring-api.service';

@Component({
    selector: 'app-filter-treatment-monitoring',
    templateUrl: './filter-treatment-monitoring.component.html',
    styleUrls: ['./filter-treatment-monitoring.component.scss'],
})
export class FilterTreatmentMonitoringComponent {
    @Output() filter = new EventEmitter<TreatmentMonitoringFilterInterface>();

    @Input()
    listTreatmentMonitoringStep: Array<T_TREATMENT_MONITORING_STEP_ENUM>;
    @Input()
    listTreatmentMonitoringState: Array<T_TREATMENT_MONITORING_STATE_ENUM>;

    @Input() listApplicants$: Observable<Array<ApplicantInterface>>;
    @Input() listOperations: Array<T_LIST_REQUESTS_SERVICE>;

    public formFilter: FormGroup<TreatmentMonitoringFilterFormInterface>;
    private destroy$ = new Subject<void>();

    public secondFilter: boolean = false;
    public thirdFilter: boolean = false;

    constructor(
        private toastService: ToastrService,
        private fb: FormBuilder,
        private translate: TranslateService,
        private treatmentMonitoringApiService: TreatmentMonitoringApiService
    ) {}

    ngOnInit() {
        this.initFormFilter();
    }

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
        this.thirdFilter = false;
    }

    public showThirdFilter() {
        this.thirdFilter = !this.thirdFilter;
    }

    public initFormFilter(): void {
        this.treatmentMonitoringApiService
            .getDataFilterTreatmentMonitoring()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData: TreatmentMonitoringFilterInterface) => {
                this.formFilter =
                    this.fb.group<TreatmentMonitoringFilterFormInterface>({
                        operation: new FormControl<string>(
                            filterData?.operation ?? '',
                            { nonNullable: true }
                        ),
                        date_debut: new FormControl<string>(
                            filterData?.date_debut ?? '',
                            { nonNullable: true }
                        ),
                        date_fin: new FormControl<string>(
                            filterData?.date_fin ?? '',
                            { nonNullable: true }
                        ),
                        nom_tenant: new FormControl<string>(
                            filterData?.nom_tenant ?? '',
                            { nonNullable: true }
                        ),
                        initie_par: new FormControl<string>(
                            filterData?.initie_par ?? '',
                            { nonNullable: true }
                        ),
                        numero_demande: new FormControl<string>(
                            filterData?.numero_demande ?? '',
                            { nonNullable: true }
                        ),
                        statut: new FormControl<string>(
                            filterData?.statut ?? '',
                            { nonNullable: true }
                        ),
                        traitement: new FormControl<string>(
                            filterData?.traitement ?? '',
                            { nonNullable: true }
                        ),
                    });
            });
    }

    public onSubmitFilterForm(): void {
        const date_debut = moment(
            this.formFilter.get('date_debut')?.value
        ).isValid()
            ? this.formFilter.get('date_debut')?.value
            : null;
        const date_fin = moment(
            this.formFilter.get('date_fin')?.value
        ).isValid()
            ? this.formFilter.get('date_fin')?.value
            : null;

        if (
            date_debut &&
            date_fin &&
            moment(date_debut).isAfter(moment(date_fin))
        ) {
            const INVALID_DATE_RANGE =
                this.translate.instant('INVALID_DATE_RANGE');
            this.toastService.error(INVALID_DATE_RANGE);
            return;
        }

        const filterData = {
            ...this.formFilter.value,
            date_debut: date_debut
                ? moment(date_debut).format('YYYY-MM-DD')
                : '',
            date_fin: date_fin ? moment(date_fin).format('YYYY-MM-DD') : '',
        };

        if (this.formFilter.valid) {
            this.filter.emit(filterData);
        } else {
            const translatedMessage = this.translate.instant('FORM_INVALID');
            this.toastService.success(translatedMessage);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

import { Component, Input, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";
import { Observable } from 'rxjs';
import { treatmentMonitoringFilterInterface } from '../../../data-access/treatment-monitoring/interfaces/treatment-monitoring-filter.interface';
import { TranslateService } from '@ngx-translate/core';
import { ApplicantInterface } from "../../../../../../shared/interfaces/applicant";
import { T_BADGE_ETAPE } from "../../../../../../shared/constants/badge-etape.constant";
import { T_BADGE_ETAT } from "../../../../../../shared/constants/badge-etat.contant";

@Component({
    selector: 'app-filter-treatment-monitoring',
    templateUrl: './filter-treatment-monitoring.component.html',
    styleUrls: ['./filter-treatment-monitoring.component.scss']
})

export class FilterTreatmentMonitoringComponent {

    @Input() listApplicants$: Observable<Array<ApplicantInterface>>;
    @Input() listOperations: Array<string>;
    @Input() listStepTreatmentMonitoring: Array<T_BADGE_ETAPE>;
    @Input() listStateTreatmentMonitoring: Array<T_BADGE_ETAT>;
    @Input() filterData: treatmentMonitoringFilterInterface;

    @Output() filter = new EventEmitter<treatmentMonitoringFilterInterface>();

    public formFilter: FormGroup;

    public secondFilter: boolean = false;

    constructor(private toastService: ToastrService, private fb: FormBuilder,
        private translate: TranslateService,) {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        this.formFilter = this.fb.group<treatmentMonitoringFilterInterface>({
            initie_par: new FormControl<string>(this.filterData?.["initie_par"], { nonNullable: true }),
            numero_demande: new FormControl<string>(this.filterData?.["numero_demande"], { nonNullable: true }),
            operation: new FormControl<string>(this.filterData?.["operation"], { nonNullable: true }),
            statut: new FormControl<string>(this.filterData?.["statut"], { nonNullable: true }),
            traitement: new FormControl<string>(this.filterData?.["traitement"], { nonNullable: true }),
            msisdn: new FormControl<string>(this.filterData?.["msisdn"], {
                nonNullable: true,
                validators: [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)],
            }),
            imsi: new FormControl<string>(this.filterData?.["imsi"], {
                nonNullable: true,
                validators: [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)],
            }),
            date_debut: new FormControl<string>(this.filterData?.["date_debut"], { nonNullable: true }),
            date_fin: new FormControl<string>(this.filterData?.["date_fin"], { nonNullable: true }),
        });

        this.formFilter.get("imsi")?.valueChanges.subscribe((value) => {
            if (value && value.length > 15) {
                this.formFilter.get("imsi")?.setValue(value.slice(0, 15), { emitEvent: false });
            }
        });

        this.formFilter.get("msisdn")?.valueChanges.subscribe((value) => {
            if (value && value.length > 10) {
                this.formFilter.get("msisdn")?.setValue(value.slice(0, 10), { emitEvent: false });
            }
        });
    }

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
    }

    public onSubmitFilterForm(): void {
        const date_debut = moment(this.formFilter.get("date_debut")?.value).isValid()
            ? this.formFilter.get("date_debut")?.value : null;
        const date_fin = moment(this.formFilter.get("date_fin")?.value).isValid()
            ? this.formFilter.get("date_fin")?.value : null;

        if (date_debut && date_fin && moment(date_debut).isAfter(moment(date_fin))) {
            const INVALID_DATE_RANGE = this.translate.instant('INVALID_DATE_RANGE');
            this.toastService.error(INVALID_DATE_RANGE);
            return;
        }

        const filterData = {
            ...this.formFilter.value,
            date_debut: date_debut ? moment(date_debut).format('YYYY-MM-DD') : '',
            date_fin: date_fin ? moment(date_fin).format('YYYY-MM-DD') : ''
        };

        if (this.formFilter.valid) {
            this.filter.emit(filterData);
        } else {
            const translatedMessage = this.translate.instant('FORM_INVALID');
            this.toastService.success(translatedMessage);
        }
    }

}

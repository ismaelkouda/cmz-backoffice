import { Component, Input, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";
import { Observable } from 'rxjs';
import { waitingQueueFilterInterface } from '../../../data-access/waiting-queue/interfaces/waiting-queue-filter.interface';
import { TranslateService } from '@ngx-translate/core';
import { ApplicantInterface } from '../../../../../../shared/interfaces/applicant';

    @Component({
        selector: 'app-filter-waiting-queue',
        templateUrl: './filter-waiting-queue.component.html',
        styleUrls: ['./filter-waiting-queue.component.scss']
    })

    export class FilterWaitingQueueComponent {

    @Input() listApplicants$: Observable<Array<ApplicantInterface>>;
    @Input() listOperations: Array<string>;
    @Input() filterData: waitingQueueFilterInterface;
    
    @Output() filter = new EventEmitter<waitingQueueFilterInterface>();

    public formFilter: FormGroup;

    constructor(private toastService: ToastrService, private fb: FormBuilder,
        private translate: TranslateService,) {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        this.formFilter = this.fb.group<waitingQueueFilterInterface>({
            date_debut: new FormControl<string>(this.filterData?.["date_debut"], { nonNullable: true }),
            date_fin: new FormControl<string>(this.filterData?.["date_fin"], { nonNullable: true }),
            numero_demande: new FormControl<string>(this.filterData?.["numero_demande"], { nonNullable: true }),
            initie_par: new FormControl<string>(this.filterData?.["initie_par"], { nonNullable: true }),
            operation: new FormControl<string>(this.filterData?.["operation"], { nonNullable: true }),
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

import { historyFilterInterface } from './../../data-access/interfaces/history-filter.interface';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { HistoryApiService } from '../../data-access/services/history-api.service';
import { ApplicantInterface } from '@shared/interfaces/applicant';

@Component({
    selector: 'app-filter-history',
    templateUrl: './filter-history.component.html',
})
export class FilterHistoryComponent {
    @Input() listApplicants$: Observable<Array<ApplicantInterface>>;
    @Output() filter = new EventEmitter<Record<string, any>>();

    public formFilter: FormGroup;
    public secondFilter: boolean = false;

    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private translate: TranslateService,
        private historyApiService: HistoryApiService
    ) {}

    ngOnInit(): void {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        this.historyApiService
            .getDataFilterHistory()
            .subscribe((filterData) => {
                this.formFilter = this.fb.group<historyFilterInterface>({
                    date_debut: new FormControl<string>(
                        filterData?.['date_debut'],
                        { nonNullable: true }
                    ),
                    date_fin: new FormControl<string>(
                        filterData?.['date_fin'],
                        { nonNullable: true }
                    ),
                    initie_par: new FormControl<number>(
                        filterData?.['initie_par'],
                        {
                            nonNullable: true,
                        }
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
        if (date_debut && date_fin) {
            if (moment(date_debut).isAfter(moment(date_fin))) {
                const INVALID_DATE_RANGE =
                    this.translate.instant('INVALID_DATE_RANGE');
                this.toastService.error(INVALID_DATE_RANGE);
                return;
            }
        }
        this.filter.emit({
            ...this.formFilter.value,
            date_debut: date_debut
                ? moment(date_debut).format('YYYY-MM-DD')
                : null,
            date_fin: date_fin ? moment(date_fin).format('YYYY-MM-DD') : null,
        });
    }
}

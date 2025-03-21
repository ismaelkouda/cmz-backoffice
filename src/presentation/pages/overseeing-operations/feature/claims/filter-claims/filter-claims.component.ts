import { Component, Input, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";
import { Observable } from 'rxjs';;
import { claimsFilterInterface } from '../../../data-access/claims/interfaces/claims-filter.interface';
import { TranslateService } from '@ngx-translate/core';
import { ApplicantInterface } from '../../../../../../shared/interfaces/applicant';

    @Component({
        selector: 'app-filter-claims',
        templateUrl: './filter-claims.component.html',
    })

    export class FilterClaimsComponent {


    @Input() listApplicants$: Observable<Array<ApplicantInterface>>;

    @Input() listOperations: Array<string>;
    @Input() filterData: claimsFilterInterface;
    
    @Output() filter = new EventEmitter<claimsFilterInterface>();

    public formFilter: FormGroup;

    constructor(private toastService: ToastrService, private fb: FormBuilder,
        private translate: TranslateService) {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        this.formFilter = this.fb.group<claimsFilterInterface>({
            initie_par: new FormControl<string>(this.filterData?.["initie_par"], { nonNullable: true }),
            numero_demande: new FormControl<string>(this.filterData?.["numero_demande"], { nonNullable: true }),
            operation: new FormControl<string>(this.filterData?.["operation"], { nonNullable: true }),
            date_debut: new FormControl<string>(this.filterData?.["date_debut"], { nonNullable: true }),
            date_fin: new FormControl<string>(this.filterData?.["date_fin"], { nonNullable: true }),
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

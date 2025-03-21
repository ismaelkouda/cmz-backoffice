import { Component, Input, OnChanges, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";

@Component({
    selector: `app-filter-sms-balance`,
    templateUrl: `./filter-sms-balance.component.html`,
    styles: [`:host ::ng-deep { .p-calendar { position: relative; display: inline-flex; max-width: 100%; width: 21rem !important; } }, .col-md-2 { padding-right: 0 !important; }`]
})

export class FilterSmsBalanceComponent {

    @Input() filterData: { [key: string]: any } = {};  
    @Output() filter = new EventEmitter<Record<string, any>>();
    public formFilter: FormGroup;

    constructor(private toastService: ToastrService, private fb: FormBuilder) {
        this.initFormFilter();
    }

    private initFormFilter(): void {
        this.formFilter = this.fb.group({
            msisdn: [this.filterData?.["msisdn"] ?? null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
            imsi: [this.filterData?.["imsi"] ?? null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]],
            date_debut: [null],
            date_fin: [null],
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
        const { date_debut, date_fin, ...otherFilters } = this.formFilter.value;

        const startDate = moment(date_debut).isValid() ? moment(date_debut).format('YYYY-MM-DD') : null;
        const endDate = moment(date_fin).isValid() ? moment(date_fin).format('YYYY-MM-DD') : null;

        if (startDate && endDate && moment(startDate).isAfter(moment(endDate))) {
            this.toastService.error('Plage de date invalide');
            return;
        }

        this.filter.emit({ ...otherFilters, date_debut: startDate, date_fin: endDate });
    }
}
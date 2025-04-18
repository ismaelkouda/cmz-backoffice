import { Component, Input, OnChanges, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";

@Component({
    selector: `app-filter-file-attente`,
    templateUrl: './filter-file-attente.component.html',
})

export class FilterFileAttenteComponent implements OnChanges {

    public formFilter: FormGroup;
    @Input() filterData: Object;
    @Output() filter = new EventEmitter<{}>();
    @Input() listTenants: Array<Object>;

    constructor(private toastrService: ToastrService, private fb: FormBuilder) {}

    ngOnChanges() {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        this.formFilter = this.fb.group({
            transaction: [this.filterData?.["transaction"] ?? null],
            msisdn: [this.filterData?.["msisdn"] ?? null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
            imsi: [this.filterData?.["imsi"] ?? null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]],
            date_debut: [this.filterData?.["date_debut"] ?? null],
            date_fin: [this.filterData?.["date_fin"] ?? null],
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
        const date_debut = moment(this.formFilter.get("date_debut")?.value).isValid() ? this.formFilter.get("date_debut")?.value : null;
        const date_fin = moment(this.formFilter.get("date_fin")?.value).isValid() ? this.formFilter.get("date_fin")?.value : null;
        if ((date_debut && date_fin)) {
            if (moment(date_debut).isAfter(moment(date_fin))) {
                this.toastrService.error('Plage de date invalide');
                return;
            }
        }
        this.filter.emit({ ...this.formFilter.value, date_debut: date_debut ? moment(date_debut).format('YYYY-MM-DD') : null, date_fin: date_fin ? moment(date_fin).format('YYYY-MM-DD') : null });
    }
}
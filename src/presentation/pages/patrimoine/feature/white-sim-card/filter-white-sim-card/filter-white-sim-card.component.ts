import { Component, Input, OnChanges, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";
import { T_STATUS } from "../../../data-access/patrimoine.constante";

@Component({
    selector: `app-filter-white-sim-card`,
    templateUrl: `./filter-white-sim-card.component.html`,
    styles: [`:host ::ng-deep { .p-calendar { position: relative; display: inline-flex; max-width: 100%; width: 21rem !important; } }, .col-md-2 { padding-right: 0 !important; }`]
})

export class FilterWhiteSimCardComponent {

    @Input() filterData: { [key: string]: any } = {};
    @Input() listStatus: Array<T_STATUS> = [];
    @Input() userRole: string = '';
  
    @Output() filter = new EventEmitter<Record<string, any>>();
  
    public formFilter: FormGroup;

    constructor(private toastService: ToastrService, private fb: FormBuilder) {
        this.initFormFilter();
    }

    private initFormFilter(): void {
        this.formFilter = this.fb.group({
            reference: [this.filterData?.["reference"] ?? null],
            imsi: [this.filterData?.["imsi"] ?? null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]],
            iccid: [this.filterData?.["iccid"] ?? null],
            statut: [this.filterData?.["statut"] ?? null],
            date_debut: [this.filterData?.["date_debut"] ?? null],
            date_fin: [this.filterData?.["date_fin"] ?? null],
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
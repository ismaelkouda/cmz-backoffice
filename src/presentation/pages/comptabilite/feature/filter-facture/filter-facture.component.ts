import { Component, Input, OnChanges, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";
import { T_BADGE_ETAT_FACTURE } from "../../../../../shared/constants/badge-etat-facture.contant";

@Component({
    selector: `app-filter-facture`,
    templateUrl: `./filter-facture.component.html`,
    styles: [`:host ::ng-deep { .p-calendar { position: relative; display: inline-flex; max-width: 100%; width: 21rem !important; } }, .col-md-2 { padding-right: 0 !important; }`]
})

export class FilterFactureComponent implements OnChanges {

    @Input() filterData: { [key: string]: any } = {};
    @Input() listOperations: Array<Object>;
    @Input() typePaiement: Array<Object>;
    @Input() listStatus: Array<T_BADGE_ETAT_FACTURE>;
  
    @Output() filter = new EventEmitter<Record<string, any>>();
  
    public formFilter: FormGroup;
    public secondFilter: boolean = false;

    constructor(private toastrService: ToastrService, private fb: FormBuilder) {
        this.initFormFilter();
    }

    ngOnChanges() {
        this.formFilter.get('statut')?.setValue(this.filterData?.["statut"]);
    }

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
    }

    private initFormFilter(): void {
        this.formFilter = this.fb.group({
            operation: [this.filterData?.["operation"] ?? null],
            numero_demande: [this.filterData?.["numero_demande"] ?? null],
            reference: [this.filterData?.["reference"] ?? null],
            type_paiement: [this.filterData?.["type_paiement"] ?? null],
            statut: [this.filterData?.["statut"] ?? null],
            date_debut: [this.filterData?.["date_debut"] ?? null],
            date_fin: [this.filterData?.["date_fin"] ?? null]
        });
    }

    public onSubmitFilterForm(): void {
        const { date_debut, date_fin, ...otherFilters } = this.formFilter.value;

        const startDate = moment(date_debut).isValid() ? moment(date_debut).format('YYYY-MM-DD') : null;
        const endDate = moment(date_fin).isValid() ? moment(date_fin).format('YYYY-MM-DD') : null;

        if (startDate && endDate && moment(startDate).isAfter(moment(endDate))) {
            this.toastrService.error('Plage de date invalide');
            return;
        }

        this.filter.emit({ ...otherFilters, date_debut: startDate, date_fin: endDate });
    }
}
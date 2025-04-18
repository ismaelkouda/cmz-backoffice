import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { STATUT_DETAILS } from '../../../../../data-access/patrimoine.constante';

@Component({
    selector: 'app-filter-white-sim-card-details',
    templateUrl: './filter-white-sim-card-details.component.html',
})
export class FilterWhiteSimCardDetailsComponent implements OnInit {
    public formFilter: FormGroup;
    @Input() filterData: Object;
    @Output() filter = new EventEmitter<{}>();
    public listStatut = STATUT_DETAILS;

    constructor(
        private fb: FormBuilder,
        private toastrService: ToastrService
    ) {}

    ngOnInit() {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        this.formFilter = this.fb.group({
            imsi: [
                this.filterData?.['imsi'] ?? null,
                [
                    Validators.pattern('^[0-9]*$'),
                    Validators.maxLength(15),
                    Validators.minLength(15),
                ],
            ],
            iccid: [this.filterData?.['iccid'] ?? null],
            statut: [this.filterData?.['statut'] ?? null],
        });
        this.formFilter.get('imsi')?.valueChanges.subscribe((value) => {
            if (value && value.length > 15) {
                this.formFilter
                    .get('imsi')
                    ?.setValue(value.slice(0, 15), { emitEvent: false });
            }
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
                this.toastrService.error('Plage de date invalide');
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

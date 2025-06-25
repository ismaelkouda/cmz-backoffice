import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ApnInterface } from '../../../../../../../../shared/interfaces/apn.interface';

@Component({
    selector: `app-filter-details-importation`,
    templateUrl: `./filter-details-importation.component.html`,
})
export class FilterDetailsImportationComponent {
    public formFilter: FormGroup;
    @Output() filter = new EventEmitter<{}>();
    @Input() listStepLine: Array<Object>;
    @Input() listApn$: Observable<Array<ApnInterface>>;
    public urlParamTypeDemand: string;
    public secondFilter: boolean = false;

    constructor(
        private toastrService: ToastrService,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.urlParamTypeDemand = params?.['operation'];
        });
        this.initFormFilter();
    }

    public initFormFilter(): void {
        this.formFilter = this.fb.group({
            statut: [null],
            date_debut: [null],
            date_fin: [null],
            imsi: [
                null,
                [
                    Validators.pattern('^[0-9]*$'),
                    Validators.maxLength(15),
                    Validators.minLength(15),
                ],
            ],
            msisdn: [
                null,
                [
                    Validators.required,
                    Validators.pattern('^[0-9]*$'),
                    Validators.maxLength(10),
                    Validators.minLength(10),
                ],
            ],
            apn: [null],
        });
        this.formFilter.get('imsi')?.valueChanges.subscribe((value) => {
            if (value && value.length > 15) {
                this.formFilter
                    .get('imsi')
                    ?.setValue(value.slice(0, 15), { emitEvent: false });
            }
        });
        this.formFilter.get('msisdn')?.valueChanges.subscribe((value) => {
            if (value && value.length > 10) {
                this.formFilter
                    .get('msisdn')
                    ?.setValue(value.slice(0, 10), { emitEvent: false });
            }
        });
    }

    public showSecondFilter(): void {
        this.secondFilter = !this.secondFilter;
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

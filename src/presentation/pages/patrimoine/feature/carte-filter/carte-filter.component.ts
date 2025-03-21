import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Applicant } from '../../../../../shared/interfaces/applicant';
import { T_BADGE_ETAPE } from '../../../../../shared/constants/badge-etape.constant';
import { T_BADGE_ETAT } from '../../../../../shared/constants/badge-etat.contant';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
    selector: 'app-carte-filter',
    templateUrl: './carte-filter.component.html',
    styles: [
        `
            .col-md-2 {
                padding-right: 0;
            }
        `,
    ],
})
export class CarteFilterComponent implements OnInit {

    @Input() filterData: Object;
    @Input() listApplicants$: Array<Applicant> = [];
    @Input() listStepSimCard: Array<T_BADGE_ETAPE> = [];
    @Input() listStateSimCard: Array<T_BADGE_ETAT> = [];

    @Output() filter = new EventEmitter<{}>();

    public formFilter: FormGroup<any>;
    public secondFilter: boolean = false;

    constructor(private fb: FormBuilder, private translate: TranslateService,
        private toastService: ToastrService,
    ) { }

    ngOnInit(): void {
        this.initFormFilter();
    }

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
    }

    public initFormFilter() {
        this.formFilter = this.fb.group<any>({
            initie_par: new FormControl<string>(this.filterData?.["initie_par"] ?? null, { nonNullable: true }),
            numero_demande: new FormControl<string>(this.filterData?.["numero_demande"] ?? null, { nonNullable: true }),
            transaction: new FormControl<string>(this.filterData?.["transaction"] ?? null, { nonNullable: true }),
            statut: new FormControl<string>(this.filterData?.["statut"] ?? null, { nonNullable: true }),
            traitement: new FormControl<string>(this.filterData?.["traitement"] ?? null, { nonNullable: true }),
            msisdn: new FormControl<string>(this.filterData?.["msisdn"] ?? null,
                {
                    nonNullable: true,
                    validators: [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]
                }
            ),
            imsi: new FormControl<string>(this.filterData?.["imsi"] ?? null,
                {
                    nonNullable: true,
                    validators: [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(15), Validators.minLength(15)]
                }
            ),
            date_debut: new FormControl<string>(this.filterData?.["date_debut"] ?? null, { nonNullable: true }),
            date_fin: new FormControl<string>(this.filterData?.["date_fin"] ?? null, { nonNullable: true }),
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
            ? this.formFilter.get("date_debut")?.value
            : null;
        const date_fin = moment(this.formFilter.get("date_fin")?.value).isValid()
            ? this.formFilter.get("date_fin")?.value
            : null;

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

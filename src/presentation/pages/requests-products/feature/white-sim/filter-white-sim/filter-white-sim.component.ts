    import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
    import { ApplicantInterface } from '../../../../../../shared/interfaces/applicant';
    import { T_BADGE_ETAPE } from '../../../../../../shared/constants/badge-etape.constant';
    import { T_BADGE_ETAT } from '../../../../../../shared/constants/badge-etat.contant';
    import { FormBuilder, FormGroup, Validators } from '@angular/forms';
    import * as moment from 'moment';
    import { ToastrService } from "ngx-toastr";
    import { TranslateService } from '@ngx-translate/core';

    @Component({
        selector: 'app-filter-white-sim',
        templateUrl: './filter-white-sim.component.html',
        styleUrls: ['./filter-white-sim.component.scss']
    })

    export class FilterWhiteSimComponent implements OnInit {

        @Input() filterData: Object;
        @Input() listApplicants$: Array<ApplicantInterface>;
        @Input() listStepCommandWhiteSim: Array<T_BADGE_ETAPE> = [];
        @Input() listStateCommandWhiteSim: Array<T_BADGE_ETAT> = [];

        @Output() filter = new EventEmitter<Record<string, any>>();
        
        public formFilter: FormGroup;
        public secondFilter: boolean = false;

        constructor(private fb: FormBuilder, private toastService: ToastrService,
                    private translate: TranslateService) { }

        ngOnInit(): void {
            this.initFormFilter();
        }

        public showSecondFilter() {
            this.secondFilter = !this.secondFilter;
        }

        public initFormFilter(): void {
            this.formFilter = this.fb.group({
                initie_par: [this.filterData?.["initie_par"] ?? null],
                numero_demande: [this.filterData?.["numero_demande"] ?? null],
                transaction: [this.filterData?.["transaction"] ?? null],
                statut: [this.filterData?.["statut"] ?? null],
                traitement: [this.filterData?.["traitement"] ?? null],
                msisdn: [null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]],
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
                    const INVALID_DATE_RANGE = this.translate.instant('INVALID_DATE_RANGE');
                    this.toastService.error(INVALID_DATE_RANGE);
                    return;
                }
            }
            this.filter.emit({ ...this.formFilter.value, date_debut: date_debut ? moment(date_debut).format('YYYY-MM-DD') : null, date_fin: date_fin ? moment(date_fin).format('YYYY-MM-DD') : null });
        }

    }

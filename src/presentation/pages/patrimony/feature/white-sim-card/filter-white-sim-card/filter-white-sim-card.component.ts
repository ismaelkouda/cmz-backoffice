import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
} from '@angular/core';
import { whiteSimCardFilterInterface } from './../../../data-access/white-sim-card/interfaces/white-sim-card-filter.interface';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { T_WHITE_SIM_CARD_STATUS_ENUM } from '../../../data-access/white-sim-card/enums/white-sim-card-status.enum';
import { whiteSimCardApiService } from '../../../data-access/white-sim-card/services/white-sim-card-api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-filter-white-sim-card',
    templateUrl: './filter-white-sim-card.component.html',
    styleUrls: ['./filter-white-sim-card.component.scss'],
})
export class FilterWhiteSimCardComponent implements OnDestroy {
    @Input() listStatusWhiteSimCard: T_WHITE_SIM_CARD_STATUS_ENUM;

    @Output() filter = new EventEmitter<whiteSimCardFilterInterface | {}>();

    public formFilter: FormGroup<whiteSimCardFilterInterface>;
    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private translate: TranslateService,
        private whiteSimCardApiService: whiteSimCardApiService
    ) {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        this.whiteSimCardApiService
            .getDataFilterWhiteSimCard()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.formFilter = this.fb.group<whiteSimCardFilterInterface>({
                    numero_demande: new FormControl<string>(
                        filterData?.['numero_demande'],
                        { nonNullable: true }
                    ),
                    statut: new FormControl<string>(filterData?.['statut'], {
                        nonNullable: true,
                    }),
                    msisdn: new FormControl<string>(filterData?.['msisdn'], {
                        nonNullable: true,
                        validators: [
                            Validators.pattern('^[0-9]*$'),
                            Validators.maxLength(15),
                            Validators.minLength(15),
                        ],
                    }),
                    iccid: new FormControl<string>(filterData?.['iccid'], {
                        nonNullable: true,
                        validators: [
                            Validators.pattern('^[0-9]*$'),
                            Validators.maxLength(20),
                            Validators.minLength(20),
                        ],
                    }),
                    imsi: new FormControl<string>(filterData?.['imsi'], {
                        nonNullable: true,
                        validators: [
                            Validators.pattern('^[0-9]*$'),
                            Validators.maxLength(15),
                            Validators.minLength(15),
                        ],
                    }),
                    date_debut: new FormControl<string>(
                        filterData?.['date_debut'],
                        { nonNullable: true }
                    ),
                    date_fin: new FormControl<string>(
                        filterData?.['date_fin'],
                        { nonNullable: true }
                    ),
                });
                this.formFilter.get('imsi')?.valueChanges.subscribe((value) => {
                    if (value && value.length > 15) {
                        this.formFilter
                            .get('imsi')
                            ?.setValue(value.slice(0, 15), {
                                emitEvent: false,
                            });
                    }
                });
                this.formFilter
                    .get('msisdn')
                    ?.valueChanges.subscribe((value) => {
                        if (value && value.length > 10) {
                            this.formFilter
                                .get('msisdn')
                                ?.setValue(value.slice(0, 10), {
                                    emitEvent: false,
                                });
                        }
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

        if (
            date_debut &&
            date_fin &&
            moment(date_debut).isAfter(moment(date_fin))
        ) {
            const INVALID_DATE_RANGE =
                this.translate.instant('INVALID_DATE_RANGE');
            this.toastService.error(INVALID_DATE_RANGE);
            return;
        }

        const filterData = {
            ...this.formFilter.value,
            date_debut: date_debut
                ? moment(date_debut).format('YYYY-MM-DD')
                : '',
            date_fin: date_fin ? moment(date_fin).format('YYYY-MM-DD') : '',
        };

        if (this.formFilter.valid) {
            this.filter.emit(filterData);
        } else {
            const translatedMessage = this.translate.instant('FORM_INVALID');
            this.toastService.success(translatedMessage);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

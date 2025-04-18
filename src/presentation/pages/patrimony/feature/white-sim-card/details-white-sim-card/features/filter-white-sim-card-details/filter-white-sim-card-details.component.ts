import { STATUT_DETAILS } from './../../../../../../patrimoine/data-access/patrimoine.constante';
import { ToastrService } from 'ngx-toastr';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import * as moment from 'moment';
import { whiteSimCardApiService } from '../../../../../data-access/white-sim-card/services/white-sim-card-api.service';
import { Subject, takeUntil } from 'rxjs';
import { whiteSimCardDetailsFilterInterface } from '../../../../../data-access/white-sim-card/interfaces/white-sim-card-details-filter.interface';

@Component({
    selector: 'app-filter-white-sim-card-details',
    templateUrl: './filter-white-sim-card-details.component.html',
})
export class FilterWhiteSimCardDetailsComponent implements OnInit, OnDestroy {
    public formFilter: FormGroup;
    @Input() filterData: Object;
    @Output() filter = new EventEmitter<{}>();
    private destroy$ = new Subject<void>();
    public listStatut = STATUT_DETAILS;

    constructor(
        private fb: FormBuilder,
        private toastrService: ToastrService,
        private whiteSimCardApiService: whiteSimCardApiService
    ) {}

    ngOnInit() {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        this.whiteSimCardApiService
            .getDataFilterWhiteSimCardDetails()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.formFilter =
                    this.fb.group<whiteSimCardDetailsFilterInterface>({
                        imsi: new FormControl<string>(filterData?.['imsi'], {
                            nonNullable: true,
                        }),
                        iccid: new FormControl<string>(filterData?.['iccid'], {
                            nonNullable: true,
                        }),
                        statut: new FormControl<string>(
                            filterData?.['statut'],
                            { nonNullable: true }
                        ),
                        date_debut: new FormControl<string>(
                            filterData?.['date_debut'],
                            { nonNullable: true }
                        ),
                        date_fin: new FormControl<string>(
                            filterData?.['date_fin'],
                            { nonNullable: true }
                        ),
                    });
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

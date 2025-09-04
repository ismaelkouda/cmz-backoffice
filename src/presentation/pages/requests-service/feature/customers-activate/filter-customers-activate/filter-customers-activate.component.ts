import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { T_CUSTOMERS_ACTIVATE_STEP_ENUM } from '../../../data-access/customers-activate/enums/customers-activate-step.enum';
import { T_CUSTOMERS_ACTIVATE_STATE_ENUM } from '../../../data-access/customers-activate/enums/customers-activate-state.enum';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { CustomersActivateFilterFormInterface } from '../../../data-access/customers-activate/interfaces/customers-activate-filter-form.interface';
import { CustomersActivateFilterInterface } from '../../../data-access/customers-activate/interfaces/customers-activate-filter.interface';

@Component({
    selector: 'app-filter-customers-activate',
    templateUrl: './filter-customers-activate.component.html',
    animations: [
        trigger('slideInOut', [
            state(
                'void',
                style({
                    transform: 'translateY(-20px)',
                    opacity: 0,
                })
            ),
            transition(':enter', [
                animate(
                    '300ms ease-in',
                    style({
                        transform: 'translateY(0)',
                        opacity: 1,
                    })
                ),
            ]),
            transition(':leave', [
                animate(
                    '300ms ease-out',
                    style({
                        transform: 'translateY(-20px)',
                        opacity: 0,
                    })
                ),
            ]),
        ]),
    ],
    styleUrls: ['./filter-customers-activate.component.scss'],
})
export class FilterCustomersActivateComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<CustomersActivateFilterInterface>();

    @Input() listCustomersActivateStep: Array<T_CUSTOMERS_ACTIVATE_STEP_ENUM>;
    @Input() listCustomersActivateState: Array<T_CUSTOMERS_ACTIVATE_STATE_ENUM>;

    public formFilter: FormGroup<CustomersActivateFilterFormInterface>;
    private destroy$ = new Subject<void>();

    public secondFilter: boolean = false;
    public thirdFilter: boolean = false;

    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private translate: TranslateService,
        private sharedService: SharedService
    ) {}

    ngOnInit() {
        this.initFormFilter();
    }

    public showSecondFilter() {
        this.secondFilter = !this.secondFilter;
        this.thirdFilter = false;
    }

    public showThirdFilter() {
        this.thirdFilter = !this.thirdFilter;
    }

    public initFormFilter(): void {
        this.sharedService
            .getDataFilterCustomersActivate()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData: CustomersActivateFilterInterface) => {
                this.formFilter =
                    this.fb.group<CustomersActivateFilterFormInterface>({
                        date_debut: new FormControl<string>(
                            filterData?.date_debut ?? '',
                            { nonNullable: true }
                        ),
                        date_fin: new FormControl<string>(
                            filterData?.date_fin ?? '',
                            { nonNullable: true }
                        ),
                        nom_tenant: new FormControl<string>(
                            filterData?.nom_tenant ?? '',
                            { nonNullable: true }
                        ),
                        initie_par: new FormControl<string>(
                            filterData?.initie_par ?? '',
                            { nonNullable: true }
                        ),
                        numero_demande: new FormControl<string>(
                            filterData?.numero_demande ?? '',
                            { nonNullable: true }
                        ),
                        statut: new FormControl<string>(
                            filterData?.statut ?? '',
                            { nonNullable: true }
                        ),
                        traitement: new FormControl<string>(
                            filterData?.traitement ?? '',
                            { nonNullable: true }
                        ),
                    });

                if (filterData.date_debut || filterData.date_fin) {
                    this.secondFilter = true;
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

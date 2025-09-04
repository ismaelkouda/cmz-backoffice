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
import { T_MANAGED_CUSTOMERS_STEP_ENUM } from '../../../data-access/managed-customers/enums/managed-customers-step.enum';
import { CustomersFilterInterface } from '../../../data-access/customers/interfaces/customers-filter.interface';
import { CustomersApiService } from '../../../data-access/customers/services/customers-api.service';
import { T_TYPE_CUSTOMERS_ENUM } from '../../../../../../shared/enum/type-customers.enum';

@Component({
    selector: 'app-filter-customers',
    templateUrl: './filter-customers.component.html',
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
    styleUrls: ['./filter-customers.component.scss'],
})
export class FilterCustomersComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<CustomersFilterInterface | {}>();
    @Input() listCustomersStep: Array<T_MANAGED_CUSTOMERS_STEP_ENUM>;
    @Input() listCustomersType: Array<T_TYPE_CUSTOMERS_ENUM>;

    public formFilter: FormGroup<CustomersFilterInterface>;
    private destroy$ = new Subject<void>();

    public secondFilter: boolean = false;
    public thirdFilter: boolean = false;

    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private translate: TranslateService,
        private customersApiService: CustomersApiService
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
        this.customersApiService
            .getDataFilterCustomers()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData: CustomersFilterInterface) => {
                this.formFilter = this.fb.group<CustomersFilterInterface>({
                    date_debut: new FormControl<string>(
                        filterData?.['date_debut'],
                        {
                            nonNullable: true,
                        }
                    ),
                    date_fin: new FormControl<string>(
                        filterData?.['date_fin'],
                        {
                            nonNullable: true,
                        }
                    ),
                    nom_client: new FormControl<string>(
                        filterData?.['nom_client'],
                        {
                            nonNullable: true,
                        }
                    ),
                    type_client: new FormControl<string>(
                        filterData?.['type_client'],
                        {
                            nonNullable: true,
                        }
                    ),
                    code_client: new FormControl<string>(
                        filterData?.['code_client'],
                        {
                            nonNullable: true,
                        }
                    ),
                    compte_client: new FormControl<string>(
                        filterData?.['compte_client'],
                        {
                            nonNullable: true,
                        }
                    ),
                    statut: new FormControl<string>(filterData?.['statut'], {
                        nonNullable: true,
                    }),
                });

                if (
                    filterData.statut ||
                    filterData.date_debut ||
                    filterData.date_fin
                ) {
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

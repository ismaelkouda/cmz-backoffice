import { InvoiceFilterFormInterface } from './../../../data-access/invoice/interface/invoice-filter-form.interface';
import {
    Component,
    Input,
    EventEmitter,
    Output,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { InvoiceFilterInterface } from '../../../data-access/invoice/interface/invoice-filter.interface';
import { InvoiceApiService } from '../../../data-access/invoice/service/invoice-api.service';
import { T_NOTIFICATIONS_CENTER_STATE_ENUM } from '../../../../overseeing-operations/data-access/notifications-center/enums/notifications-center-state.enum';
import { T_LIST_REQUESTS_SERVICE } from '../../../../../../shared/enum/list-requests-service';

@Component({
    selector: 'app-filter-invoice',
    templateUrl: './filter-invoice.component.html',
    styleUrls: ['./filter-invoice.component.scss'],
})
export class FilterInvoiceComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<InvoiceFilterInterface>();

    @Input() listOperations: Array<T_LIST_REQUESTS_SERVICE>;
    @Input() listInvoiceState: Array<T_NOTIFICATIONS_CENTER_STATE_ENUM>;

    public formFilter: FormGroup<InvoiceFilterFormInterface>;
    private destroy$ = new Subject<void>();

    public secondFilter: boolean = false;

    constructor(
        private toastService: ToastrService,
        private fb: FormBuilder,
        private translate: TranslateService,
        private invoiceApiService: InvoiceApiService
    ) {}

    ngOnInit(): void {
        this.initFormFilter();
    }

    public showSecondFilter(): void {
        this.secondFilter = !this.secondFilter;
    }

    public initFormFilter(): void {
        this.invoiceApiService
            .getDataFilterInvoice()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData: InvoiceFilterInterface) => {
                this.formFilter = this.fb.group<InvoiceFilterFormInterface>({
                    date_debut: new FormControl<string>(
                        filterData?.date_debut ?? '',
                        { nonNullable: true }
                    ),
                    date_fin: new FormControl<string>(
                        filterData?.date_fin ?? '',
                        { nonNullable: true }
                    ),

                    numero_demande: new FormControl<string>(
                        filterData?.numero_demande ?? '',
                        { nonNullable: true }
                    ),

                    reference: new FormControl<string>(
                        filterData?.reference ?? '',
                        { nonNullable: true }
                    ),
                    statut: new FormControl<string>(filterData?.statut ?? '', {
                        nonNullable: true,
                    }),
                    operation: new FormControl<string>(
                        filterData?.operation ?? '',
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

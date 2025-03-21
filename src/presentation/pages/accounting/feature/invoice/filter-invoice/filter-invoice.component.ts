import { Component, Input, EventEmitter, Output, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";
import { Observable, Subject, takeUntil } from 'rxjs';
import { invoiceFilterInterface } from '../../../data-access/invoice/interfaces/invoice-filter.interface';
import { TranslateService } from '@ngx-translate/core';
import { ApplicantInterface } from '../../../../../../shared/interfaces/applicant';
import { T_BADGE_ETAT_FACTURE } from "../../../../../../shared/constants/badge-etat-facture.contant";

    @Component({
        selector: 'app-filter-invoice',
        templateUrl: './filter-invoice.component.html',
        styles: [':host ::ng-deep { .p-calendar { position: relative; display: inline-flex; max-width: 100%; width: 21rem !important; } }']
    })

    export class FilterInvoiceComponent implements OnDestroy {

    @Input() listApplicants$: Observable<Array<ApplicantInterface>>;
    @Input() listStatusInvoice: Array<T_BADGE_ETAT_FACTURE>
    @Input() filterData: invoiceFilterInterface;
    
    @Output() filter = new EventEmitter<invoiceFilterInterface>();

    public formFilter: FormGroup;
    private destroy$ = new Subject<void>();

    constructor(private toastService: ToastrService, private fb: FormBuilder,
        private translate: TranslateService, private invoiceApiService: InvoiceApiService) {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        this.invoiceApiService.getDataFilterInvoice().pipe(takeUntil(this.destroy$)).subscribe((filterData) => {
            this.formFilter = this.fb.group<invoiceFilterInterface>({
                date_debut: new FormControl<string>(filterData?.["date_debut"], { nonNullable: true }),
                date_fin: new FormControl<string>(filterData?.["date_fin"], { nonNullable: true }),
                numero_demande: new FormControl<string>(filterData?.["numero_demande"], { nonNullable: true }),
                reference: new FormControl<string>(filterData?.["initie_par"], { nonNullable: true }),
                statut: new FormControl<string>(filterData?.["statut"], { nonNullable: true }),
                operation: new FormControl<string>(filterData?.["operation"], { nonNullable: true })
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
        });
    }

    public onSubmitFilterForm(): void {
        const date_debut = moment(this.formFilter.get("date_debut")?.value).isValid()
            ? this.formFilter.get("date_debut")?.value : null;
        const date_fin = moment(this.formFilter.get("date_fin")?.value).isValid()
            ? this.formFilter.get("date_fin")?.value : null;

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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

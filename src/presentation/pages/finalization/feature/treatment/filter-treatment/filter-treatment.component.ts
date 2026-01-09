import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TreatmentFacade } from '@pages/reports-processing/application/treatment.facade';
import { TreatmentFilterFormControlEntity } from '@presentation/pages/reports-processing/domain/entities/treatment/treatment-filter-form-control.entity';
import { TreatmentFilterPayloadEntity } from '@presentation/pages/reports-processing/domain/entities/treatment/treatment-filter-payload.entity';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-filter-treatment',
    standalone: true,
    templateUrl: './filter-treatment.component.html',
    styleUrls: ['./filter-treatment.component.scss'],
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        DatePickerModule,
        ButtonModule,
        RippleModule,
    ],
})
export class FilterTreatmentComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<TreatmentFilterPayloadEntity>();

    public formFilter!: FormGroup<TreatmentFilterFormControlEntity>;
    private readonly destroy$ = new Subject<void>();

    readonly reportTypeOptions = [
        {
            value: 'Couverture Partielle Signal',
            label: 'REPORTS_PROCESSING.TREATMENT.OPTIONS.REPORT_TYPE.PARTIAL_SIGNAL',
        },
        {
            value: 'zone blanche',
            label: 'REPORTS_PROCESSING.TREATMENT.OPTIONS.REPORT_TYPE.WHITE_ZONE',
        },
        {
            value: "Absence d'Internet",
            label: 'REPORTS_PROCESSING.TREATMENT.OPTIONS.REPORT_TYPE.NO_INTERNET',
        },
    ] as const;

    readonly operatorOptions = [
        {
            value: 'orange',
            label: 'REPORTS_PROCESSING.TREATMENT.OPTIONS.OPERATOR.ORANGE',
        },
        {
            value: 'mtn',
            label: 'REPORTS_PROCESSING.TREATMENT.OPTIONS.OPERATOR.MTN',
        },
        {
            value: 'moov',
            label: 'REPORTS_PROCESSING.TREATMENT.OPTIONS.OPERATOR.MOOV',
        },
    ] as const;

    readonly stateOptions = [
        {
            value: 'terminated',
            label: 'REPORTS_PROCESSING.TREATMENT.OPTIONS.STATE.TERMINATED',
        },
        {
            value: 'in-progress',
            label: 'REPORTS_PROCESSING.TREATMENT.OPTIONS.STATE.IN_PROGRESS',
        },
        {
            value: 'rejected',
            label: 'REPORTS_PROCESSING.TREATMENT.OPTIONS.STATE.REJECTED',
        },
    ] as const;

    constructor(
        private readonly toastService: ToastrService,
        private readonly fb: FormBuilder,
        private readonly translate: TranslateService,
        private readonly treatmentFacade: TreatmentFacade
    ) { }

    ngOnInit(): void {
        this.initFormFilter();
    }

    private initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<TreatmentFilterFormControlEntity>({
                start_date: new FormControl<string>('', {
                    nonNullable: true,
                }),
                end_date: new FormControl<string>('', {
                    nonNullable: true,
                }),
                report_type: new FormControl<string>('', {
                    nonNullable: true,
                }),
                state: new FormControl<string>('', {
                    nonNullable: true,
                }),
                operator: new FormControl<string>('', {
                    nonNullable: true,
                }),
            });
        }

        this.treatmentFacade.currentFilter$
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterValue) => {
                if (!this.formFilter) {
                    return;
                }

                const dto =
                    typeof filterValue?.toDto === 'function'
                        ? (filterValue.toDto() as Record<string, string>)
                        : {};

                this.formFilter.patchValue(
                    {
                        start_date: dto['start_date'] ?? '',
                        end_date: dto['end_date'] ?? '',
                        report_type: dto['report_type'] ?? '',
                        state: dto['state'] ?? '',
                        operator: dto['operator'] ?? '',
                    },
                    { emitEvent: false }
                );
            });
    }

    public resetSelect<K extends keyof TreatmentFilterFormControlEntity>(
        controlName: K
    ): void {
        const control = this.formFilter?.controls[controlName];
        if (control) {
            control.setValue('', { emitEvent: false });
        }
    }

    public onSubmitFilterForm(): void {
        const createdFromControl = this.formFilter.get('start_date');
        const createdToControl = this.formFilter.get('end_date');

        const createdFromValue = createdFromControl?.value ?? '';
        const createdToValue = createdToControl?.value ?? '';

        const startDate = moment(createdFromValue, moment.ISO_8601, true);
        const endDate = moment(createdToValue, moment.ISO_8601, true);

        if (startDate.isValid() && endDate.isValid()) {
            if (startDate.isAfter(endDate)) {
                const invalidDateRange =
                    this.translate.instant('COMMON.INVALID_DATE_RANGE');
                this.toastService.error(invalidDateRange);
                return;
            }
        }

        const filterData: TreatmentFilterPayloadEntity = {
            start_date: startDate.isValid()
                ? startDate.format('YYYY-MM-DD')
                : '',
            end_date: endDate.isValid()
                ? endDate.format('YYYY-MM-DD')
                : '',
            report_type:
                this.formFilter.get('report_type')?.value?.trim() ?? '',
            state: this.formFilter.get('state')?.value?.trim() ?? '',
            operator: this.formFilter.get('operator')?.value?.trim() ?? '',
        };

        if (this.formFilter.valid) {
            this.filter.emit(filterData);
        } else {
            const translatedMessage = this.translate.instant('COMMON.FORM_INVALID');
            this.toastService.error(translatedMessage);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

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
import { QueuesFacade } from '@presentation/pages/reports-processing/application/queues.facade';
import { QueuesFilterFormControlEntity } from '@presentation/pages/reports-processing/domain/entities/queues/queues-filter-form-control.entity';
import { QueuesFilterPayloadEntity } from '@presentation/pages/reports-processing/domain/entities/queues/queues-filter-payload.entity';
import { OPERATOR_CONST } from '@shared/domain/constants/operator';
import { REPORT_CONST } from '@shared/domain/constants/report';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-filter-queues',
    standalone: true,
    templateUrl: './filter-queues.component.html',
    styleUrls: ['./filter-queues.component.scss'],
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        DatePickerModule,
        ButtonModule,
        RippleModule,
    ],
})
export class FilterQueuesComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<QueuesFilterPayloadEntity>();

    public formFilter!: FormGroup<QueuesFilterFormControlEntity>;
    private readonly destroy$ = new Subject<void>();
    public secondFilter: boolean = false;
    readonly reportOptions = REPORT_CONST;
    readonly operatorOptions = OPERATOR_CONST;

    readonly stateOptions = [
        {
            value: 'accepted',
            label: 'REPORTS_PROCESSING.QUEUES.OPTIONS.STATE.ACCEPTED',
        },
        {
            value: 'pending',
            label: 'REPORTS_PROCESSING.QUEUES.OPTIONS.STATUS.PENDING',
        },
        {
            value: 'rejected',
            label: 'REPORTS_PROCESSING.QUEUES.OPTIONS.STATE.REJECTED',
        },
    ] as const;

    constructor(
        private readonly toastService: ToastrService,
        private readonly fb: FormBuilder,
        private readonly translate: TranslateService,
        private readonly queuesFacade: QueuesFacade
    ) {}

    ngOnInit(): void {
        this.initFormFilter();
    }

    private initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<QueuesFilterFormControlEntity>({
                created_from: new FormControl<string>('', {
                    nonNullable: true,
                }),
                created_to: new FormControl<string>('', {
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

        this.queuesFacade.currentFilter$
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
                        created_from: dto['created_from'] ?? '',
                        created_to: dto['created_to'] ?? '',
                        report_type: dto['report_type'] ?? '',
                        state: dto['state'] ?? '',
                        operator: dto['operator'] ?? '',
                    },
                    { emitEvent: false }
                );
            });
    }

    public showSecondFilter(): void {
        this.secondFilter = !this.secondFilter;
    }

    public resetSelect<K extends keyof QueuesFilterFormControlEntity>(
        controlName: K
    ): void {
        const control = this.formFilter?.controls[controlName];
        if (control) {
            control.setValue('', { emitEvent: false });
        }
    }

    public onSubmitFilterForm(): void {
        const createdFromControl = this.formFilter.get('created_from');
        const createdToControl = this.formFilter.get('created_to');

        const createdFromValue = createdFromControl?.value ?? '';
        const createdToValue = createdToControl?.value ?? '';

        const createdFrom = moment(createdFromValue, moment.ISO_8601, true);
        const createdTo = moment(createdToValue, moment.ISO_8601, true);

        if (createdFrom.isValid() && createdTo.isValid()) {
            if (createdFrom.isAfter(createdTo)) {
                const INVALID_DATE_RANGE =
                    this.translate.instant('INVALID_DATE_RANGE');
                this.toastService.error(INVALID_DATE_RANGE);
                return;
            }
        }

        const filterData: QueuesFilterPayloadEntity = {
            created_from: createdFrom.isValid()
                ? createdFrom.format('YYYY-MM-DD')
                : '',
            created_to: createdTo.isValid()
                ? createdTo.format('YYYY-MM-DD')
                : '',
            report_type:
                this.formFilter.get('report_type')?.value?.trim() ?? '',
            state: this.formFilter.get('state')?.value?.trim() ?? '',
            operator: this.formFilter.get('operator')?.value?.trim() ?? '',
        };

        if (this.formFilter.valid) {
            this.filter.emit(filterData);
        } else {
            const translatedMessage = this.translate.instant('FORM_INVALID');
            this.toastService.error(translatedMessage);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

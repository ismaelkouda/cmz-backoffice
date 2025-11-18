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
import { QueueFacade } from '@pages/reports-processing/application/queue.facade';
import { QueueFilterFormControlEntity } from '@presentation/pages/reports-processing/domain/entities/queue/queue-filter-form-control.entity';
import { QueueFilterPayloadEntity } from '@presentation/pages/reports-processing/domain/entities/queue/queue-filter-payload.entity';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-filter-queue',
    standalone: true,
    templateUrl: './filter-queue.component.html',
    styleUrls: ['./filter-queue.component.scss'],
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        DatePickerModule,
        ButtonModule,
        RippleModule,
    ],
})
export class FilterQueueComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<QueueFilterPayloadEntity>();

    public formFilter!: FormGroup<QueueFilterFormControlEntity>;
    private readonly destroy$ = new Subject<void>();

    readonly reportTypeOptions = [
        {
            value: 'Couverture partielle signal',
            label: 'REPORT_PROCESSING.QUEUE.OPTIONS.REPORT_TYPE.PARTIAL_SIGNAL',
        },
        {
            value: 'zone blanche',
            label: 'REPORT_PROCESSING.QUEUE.OPTIONS.REPORT_TYPE.WHITE_ZONE',
        },
        {
            value: "Absence d'internet",
            label: 'REPORT_PROCESSING.QUEUE.OPTIONS.REPORT_TYPE.NO_INTERNET',
        },
    ] as const;

    readonly operatorOptions = [
        {
            value: 'orange',
            label: 'REPORT_PROCESSING.QUEUE.OPTIONS.OPERATOR.ORANGE',
        },
        {
            value: 'mtn',
            label: 'REPORT_PROCESSING.QUEUE.OPTIONS.OPERATOR.MTN',
        },
        {
            value: 'moov',
            label: 'REPORT_PROCESSING.QUEUE.OPTIONS.OPERATOR.MOOV',
        },
    ] as const;

    readonly stateOptions = [
        {
            value: 'accepted',
            label: 'REPORT_PROCESSING.QUEUE.OPTIONS.STATE.ACCEPTED',
        },
        {
            value: 'pending',
            label: 'REPORT_PROCESSING.QUEUE.OPTIONS.STATE.PENDING',
        },
        {
            value: 'rejected',
            label: 'REPORT_PROCESSING.QUEUE.OPTIONS.STATE.REJECTED',
        },
    ] as const;

    constructor(
        private readonly toastService: ToastrService,
        private readonly fb: FormBuilder,
        private readonly translate: TranslateService,
        private readonly queueFacade: QueueFacade
    ) {}

    ngOnInit(): void {
        this.initFormFilter();
    }

    private initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<QueueFilterFormControlEntity>({
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

        // Mettre à jour le formulaire avec les valeurs du filtre actuel
        this.queueFacade.currentFilter$
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

    public resetSelect<K extends keyof QueueFilterFormControlEntity>(
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

        const filterData: QueueFilterPayloadEntity = {
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

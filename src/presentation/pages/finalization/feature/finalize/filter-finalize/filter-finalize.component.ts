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
import { FinalizeFacade } from '@pages/reports-processing/application/finalize.facade';
import { FinalizeFilterFormControlEntity } from '@presentation/pages/reports-processing/domain/entities/finalize/finalize-filter-form-control.entity';
import { FinalizeFilterPayloadEntity } from '@presentation/pages/reports-processing/domain/entities/finalize/finalize-filter-payload.entity';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-filter-finalize',
    standalone: true,
    templateUrl: './filter-finalize.component.html',
    styleUrls: ['./filter-finalize.component.scss'],
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        DatePickerModule,
        ButtonModule,
        RippleModule,
    ],
})
export class FilterFinalizeComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<FinalizeFilterPayloadEntity>();

    public formFilter!: FormGroup<FinalizeFilterFormControlEntity>;
    private readonly destroy$ = new Subject<void>();

    readonly reportTypeOptions = [
        {
            value: 'zone blanche',
            label: 'REPORTS_PROCESSING.FINALIZE.OPTIONS.REPORT_TYPE.WHITE_ZONE',
        },
    ] as const;

    readonly operatorOptions = [
        {
            value: 'orange',
            label: 'REPORTS_PROCESSING.FINALIZE.OPTIONS.OPERATOR.ORANGE',
        },
        {
            value: 'mtn',
            label: 'REPORTS_PROCESSING.FINALIZE.OPTIONS.OPERATOR.MTN',
        },
        {
            value: 'moov',
            label: 'REPORTS_PROCESSING.FINALIZE.OPTIONS.OPERATOR.MOOV',
        },
    ] as const;

    readonly stateOptions = [
        {
            value: 'finalized',
            label: 'REPORTS_PROCESSING.FINALIZE.OPTIONS.STATE.FINALIZED',
        },
        {
            value: 'pending',
            label: 'REPORTS_PROCESSING.FINALIZE.OPTIONS.STATE.PENDING',
        },
        {
            value: 'rejected',
            label: 'REPORTS_PROCESSING.FINALIZE.OPTIONS.STATE.REJECTED',
        },
    ] as const;

    constructor(
        private readonly toastService: ToastrService,
        private readonly fb: FormBuilder,
        private readonly translate: TranslateService,
        private readonly finalizeFacade: FinalizeFacade
    ) {}

    ngOnInit(): void {
        this.initFormFilter();
    }

    private initFormFilter(): void {
        // Initialiser le formulaire une seule fois avec des valeurs vides
        if (!this.formFilter) {
            this.formFilter = this.fb.group<FinalizeFilterFormControlEntity>({
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
        this.finalizeFacade.currentFilter$
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterValue) => {
                if (!this.formFilter) {
                    return;
                }

                const dto =
                    typeof filterValue?.toDto === 'function'
                        ? (filterValue.toDto() as Record<string, string>)
                        : {};

                // Mettre à jour les valeurs sans recréer le formulaire
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

    public resetSelect<K extends keyof FinalizeFilterFormControlEntity>(
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

        const filterData: FinalizeFilterPayloadEntity = {
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

import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActionsFacade } from '@presentation/pages/reports-processing/application/actions.facade';
import { ActionsFilterFormControlEntity } from '@presentation/pages/reports-processing/domain/entities/actions/actions-filter-form-control.entity';
import { ActionsFilterPayloadEntity } from '@presentation/pages/reports-processing/domain/entities/actions/actions-filter-payload.entity';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
    selector: 'app-filter-actions',
    standalone: true,
    templateUrl: './filter-actions.component.html',
    styleUrls: ['./filter-actions.component.scss'],
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        DatePickerModule,
        ButtonModule,
        InputTextModule,
    ],
})
export class FilterActionsComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<ActionsFilterPayloadEntity>();

    public formFilter!: FormGroup<ActionsFilterFormControlEntity>;
    private readonly destroy$ = new Subject<void>();

    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly actionsFacade = inject(ActionsFacade);

    public readonly actionTypes = [
        {
            value: 'ANALYSIS',
            label: 'ACTIONS.TYPES.ANALYSIS',
        },
        {
            value: 'TREATMENT',
            label: 'ACTIONS.TYPES.TREATMENT',
        },
        {
            value: 'VERIFICATION',
            label: 'ACTIONS.TYPES.VERIFICATION',
        },
        {
            value: 'CORRECTION',
            label: 'ACTIONS.TYPES.CORRECTION',
        },
        {
            value: 'VALIDATION',
            label: 'ACTIONS.TYPES.VALIDATION',
        },
        {
            value: 'OTHER',
            label: 'ACTIONS.TYPES.OTHER',
        },
    ];

    ngOnInit() {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<ActionsFilterFormControlEntity>({
                report_uniq_id: new FormControl<string>('', {
                    nonNullable: true,
                }),
                type: new FormControl<string>('', {
                    nonNullable: true,
                }),
                date_from: new FormControl<string>('', {
                    nonNullable: true,
                }),
                date_to: new FormControl<string>('', {
                    nonNullable: true,
                }),
            });
            this.formFilter.get('report_uniq_id')?.disable();
        }

        this.actionsFacade.currentFilter$
            .pipe(
                distinctUntilChanged((prev, curr) => {
                    if (prev === curr) return true;
                    if (!prev && !curr) return true;
                    if (!prev || !curr) return false;

                    const prevDto = prev.toDto();
                    const currDto = curr.toDto();
                    const prevKeys = Object.keys(prevDto).sort();
                    const currKeys = Object.keys(currDto).sort();

                    if (prevKeys.length !== currKeys.length) return false;
                    return prevKeys.every(
                        (key) => prevDto[key] === currDto[key]
                    );
                }),
                takeUntil(this.destroy$)
            )
            .subscribe((filterValue) => {
                if (!this.formFilter) {
                    return;
                }

                const dto =
                    typeof filterValue?.toDto === 'function'
                        ? filterValue.toDto()
                        : {};

                this.formFilter.patchValue(
                    {
                        report_uniq_id: (dto['report_uniq_id'] as string) ?? '',
                        type: (dto['type'] as string) ?? '',
                        date_from: (dto['date_from'] as string) ?? '',
                        date_to: (dto['date_to'] as string) ?? '',
                    },
                    { emitEvent: false }
                );
            });
    }

    public resetSelect<K extends keyof ActionsFilterFormControlEntity>(
        controlName: K
    ): void {
        const control = this.formFilter?.controls[controlName];
        if (!control) return;
        (control as FormControl<string>).setValue('', { emitEvent: false });
    }

    public onSubmitFilterForm(): void {
        const dateFromControl = this.formFilter.get('date_from');
        const dateToControl = this.formFilter.get('date_to');

        const dateFromValue = dateFromControl?.value ?? '';
        const dateToValue = dateToControl?.value ?? '';

        const dateFrom = moment(dateFromValue, moment.ISO_8601, true);
        const dateTo = moment(dateToValue, moment.ISO_8601, true);

        if (dateFrom.isValid() && dateTo.isValid()) {
            if (dateFrom.isAfter(dateTo)) {
                const invalidDateRange =
                    this.translate.instant('COMMON.INVALID_DATE_RANGE');
                this.toastService.error(invalidDateRange);
                return;
            }
        }

        const filterData: ActionsFilterPayloadEntity = {
            report_uniq_id:
                this.formFilter.get('report_uniq_id')?.value?.trim() ?? '',
            type: this.formFilter.get('type')?.value ?? '',
            date_from: dateFrom.isValid() ? dateFrom.format('YYYY-MM-DD') : '',
            date_to: dateTo.isValid() ? dateTo.format('YYYY-MM-DD') : '',
        };

        if (this.formFilter.valid) {
            this.filter.emit(filterData);
        } else {
            const translatedMessage = this.translate.instant('COMMON.FORM_INVALID');
            this.toastService.success(translatedMessage);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

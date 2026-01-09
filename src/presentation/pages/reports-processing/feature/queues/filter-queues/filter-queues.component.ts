import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    inject,
    signal,
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
import { SOURCE_CONST } from '@shared/domain/constants/source';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

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
        InputTextModule,
        MultiSelectModule,
    ],
})
export class FilterQueuesComponent implements OnInit, OnDestroy {
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly queuesFacade = inject(QueuesFacade);
    readonly isLoading = signal<boolean>(false);
    @Output() filter = new EventEmitter<QueuesFilterPayloadEntity>();
    @Input()
    set loading(value: boolean) {
        this.isLoading.set(value);
    }

    public formFilter!: FormGroup<QueuesFilterFormControlEntity>;
    private readonly destroy$ = new Subject<void>();
    public secondFilter: boolean = false;
    readonly reportOptions = REPORT_CONST;
    public operatorOptions: any[] = [];
    readonly sourceOptions = SOURCE_CONST;

    ngOnInit() {
        this.initFormFilter();
        this.loadTranslatedOptions();
    }

    private loadTranslatedOptions(): void {
        this.operatorOptions = OPERATOR_CONST.map((operator) => ({
            ...operator,
            label: this.translate.instant(operator.label),
        }));
    }

    public initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<QueuesFilterFormControlEntity>({
                initiator_phone_number: new FormControl<string>('', {
                    nonNullable: true,
                }),
                uniq_id: new FormControl<string>('', {
                    nonNullable: true,
                }),
                start_date: new FormControl<string>('', {
                    nonNullable: true,
                }),
                end_date: new FormControl<string>('', {
                    nonNullable: true,
                }),
                report_type: new FormControl<string>('', {
                    nonNullable: true,
                }),
                operators: new FormControl<string[]>([], {
                    nonNullable: true,
                }),
                source: new FormControl<string>('', {
                    nonNullable: true,
                }),
            });
        }

        this.queuesFacade.currentFilter$
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
                        initiator_phone_number:
                            (dto['initiator_phone_number'] as string) ?? '',
                        uniq_id: (dto['uniq_id'] as string) ?? '',
                        start_date: (dto['start_date'] as string) ?? '',
                        source: (dto['source'] as string) ?? '',
                        end_date: (dto['end_date'] as string) ?? '',
                        report_type: (dto['report_type'] as string) ?? '',
                        operators: (dto['operator'] as string[]) ?? [],
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
        if (!control) return;

        if (controlName === 'operators') {
            (control as FormControl<string[]>).setValue([], {
                emitEvent: false,
            });
        } else {
            (control as FormControl<string>).setValue('', { emitEvent: false });
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

        const filterData: QueuesFilterPayloadEntity = {
            initiator_phone_number:
                this.formFilter.get('initiator_phone_number')?.value?.trim() ??
                '',
            uniq_id: this.formFilter.get('uniq_id')?.value?.trim() ?? '',
            start_date: startDate.isValid()
                ? startDate.format('YYYY-MM-DD')
                : '',
            end_date: endDate.isValid()
                ? endDate.format('YYYY-MM-DD')
                : '',
            source: this.formFilter.get('source')?.value?.trim() ?? '',
            report_type:
                this.formFilter.get('report_type')?.value?.trim() ?? '',
            operators: this.formFilter.get('operator')?.value ?? [],
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

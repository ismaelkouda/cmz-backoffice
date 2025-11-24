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
import { AllFacade } from '@presentation/pages/report-requests/application/all.facade';
import { STATUS_CONST } from '@presentation/pages/report-requests/domain/constants/all/status.constant';
import { AllFilterFormControlEntity } from '@presentation/pages/report-requests/domain/entities/all/all-filter-form-control.entity';
import { AllFilterPayloadEntity } from '@presentation/pages/report-requests/domain/entities/all/all-filter-payload.entity';
import { OPERATOR_CONST } from '@shared/domain/constants/operator';
import { REPORT_CONST } from '@shared/domain/constants/report';
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
    selector: 'app-filter-all',
    standalone: true,
    templateUrl: './filter-all.component.html',
    styleUrls: ['./filter-all.component.scss'],
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
export class FilterAllComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<AllFilterPayloadEntity>();

    public formFilter!: FormGroup<AllFilterFormControlEntity>;
    private readonly destroy$ = new Subject<void>();
    public secondFilter: boolean = false;
    readonly reportOptions = REPORT_CONST;
    readonly operatorOptions = OPERATOR_CONST;
    readonly stateOptions = STATUS_CONST;

    constructor(
        private readonly toastService: ToastrService,
        private readonly fb: FormBuilder,
        private readonly translate: TranslateService,
        private readonly allFacade: AllFacade
    ) {}

    ngOnInit(): void {
        this.initFormFilter();
    }

    private initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<AllFilterFormControlEntity>({
                initiator_phone_number: new FormControl<string>('', {
                    nonNullable: true,
                }),
                uniq_id: new FormControl<string>('', {
                    nonNullable: true,
                }),
                created_from: new FormControl<string>('', {
                    nonNullable: true,
                }),
                created_to: new FormControl<string>('', {
                    nonNullable: true,
                }),
                report_type: new FormControl<string>('', {
                    nonNullable: true,
                }),
                operator: new FormControl<string[]>([], {
                    nonNullable: true,
                }),
                source: new FormControl<string>('', {
                    nonNullable: true,
                }),
                state: new FormControl<string>('', {
                    nonNullable: true,
                }),
            });
        }

        this.allFacade.currentFilter$
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
                        created_from: (dto['created_from'] as string) ?? '',
                        source: (dto['created_from'] as string) ?? '',
                        created_to: (dto['created_to'] as string) ?? '',
                        report_type: (dto['report_type'] as string) ?? '',
                        operator: (dto['operator'] as string[]) ?? [],
                        state: (dto['state'] as string) ?? '',
                    },
                    { emitEvent: false }
                );
            });
    }

    public showSecondFilter(): void {
        this.secondFilter = !this.secondFilter;
    }

    public resetSelect<K extends keyof AllFilterFormControlEntity>(
        controlName: K
    ): void {
        const control = this.formFilter?.controls[controlName];
        if (!control) return;

        if (controlName === 'operator') {
            (control as FormControl<string[]>).setValue([], {
                emitEvent: false,
            });
        } else {
            (control as FormControl<string>).setValue('', { emitEvent: false });
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

        const filterData: AllFilterPayloadEntity = {
            initiator_phone_number:
                this.formFilter.get('initiator_phone_number')?.value?.trim() ??
                '',
            uniq_id: this.formFilter.get('uniq_id')?.value?.trim() ?? '',
            created_from: createdFrom.isValid()
                ? createdFrom.format('YYYY-MM-DD')
                : '',
            created_to: createdTo.isValid()
                ? createdTo.format('YYYY-MM-DD')
                : '',
            source: this.formFilter.get('source')?.value?.trim() ?? '',
            report_type:
                this.formFilter.get('report_type')?.value?.trim() ?? '',
            operator: this.formFilter.get('operator')?.value ?? [],
            state: this.formFilter.get('state')?.value?.trim() ?? '',
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

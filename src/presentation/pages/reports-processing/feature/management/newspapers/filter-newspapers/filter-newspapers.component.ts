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
import { NewspapersFacade } from '@presentation/pages/reports-processing/application/newspapers.facade';
import { NewspapersFilterFormControlEntity } from '@presentation/pages/reports-processing/domain/entities/management/newspapers/newspapers-filter-form-control.entity';
import { NewspapersFilterPayloadEntity } from '@presentation/pages/reports-processing/domain/entities/management/newspapers/newspapers-filter-payload.entity';
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
    selector: 'app-filter-newspapers',
    standalone: true,
    templateUrl: './filter-newspapers.component.html',
    styleUrls: ['./filter-newspapers.component.scss'],
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
export class FilterNewspapersComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<NewspapersFilterPayloadEntity>();

    public formFilter!: FormGroup<NewspapersFilterFormControlEntity>;
    private readonly destroy$ = new Subject<void>();
    public secondFilter: boolean = false;
    readonly reportOptions = REPORT_CONST;
    readonly operatorOptions = OPERATOR_CONST;
    readonly sourceOptions = SOURCE_CONST;

    constructor(
        private readonly toastService: ToastrService,
        private readonly fb: FormBuilder,
        private readonly translate: TranslateService,
        private readonly newspapersFacade: NewspapersFacade
    ) {}

    ngOnInit() {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<NewspapersFilterFormControlEntity>({
                reportUniqId: new FormControl<string>('', {
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
            });
        }

        this.newspapersFacade.currentFilter$
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
                        reportUniqId: (dto['reportUniqId'] as string) ?? '',
                        created_from: (dto['created_from'] as string) ?? '',
                        source: (dto['source'] as string) ?? '',
                        created_to: (dto['created_to'] as string) ?? '',
                        report_type: (dto['report_type'] as string) ?? '',
                        operator: (dto['operator'] as string[]) ?? [],
                    },
                    { emitEvent: false }
                );
            });
    }

    public showSecondFilter(): void {
        this.secondFilter = !this.secondFilter;
    }

    public resetSelect<K extends keyof NewspapersFilterFormControlEntity>(
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

        const filterData: NewspapersFilterPayloadEntity = {
            reportUniqId: this.formFilter.get('uniq_id')?.value ?? '',
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

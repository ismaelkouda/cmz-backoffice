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
import { WaitingFacade } from '@presentation/pages/report-requests/application/waiting.facade';
import { WaitingFilterFormControlEntity } from '@presentation/pages/report-requests/domain/entities/waiting/waiting-filter-form-control.entity';
import { WaitingFilterPayloadEntity } from '@presentation/pages/report-requests/domain/entities/waiting/waiting-filter-payload.entity';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
    selector: 'app-filter-waiting',
    standalone: true,
    templateUrl: './filter-waiting.component.html',
    styleUrls: ['./filter-waiting.component.scss'],
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        DatePickerModule,
        ButtonModule,
        RippleModule,
    ],
})
export class FilterWaitingComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<WaitingFilterPayloadEntity>();

    public formFilter!: FormGroup<WaitingFilterFormControlEntity>;
    private readonly destroy$ = new Subject<void>();

    readonly reportTypeOptions = [
        {
            value: 'Couverture partielle signal',
            label: 'REPORT_REQUESTS.WAITING.OPTIONS.REPORT_TYPE.PARTIAL_SIGNAL',
        },
        {
            value: 'zone blanche',
            label: 'REPORT_REQUESTS.WAITING.OPTIONS.REPORT_TYPE.WHITE_ZONE',
        },
        {
            value: "Absence d'internet",
            label: 'REPORT_REQUESTS.WAITING.OPTIONS.REPORT_TYPE.NO_INTERNET',
        },
    ] as const;

    readonly operatorOptions = [
        {
            value: 'orange',
            label: 'REPORT_REQUESTS.WAITING.OPTIONS.OPERATOR.ORANGE',
        },
        {
            value: 'mtn',
            label: 'REPORT_REQUESTS.WAITING.OPTIONS.OPERATOR.MTN',
        },
        {
            value: 'moov',
            label: 'REPORT_REQUESTS.WAITING.OPTIONS.OPERATOR.MOOV',
        },
    ] as const;

    readonly stateOptions = [
        {
            value: 'pending',
            label: 'REPORT_REQUESTS.WAITING.OPTIONS.STATE.PENDING',
        },
        {
            value: 'rejected',
            label: 'REPORT_REQUESTS.WAITING.OPTIONS.STATE.REJECTED',
        },
    ] as const;

    public resetSelect<K extends keyof WaitingFilterFormControlEntity>(
        controlName: K
    ): void {
        const control = this.formFilter?.controls[controlName];
        if (control) {
            control.setValue('', { emitEvent: false });
        }
    }

    constructor(
        private readonly toastService: ToastrService,
        private readonly fb: FormBuilder,
        private readonly translate: TranslateService,
        private readonly waitingFacade: WaitingFacade
    ) {}

    ngOnInit() {
        this.initFormFilter();
    }

    public initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<WaitingFilterFormControlEntity>({
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

        this.waitingFacade.currentFilter$
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

        const filterData: WaitingFilterPayloadEntity = {
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
            this.toastService.success(translatedMessage);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

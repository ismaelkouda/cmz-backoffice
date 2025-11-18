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
import { ApprovalFacade } from '@presentation/pages/report-requests/application/approval.facade';
import { ApprovalFilterFormControlEntity } from '@presentation/pages/report-requests/domain/entities/approval/approval-filter-form-control.entity';
import { ApprovalFilterPayloadEntity } from '@presentation/pages/report-requests/domain/entities/approval/approval-filter-payload.entity';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-filter-approval',
    standalone: true,
    templateUrl: './filter-approval.component.html',
    styleUrls: ['./filter-approval.component.scss'],
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        DatePickerModule,
        ButtonModule,
        RippleModule,
    ],
})
export class FilterApprovalComponent implements OnInit, OnDestroy {
    @Output() filter = new EventEmitter<ApprovalFilterPayloadEntity>();

    public formFilter!: FormGroup<ApprovalFilterFormControlEntity>;
    private readonly destroy$ = new Subject<void>();

    readonly reportTypeOptions = [
        {
            value: 'Couverture partielle signal',
            label: 'REPORT_REQUESTS.APPROVAL.OPTIONS.REPORT_TYPE.PARTIAL_SIGNAL',
        },
        {
            value: 'zone blanche',
            label: 'REPORT_REQUESTS.APPROVAL.OPTIONS.REPORT_TYPE.WHITE_ZONE',
        },
        {
            value: "Absence d'internet",
            label: 'REPORT_REQUESTS.APPROVAL.OPTIONS.REPORT_TYPE.NO_INTERNET',
        },
    ] as const;

    readonly operatorOptions = [
        {
            value: 'orange',
            label: 'REPORT_REQUESTS.APPROVAL.OPTIONS.OPERATOR.ORANGE',
        },
        {
            value: 'mtn',
            label: 'REPORT_REQUESTS.APPROVAL.OPTIONS.OPERATOR.MTN',
        },
        {
            value: 'moov',
            label: 'REPORT_REQUESTS.APPROVAL.OPTIONS.OPERATOR.MOOV',
        },
    ] as const;

    readonly stateOptions = [
        {
            value: 'approved',
            label: 'REPORT_REQUESTS.APPROVAL.OPTIONS.STATE.APPROVED',
        },
        {
            value: 'received',
            label: 'REPORT_REQUESTS.APPROVAL.OPTIONS.STATE.RECEIVED',
        },
        {
            value: 'rejected',
            label: 'REPORT_REQUESTS.APPROVAL.OPTIONS.STATE.REJECTED',
        },
    ] as const;

    constructor(
        private readonly toastService: ToastrService,
        private readonly fb: FormBuilder,
        private readonly translate: TranslateService,
        private readonly approvalFacade: ApprovalFacade
    ) {}

    ngOnInit(): void {
        this.initFormFilter();
    }

    private initFormFilter(): void {
        // Initialiser le formulaire une seule fois avec des valeurs vides
        if (!this.formFilter) {
            this.formFilter = this.fb.group<ApprovalFilterFormControlEntity>({
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
        this.approvalFacade.currentFilter$
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

    public resetSelect<K extends keyof ApprovalFilterFormControlEntity>(
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

        const filterData: ApprovalFilterPayloadEntity = {
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

/* import {
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
import { NotificationsFacade } from '@presentation/pages/communication/application/notifications.facade';
import { NotificationsFilterFormControlEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications-filter-form-control.entity';
import { NotificationsFilterPayloadEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications-filter-payload.entity';
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
    selector: 'app-filter-notifications',
    standalone: true,
    templateUrl: './filter-notifications.component.html',
    styleUrls: ['./filter-notifications.component.scss'],
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
export class FilterNotificationsComponent implements OnInit, OnDestroy {
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly notificationsFacade = inject(NotificationsFacade);
    @Output() filter = new EventEmitter<NotificationsFilterPayloadEntity>();

    public formFilter!: FormGroup<NotificationsFilterFormControlEntity>;
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
            this.formFilter = this.fb.group<NotificationsFilterFormControlEntity>({
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
                operators: new FormControl<string[]>([], {
                    nonNullable: true,
                }),
                source: new FormControl<string>('', {
                    nonNullable: true,
                }),
            });
        }

        this.notificationsFacade.currentFilter$
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
                        source: (dto['source'] as string) ?? '',
                        created_to: (dto['created_to'] as string) ?? '',
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

    public resetSelect<K extends keyof NotificationsFilterFormControlEntity>(
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

        const filterData: NotificationsFilterPayloadEntity = {
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
            operators: this.formFilter.get('operators')?.value ?? [],
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
 */

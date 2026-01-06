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
    Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LegalNoticeFilterFormControlDto } from '@presentation/pages/content-management/core/application/dtos/legal-notice/legal-notice-filter-form-control.entity';
import { LegalNoticeFacade } from '@presentation/pages/content-management/core/application/services/legal-notice.facade';
import { LegalNoticeFilterPayloadEntity } from '@presentation/pages/content-management/core/domain/entities/legal-notice/legal-notice-filter-payload.entity';
import { semanticVersionValidator } from '@shared/domain/functions/semantic-version-validator';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
    selector: 'app-filter-legal-notice',
    standalone: true,
    templateUrl: './filter-legal-notice.component.html',
    styleUrls: ['./filter-legal-notice.component.scss'],
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        DatePickerModule,
        ButtonModule,
        MultiSelectModule,
        InputTextModule,
    ],
})
export class FilterLegalNoticeComponent implements OnInit, OnDestroy {
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly legalNoticeFacade = inject(LegalNoticeFacade);
    private readonly toastService = inject(ToastrService);
    readonly isLoading = signal<boolean>(false);
    @Output() filter = new EventEmitter<LegalNoticeFilterPayloadEntity>();

    @Input()
    set loading(value: boolean) {
        this.isLoading.set(value);
    }

    public formFilter!: FormGroup<LegalNoticeFilterFormControlDto>;
    private readonly destroy$ = new Subject<void>();

    public isPublishedOptions: any[] = [];

    ngOnInit(): void {
        this.initOptions();
        this.initFormFilter();
    }

    private initOptions(): void {
        this.isPublishedOptions = [
            { label: this.translate.instant('COMMON.PUBLISHED'), value: true },
            {
                label: this.translate.instant('COMMON.UNPUBLISHED'),
                value: false,
            },
        ];
    }

    private initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<LegalNoticeFilterFormControlDto>({
                startDate: new FormControl<string>('', { nonNullable: true }),
                endDate: new FormControl<string>('', { nonNullable: true }),
                version: new FormControl<string | null>(null, {
                    validators: [
                        semanticVersionValidator(),
                        Validators.pattern(/^\d+(\.\d+){0,2}$/),
                    ],
                    nonNullable: false,
                }),
                search: new FormControl<string>('', { nonNullable: true }),
                isPublished: new FormControl<boolean | null>(null, {
                    nonNullable: false,
                }),
            });
        }

        this.legalNoticeFacade.currentFilter$
            .pipe(
                distinctUntilChanged(
                    (prev, curr) =>
                        JSON.stringify(prev) === JSON.stringify(curr)
                ),
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
                        startDate: (dto['startDate'] as string) ?? '',
                        endDate: (dto['endDate'] as string) ?? '',
                        version: (dto['version'] as string) ?? '',
                        search: (dto['search'] as string) ?? '',
                        isPublished: (dto['isPublished'] as boolean) ?? null,
                    },
                    { emitEvent: false }
                );
            });
    }

    public onSubmitFilterForm(): void {
        const startDateControl = this.formFilter.get('startDate');
        const endDateControl = this.formFilter.get('endDate');

        const startDateValue = startDateControl?.value ?? '';
        const endDateValue = endDateControl?.value ?? '';

        const startDate = moment(startDateValue, moment.ISO_8601, true);
        const endDate = moment(endDateValue, moment.ISO_8601, true);

        if (startDate.isValid() && endDate.isValid()) {
            if (startDate.isAfter(endDate)) {
                const INVALID_DATE_RANGE =
                    this.translate.instant('INVALID_DATE_RANGE');
                this.toastService.error(INVALID_DATE_RANGE);
                return;
            }
        }

        const filterData: LegalNoticeFilterPayloadEntity = {
            startDate: startDate.isValid()
                ? startDate.format('YYYY-MM-DD')
                : '',
            endDate: endDate.isValid() ? endDate.format('YYYY-MM-DD') : '',
            version: this.formFilter.get('version')?.value ?? '',
            search: this.formFilter.get('search')?.value ?? '',
            isPublished: this.formFilter.get('isPublished')?.value ?? null,
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

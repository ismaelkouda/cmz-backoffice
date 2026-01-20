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
import { SlideFilterFormControlDto } from '@presentation/pages/content-management/core/application/dtos/slide/slide-filter-form-control.entity';
import { SlideFacade } from '@presentation/pages/content-management/core/application/services/slide.facade';
import { SlideFilterPayloadEntity } from '@presentation/pages/content-management/core/domain/entities/slide/slide-filter-payload.entity';
import { Plateform } from '@shared/domain/enums/plateform.enum';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
    selector: 'app-filter-slide',
    standalone: true,
    templateUrl: './filter-slide.component.html',
    styleUrls: ['./filter-slide.component.scss'],
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
export class FilterSlideComponent implements OnInit, OnDestroy {
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly slideFacade = inject(SlideFacade);
    private readonly toastService = inject(ToastrService);
    readonly isLoading = signal<boolean>(false);
    @Output() filter = new EventEmitter<SlideFilterPayloadEntity>();

    @Input()
    set loading(value: boolean) {
        this.isLoading.set(value);
    }

    public formFilter!: FormGroup<SlideFilterFormControlDto>;
    private readonly destroy$ = new Subject<void>();

    public statusOptions: any[] = [];
    public plateformOptions: any[] = [];

    ngOnInit(): void {
        this.initOptions();
        this.initFormFilter();
    }

    private initOptions(): void {
        this.statusOptions = [
            { label: this.translate.instant('COMMON.ACTIVATED'), value: true },
            {
                label: this.translate.instant('COMMON.DEACTIVATED'),
                value: false,
            },
        ];

        this.plateformOptions = Object.values(Plateform).map((type) => ({
            label: this.translate.instant(`${type}`),
            value: this.translate.instant(`${type}`).toLowerCase(),
        }));
    }

    private initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<SlideFilterFormControlDto>({
                startDate: new FormControl<string>('', { nonNullable: true }),
                endDate: new FormControl<string>('', { nonNullable: true }),
                platforms: new FormControl<Array<Plateform>>([], {
                    nonNullable: true,
                }),
                search: new FormControl<string>('', { nonNullable: true }),
                status: new FormControl<boolean | null>(null, {
                    nonNullable: false,
                }),
            });
        }

        this.slideFacade.currentFilter$
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
                        startDate: (dto['start_date'] as string) ?? '',
                        endDate: (dto['end_date'] as string) ?? '',
                        platforms:
                            (dto['platforms'] as Array<Plateform>) ?? [],
                        search: (dto['search'] as string) ?? '',
                        status: (dto['status'] as boolean) ?? null,
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
                const invalidDateRange =
                    this.translate.instant('COMMON.INVALID_DATE_RANGE');
                this.toastService.error(invalidDateRange);
                return;
            }
        }

        const filterData: SlideFilterPayloadEntity = {
            startDate: startDate.isValid()
                ? startDate.format('YYYY-MM-DD')
                : '',
            endDate: endDate.isValid() ? endDate.format('YYYY-MM-DD') : '',
            platforms: this.formFilter.get('platforms')?.value ?? [],
            search: this.formFilter.get('search')?.value ?? '',
            status: this.formFilter.get('status')?.value ?? null,
        };

        if (this.formFilter.valid) {
            this.filter.emit(filterData);
        } else {
            const translatedMessage = this.translate.instant('COMMON.FORM_INVALID');
            this.toastService.error(translatedMessage);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

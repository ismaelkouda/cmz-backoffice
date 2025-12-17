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
import { NewsFilterFormControlDto } from '@presentation/pages/content-management/core/application/dtos/news/news-filter-form-control.entity';
import { NewsFacade } from '@presentation/pages/content-management/core/application/services/news.facade';
import { NewsFilterPayloadEntity } from '@presentation/pages/content-management/core/domain/entities/news/news-filter-payload.entity';
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
    selector: 'app-filter-news',
    standalone: true,
    templateUrl: './filter-news.component.html',
    styleUrls: ['./filter-news.component.scss'],
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        SelectModule,
        DatePickerModule,
        ButtonModule,
        MultiSelectModule,
        InputTextModule
    ],
})
export class FilterNewsComponent implements OnInit, OnDestroy {
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly newsFacade = inject(NewsFacade);
    private readonly toastService = inject(ToastrService);
    readonly isLoading = signal<boolean>(false);
    @Output() filter = new EventEmitter<NewsFilterPayloadEntity>();

    @Input()
    set loading(value: boolean) {
        this.isLoading.set(value);
    }

    public formFilter!: FormGroup<NewsFilterFormControlDto>;
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
            { label: this.translate.instant('COMMON.DEACTIVATED'), value: false }
        ];

        this.plateformOptions = Object.values(Plateform).map((type) => ({
            label: this.translate.instant(`${type.toUpperCase()}`),
            value: type,
        }));
    }

    private initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<NewsFilterFormControlDto>({
                startDate: new FormControl<string>('', { nonNullable: true }),
                endDate: new FormControl<string>('', { nonNullable: true }),
                search: new FormControl<string>('', { nonNullable: true }),
                status: new FormControl<boolean | null>(null, { nonNullable: false }),
            });
        }

        this.newsFacade.currentFilter$
            .pipe(
                distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
                takeUntil(this.destroy$)
            )
            .subscribe((filterValue) => {
                if (!this.formFilter) {
                    return;
                }

                const dto = typeof filterValue?.toDto === 'function' ? filterValue.toDto() : {};

                this.formFilter.patchValue(
                    {
                        startDate: (dto['startDate'] as string) ?? '',
                        endDate: (dto['endDate'] as string) ?? '',
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
                const INVALID_DATE_RANGE = this.translate.instant('INVALID_DATE_RANGE');
                this.toastService.error(INVALID_DATE_RANGE);
                return;
            }
        }

        const filterData: NewsFilterPayloadEntity = {
            startDate: startDate.isValid() ? startDate.format('YYYY-MM-DD') : '',
            endDate: endDate.isValid() ? endDate.format('YYYY-MM-DD') : '',
            search: this.formFilter.get('search')?.value ?? '',
            status: this.formFilter.get('status')?.value ?? null,
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

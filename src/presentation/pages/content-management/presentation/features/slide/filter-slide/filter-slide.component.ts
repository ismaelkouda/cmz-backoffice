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
import { TypeMediaDto } from '@shared/data/dtos/type-media.dto';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
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
    public typeOptions: any[] = [];

    ngOnInit(): void {
        this.initOptions();
        this.initFormFilter();
    }

    private initOptions(): void {
        this.statusOptions = [
            { label: this.translate.instant('COMMON.ACTIVATED'), value: true },
            { label: this.translate.instant('COMMON.DEACTIVATED'), value: false }
        ];

        this.typeOptions = Object.values(TypeMediaDto).map((type) => ({
            label: this.translate.instant(`COMMON.${type.toUpperCase()}`),
            value: type,
        }));
    }

    private initFormFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<SlideFilterFormControlDto>({
                createdFrom: new FormControl<string>('', { nonNullable: true }),
                createdTo: new FormControl<string>('', { nonNullable: true }),
                type: new FormControl<Array<TypeMediaDto>>([], { nonNullable: true }),
                status: new FormControl<boolean | null>(null, { nonNullable: false }),
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

                const dto = typeof filterValue?.toDto === 'function' ? filterValue.toDto() : {};

                this.formFilter.patchValue(
                    {
                        createdFrom: (dto['createdFrom'] as string) ?? '',
                        createdTo: (dto['createdTo'] as string) ?? '',
                        type: (dto['type'] as Array<TypeMediaDto>) ?? [],
                        status: (dto['status'] as boolean) ?? null,
                    },
                    { emitEvent: false }
                );
            });
    }

    public onSubmitFilterForm(): void {
        const createdFromControl = this.formFilter.get('createdFrom');
        const createdToControl = this.formFilter.get('createdTo');

        const createdFromValue = createdFromControl?.value ?? '';
        const createdToValue = createdToControl?.value ?? '';

        const createdFrom = moment(createdFromValue, moment.ISO_8601, true);
        const createdTo = moment(createdToValue, moment.ISO_8601, true);

        if (createdFrom.isValid() && createdTo.isValid()) {
            if (createdFrom.isAfter(createdTo)) {
                const INVALID_DATE_RANGE = this.translate.instant('INVALID_DATE_RANGE');
                this.toastService.error(INVALID_DATE_RANGE);
                return;
            }
        }

        const filterData: SlideFilterPayloadEntity = {
            createdFrom: createdFrom.isValid() ? createdFrom.format('YYYY-MM-DD') : '',
            createdTo: createdTo.isValid() ? createdTo.format('YYYY-MM-DD') : '',
            type: this.formFilter.get('type')?.value ?? [],
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

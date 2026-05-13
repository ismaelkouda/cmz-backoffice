import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    Signal,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RegionsFacade } from '@pages/administrative-boundary/application/services/regions/regions.facade';
import { FILTER_KEYS } from '@pages/administrative-boundary/domain/constants/regions/regions-filter-keys.constants';
import { REGIONS_TABLE } from '@pages/administrative-boundary/domain/constants/regions/regions-table.constants';
import { RegionsFilterControl } from '@pages/administrative-boundary/domain/controls/regions/regions-filter.control';
import { RegionsEntity } from '@pages/administrative-boundary/domain/entities/regions/regions.entity';
import { Status } from '@pages/administrative-boundary/domain/enums/regions/regions-status.enum';
import {
    DEPARTMENTS_BY_REGION_ID_ROUTE,
    REGIONS_FORM,
} from '@pages/administrative-boundary/presentation/regions/regions.routes';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptions,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';
import { parseAndValidateDateRange } from '@shared/domain/utils/date-range.utils';
import { ToastrService } from 'ngx-toastr';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-regions-list',
    standalone: true,
    imports: [
        CommonModule,
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './regions-list.component.html',
    styleUrls: ['./regions-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionsListComponent implements OnInit {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    public readonly facade = inject(RegionsFacade);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );
    private readonly appCustomizationService = inject(AppCustomizationService);
    public readonly tableConfig = REGIONS_TABLE;
    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    readonly isLoading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: {} as Paginate<RegionsEntity>,
    });
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.customization.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    public formFilter!: FormGroup<RegionsFilterControl>;
    readonly filterFields = [
        {
            type: 'text',
            name: FILTER_KEYS.SEARCH,
            label: 'ADMINISTRATIVE_BOUNDARY.REGIONS.FILTER.SEARCH',
            placeholder:
                'ADMINISTRATIVE_BOUNDARY.REGIONS.FILTER.SEARCH_PLACEHOLDER',
        },
        /* {
                type: 'select',
                name: 'isActive',
                label: 'ADMINISTRATIVE_BOUNDARY.REGIONS.FILTER.STATUS',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                options: this.statusOptions,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                filter: false,
            }, */
        {
            type: 'date',
            name: FILTER_KEYS.START_DATE,
            label: 'ADMINISTRATIVE_BOUNDARY.REGIONS.FILTER.DATE.FROM',
            placeholder:
                'ADMINISTRATIVE_BOUNDARY.REGIONS.FILTER.DATE.PLACEHOLDER',
        },
        {
            type: 'date',
            name: FILTER_KEYS.END_DATE,
            label: 'ADMINISTRATIVE_BOUNDARY.REGIONS.FILTER.DATE.TO',
            placeholder:
                'ADMINISTRATIVE_BOUNDARY.REGIONS.FILTER.DATE.PLACEHOLDER',
        },
    ];
    readonly statusOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(Status, this.t.bind(this));
    });

    public readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.CREATE',
            actionId: CrudFormType.CREATE,
            class: 'btn-primary',
            icon: 'pi pi-plus',
            translateKey: 'COMMON.CREATE',
        },
    ]);

    constructor() {
        this.title.setTitle(
            this.translate.instant('ADMINISTRATIVE_BOUNDARY.REGIONS.TITLE')
        );

        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.title.setTitle(
                    this.t('ADMINISTRATIVE_BOUNDARY.REGIONS.TITLE')
                );
            });
        effect(() => {
            this.facade.readAll();
        });
    }

    ngOnInit(): void {
        this.initFilter();
    }

    private initFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<RegionsFilterControl>({
                search: new FormControl<string | null>(null),
                department: new FormControl<string | null>(null),
                municipality: new FormControl<string | null>(null),
                status: new FormControl<Status | null>(null),
                startDate: new FormControl<string | null>(null),
                endDate: new FormControl<string | null>(null),
            });
        }
    }

    public filter(formValue: any): void {
        const { startDate, endDate, isValidRange } = parseAndValidateDateRange(
            formValue.startDate,
            formValue.endDate
        );
        if (!isValidRange) {
            this.toastService.error(
                this.translate.instant('COMMON.INVALID_DATE_RANGE')
            );
            return;
        }
        const filter = {
            search: formValue.search,
            isActive: formValue.isActive,
            startDate: startDate?.format('YYYY-MM-DD'),
            endDate: endDate?.format('YYYY-MM-DD'),
        };
        this.facade.readAll(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }

    public refresh(): void {
        this.facade.refresh();
    }

    public onHeaderButtonClicked(actionId: string): void {
        if (actionId === CrudFormType.CREATE) {
            this.onNavigateToForm({
                item: undefined,
                ref: CrudFormType.CREATE,
            });
        }
    }

    public onNavigateToForm(event: {
        item?: RegionsEntity;
        ref: CrudFormType;
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate([REGIONS_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    public onEditClicked({
        item,
        ref,
    }: {
        item: RegionsEntity;
        ref: CrudFormType;
    }): void {
        this.router.navigate([REGIONS_FORM], {
            relativeTo: this.activatedRoute,
            queryParams: {
                uniqId: item.uniqId,
                ref: ref,
            },
        });
    }

    public onViewClicked(item: RegionsEntity): void {
        console.log('View region', item);
    }

    public onDeleteClicked(item: RegionsEntity): void {
        if (this.items().length < 1 && !item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'ADMINISTRATIVE_BOUNDARY.REGIONS.SWEET_ALERT.TITLE.DELETE'
            ),
            text: `${this.translate.instant('ADMINISTRATIVE_BOUNDARY.REGIONS.SWEET_ALERT.MESSAGE.DELETE')}`,
            backdrop: false,
            confirmButtonText: this.translate.instant('COMMON.CONFIRM'),
            cancelButtonText: this.translate.instant('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.delete({ uniqId: item.uniqId });
                this.facade.refreshWithLastFilterAndPage();
            }
        });
    }

    public onBadgeClick(event: {
        item: RegionsEntity;
        col: HTMLTableCellElement;
    }): void {
        this.router.navigate([DEPARTMENTS_BY_REGION_ID_ROUTE], {
            relativeTo: this.activatedRoute,
            queryParams: {
                uniqId: event.item.uniqId,
                name: event.item.name,
            },
        });
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }

    public onExportExcel(): void {
        const regions = this.items();
        if (regions && regions.length > 0) {
            const fileName = `${this.exportFilePrefix}-regions`;
            this.tableExportExcelFileService.exportAsExcelFile(
                regions,
                this.tableConfig,
                fileName
            );
        } else {
            this.toastService.error(this.translate.instant('EXPORT.NO_DATA'));
        }
    }

    private normalizeExportPrefix(appName: string): string {
        return (
            appName
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }
}

import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    Signal,
    computed,
    effect,
    inject,
    signal,
    untracked,
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
import { MunicipalitiesFacade } from '@pages/administrative-boundary/application/services/municipalities/municipalities.facade';
import { RegionsSelectFacade } from '@pages/administrative-boundary/application/services/regions/regions-select.facade';
import { FILTER_KEYS } from '@pages/administrative-boundary/domain/constants/municipalities/municipalities-filter-keys.constants';
import { MUNICIPALITIES_TABLE } from '@pages/administrative-boundary/domain/constants/municipalities/municipalities-table.constants';
import { MunicipalitiesFilterControl } from '@pages/administrative-boundary/domain/controls/municipalities/municipalities-filter.control';
import { MunicipalitiesEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';
import { RegionsSelectEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-select.entity';
import { Status } from '@pages/administrative-boundary/domain/enums/municipalities/municipalities-status.enum';
import { MUNICIPALITIES_FORM } from '@pages/administrative-boundary/presentation/municipalities/municipalities.routes';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptions,
    FilterField,
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
    selector: 'app-municipalities-list',
    standalone: true,
    imports: [
        CommonModule,
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './municipalities-list.component.html',
    styleUrls: ['./municipalities-list.component.scss'],
})
export class MunicipalitiesListComponent {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    public readonly facade = inject(MunicipalitiesFacade);
    public readonly regionsFacade = inject(RegionsSelectFacade);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );
    private readonly appCustomizationService = inject(AppCustomizationService);
    public readonly tableConfig = MUNICIPALITIES_TABLE;
    readonly regions = toSignal(this.regionsFacade.items$, {
        initialValue: [],
    });
    readonly items = toSignal(this.facade.items$, {
        initialValue: [],
    });
    private readonly filterData = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });
    readonly isLoading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: {} as Paginate<MunicipalitiesEntity>,
    });
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.customization.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );

    public readonly formFilter: FormGroup<MunicipalitiesFilterControl> =
        this.fb.group<MunicipalitiesFilterControl>({
            search: new FormControl<string | null>(null),
            region: new FormControl<string | null>(null, {
                nonNullable: true,
            }),
            department: new FormControl<string | null>(null, {
                nonNullable: true,
            }),
            status: new FormControl<Status | null>(null),
            startDate: new FormControl<string | null>(null),
            endDate: new FormControl<string | null>(null),
        });

    private readonly selectedRegion = toSignal(
        this.formFilter.controls.region.valueChanges,
        { initialValue: null }
    );

    readonly filteredDepartments = computed(() => {
        const item = this.selectedRegion();
        if (!item) {
            return [];
        }

        const region: RegionsSelectEntity | undefined = this.regions().find(
            (r) => r.value === item
        );
        return region?.departments || [];
    });

    readonly filterFields: Signal<FilterField[]> = computed<FilterField[]>(
        () => [
            {
                type: 'text',
                name: FILTER_KEYS.SEARCH,
                label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.SEARCH',
                placeholder:
                    'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.SEARCH_PLACEHOLDER',
            },
            {
                type: 'select',
                name: FILTER_KEYS.REGION,
                label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.REGION',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                options: this.regions(),
                optionLabel: 'name',
                optionValue: 'value',
                showClear: true,
                filter: true,
            },
            {
                type: 'select',
                name: FILTER_KEYS.DEPARTMENT,
                label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.DEPARTMENT',
                placeholder: this.selectedRegion()
                    ? 'COMMON.SELECT_PLACEHOLDER'
                    : 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.SELECT_REGION_FIRST',
                options: this.filteredDepartments(),
                optionLabel: 'name',
                optionValue: 'value',
                showClear: true,
                filter: true,
            },
            {
                type: 'date',
                name: FILTER_KEYS.START_DATE,
                label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.DATE.FROM',
                placeholder:
                    'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.DATE.PLACEHOLDER',
                class: 'p-short',
            },
            {
                type: 'date',
                name: FILTER_KEYS.END_DATE,
                label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.DATE.TO',
                placeholder:
                    'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.DATE.PLACEHOLDER',
                class: 'p-short',
            },
        ]
    );
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
            this.translate.instant(
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TITLE'
            )
        );

        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.title.setTitle(
                    this.t('ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TITLE')
                );
            });
        effect(() => {
            this.facade.readAll();
            this.regionsFacade.readAll();
        });

        effect(() => {
            const filter = this.filterData();

            untracked(() => {
                if (filter) {
                    this.formFilter.patchValue(
                        {
                            search: filter.search,
                            region: filter.region,
                            department: filter.department,
                            status: filter.status,
                            startDate: filter.startDate,
                            endDate: filter.endDate,
                        },
                        { emitEvent: false }
                    );
                }
            });
        });

        effect(() => {
            const region = this.selectedRegion();

            const deptControl = this.formFilter.controls.department;

            if (!region) {
                deptControl.reset(null, { emitEvent: false });
                deptControl.disable({ emitEvent: false });
            } else {
                deptControl.enable({ emitEvent: false });
            }
        });
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
            region: formValue.region,
            department: formValue.department,
            status: formValue.status,
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
        item?: MunicipalitiesEntity;
        ref: CrudFormType;
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate([MUNICIPALITIES_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    public onEditClicked({
        item,
        ref,
    }: {
        item: MunicipalitiesEntity;
        ref: CrudFormType;
    }): void {
        this.router.navigate([MUNICIPALITIES_FORM], {
            relativeTo: this.activatedRoute,
            queryParams: {
                uniqId: item.uniqId,
                ref: ref,
            },
        });
    }

    public onViewClicked(item: MunicipalitiesEntity): void {
        console.log('View municipality', item);
    }

    public onDeleteClicked(item: MunicipalitiesEntity): void {
        if (this.items().length < 1 && !item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.TITLE_DELETE'
            ),
            text: `${this.translate.instant('ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.MESSAGE_DELETE')}`,
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

    private t(key: string): string {
        return this.translate.instant(key);
    }

    public onExportExcel(): void {
        const departments = this.items();
        if (departments && departments.length > 0) {
            const fileName = `${this.exportFilePrefix}-municipalities-${new Date().toISOString()}.xlsx`;
            this.tableExportExcelFileService.exportAsExcelFile(
                departments,
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

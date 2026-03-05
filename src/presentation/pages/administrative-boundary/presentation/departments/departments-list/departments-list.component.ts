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
import { ToastrService } from 'ngx-toastr';
import SweetAlert from 'sweetalert2';

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
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';
import { parseAndValidateDateRange } from '@shared/domain/utils/date-range.utils';

import { DepartmentsFacade } from '@presentation/pages/administrative-boundary/application/services/departments/departments.facade';
import { RegionsSelectFacade } from '@presentation/pages/administrative-boundary/application/services/regions/regions-select.facade';
import { FILTER_KEYS } from '@presentation/pages/administrative-boundary/domain/constants/departments/departments-filter-keys.constants';
import { DEPARTMENTS_TABLE } from '@presentation/pages/administrative-boundary/domain/constants/departments/departments-table.constants';
import { DepartmentsFilterControl } from '@presentation/pages/administrative-boundary/domain/controls/departments/departments-filter.control';
import { DepartmentsEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments.entity';
import { Status } from '@presentation/pages/administrative-boundary/domain/enums/departments/departments-status.enum';
import {
    DEPARTMENTS_FORM,
    MUNICIPALITIES_BY_DEPARTMENT_ID_ROUTE,
} from '@presentation/pages/administrative-boundary/presentation/departments/departments.routes';

@Component({
    selector: 'app-departments-list',
    standalone: true,
    imports: [
        CommonModule,
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './departments-list.component.html',
    styleUrls: ['./departments-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentsListComponent implements OnInit {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    public readonly facade = inject(DepartmentsFacade);
    public readonly regionsSelectFacade = inject(RegionsSelectFacade);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );
    private readonly appCustomizationService = inject(AppCustomizationService);
    public readonly tableConfig = DEPARTMENTS_TABLE;
    readonly regions = toSignal(this.regionsSelectFacade.items$, {
        initialValue: [],
    });
    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    readonly isLoading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: {} as Paginate<DepartmentsEntity>,
    });
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    public formFilter!: FormGroup<DepartmentsFilterControl>;

    readonly filterFields = computed<FilterField[]>(() => [
        {
            type: 'text',
            name: FILTER_KEYS.SEARCH,
            label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.SEARCH',
            placeholder:
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.SEARCH_PLACEHOLDER',
        },
        {
            type: 'select',
            name: FILTER_KEYS.REGION,
            label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.REGION',
            placeholder: 'COMMON.SELECT_PLACEHOLDER',
            options: this.regions(),
            optionLabel: 'name',
            optionValue: 'code',
            showClear: true,
            filter: true,
        },
        {
            type: 'date',
            name: FILTER_KEYS.START_DATE,
            label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.DATE.FROM',
            placeholder:
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.DATE.PLACEHOLDER',
        },
        {
            type: 'date',
            name: FILTER_KEYS.END_DATE,
            label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.DATE.TO',
            placeholder:
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.DATE.PLACEHOLDER',
        },
    ]);
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
            this.translate.instant('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TITLE')
        );

        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.title.setTitle(
                    this.t('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TITLE')
                );
            });
        effect(() => {
            this.facade.readAll();
            this.regionsSelectFacade.readAll();
        });
    }

    ngOnInit(): void {
        this.initFilter();
    }

    private initFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<DepartmentsFilterControl>({
                search: new FormControl<string | null>(null),
                region: new FormControl<string | null>(null),
                municipality: new FormControl<string | null>(null),
                status: new FormControl<string | null>(null),
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
            region: formValue.region,
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
        item?: DepartmentsEntity;
        ref: CrudFormType;
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate([DEPARTMENTS_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    public onEditClicked({
        item,
        ref,
    }: {
        item: DepartmentsEntity;
        ref: CrudFormType;
    }): void {
        console.log(item);
        this.router.navigate([DEPARTMENTS_FORM], {
            relativeTo: this.activatedRoute,
            queryParams: {
                uniqId: item.uniqId,
                ref: ref,
            },
        });
    }

    public onViewClicked(item: DepartmentsEntity): void {
        console.log('View department', item);
    }

    public onDeleteClicked(item: DepartmentsEntity): void {
        if (this.items().length < 1 && !item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.TITLE_DELETE'
            ),
            text: `${this.translate.instant('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.MESSAGE_DELETE')}`,
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
        item: DepartmentsEntity;
        col: HTMLTableCellElement;
    }): void {
        console.log(event.item);
        this.router.navigate([MUNICIPALITIES_BY_DEPARTMENT_ID_ROUTE], {
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
        const departments = this.items();
        if (departments && departments.length > 0) {
            const fileName = `${this.exportFilePrefix}-departments`;
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

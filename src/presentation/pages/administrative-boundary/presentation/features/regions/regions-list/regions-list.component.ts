import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { FilterField } from '@shared/components/filter/filter.types';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';
import { parseAndValidateDateRange } from '@shared/domain/utils/date-range.utils';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';

import { RegionsFacade } from '@presentation/pages/administrative-boundary/core/application/services/regions/regions.facade';
import { REGIONS_TABLE_CONST } from '@presentation/pages/administrative-boundary/core/domain/constants/regions/regions-table.constants';
import { RegionsFilterControl } from '@presentation/pages/administrative-boundary/core/domain/controls/regions/regions-filter.control';
import { RegionsEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/regions.entity';
import { RegionsFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/regions/regions-filter.vo';

import {
    DEPARTMENTS_BY_REGION_ID_ROUTE,
    REGIONS_FORM,
} from '../regions.routes';

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
})
export class RegionsListComponent implements OnInit {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    public readonly facade = inject(RegionsFacade);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );
    private readonly appCustomizationService = inject(AppCustomizationService);
    public readonly tableConfig = REGIONS_TABLE_CONST;
    readonly regions = toSignal(this.facade.items$, { initialValue: [] });
    readonly isLoading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: {} as Paginate<RegionsEntity>,
    });
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );
    public formFilter!: FormGroup<RegionsFilterControl>;
    public filterFields: FilterField[] = [];
    public statusOptions: { label: string; value: boolean }[] = [];

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
        effect(() => {
            const filter = RegionsFilter.create();
            this.facade.readAll(filter);
        });
    }

    ngOnInit(): void {
        this.loadTranslatedOptions();
        this.initFilter();
        this.initFilterFields();
    }

    private loadTranslatedOptions(): void {
        this.statusOptions = [
            { label: this.translate.instant('COMMON.ACTIVATED'), value: true },
            {
                label: this.translate.instant('COMMON.DEACTIVATED'),
                value: false,
            },
        ];
    }

    private initFilter(): void {
        if (!this.formFilter) {
            this.formFilter = this.fb.group<RegionsFilterControl>({
                search: new FormControl<string | null>(null),
                departmentId: new FormControl<string | null>(null),
                municipalityCode: new FormControl<string | null>(null),
                isActive: new FormControl<boolean | null>(null),
                startDate: new FormControl<string | null>(null),
                endDate: new FormControl<string | null>(null),
            });
        }
    }

    private initFilterFields(): void {
        this.filterFields = [
            {
                type: 'text',
                name: 'search',
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
                name: 'startDate',
                label: 'ADMINISTRATIVE_BOUNDARY.REGIONS.FILTER.DATE.FROM',
                placeholder:
                    'ADMINISTRATIVE_BOUNDARY.REGIONS.FILTER.DATE.PLACEHOLDER',
            },
            {
                type: 'date',
                name: 'endDate',
                label: 'ADMINISTRATIVE_BOUNDARY.REGIONS.FILTER.DATE.TO',
                placeholder:
                    'ADMINISTRATIVE_BOUNDARY.REGIONS.FILTER.DATE.PLACEHOLDER',
            },
        ];
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
        const filter = RegionsFilter.create({
            search: formValue.search,
            isActive: formValue.isActive,
            startDate: startDate?.format('YYYY-MM-DD'),
            endDate: endDate?.format('YYYY-MM-DD'),
        });
        this.facade.readAll(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.facade.changePage(event + 1);
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
                code: item.uniqId,
                ref: ref,
            },
        });
    }

    public onViewClicked(item: RegionsEntity): void {
        /* this.router.navigate([item.uniqId, REGIONS_VIEW_ROUTE], {
            relativeTo: this.activatedRoute,
        }); */
        console.log('View region', item);
    }

    public onDeleteClicked(item: RegionsEntity): void {
        if (this.regions().length < 1 && !item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'ADMINISTRATIVE_BOUNDARY.REGIONS.SWEET_ALERT.TITLE_DELETE'
            ),
            text: `${this.translate.instant('ADMINISTRATIVE_BOUNDARY.REGIONS.SWEET_ALERT.MESSAGE_DELETE')}`,
            backdrop: false,
            confirmButtonText: this.translate.instant('COMMON.CONFIRM'),
            cancelButtonText: this.translate.instant('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade
                    .delete(item.uniqId)
                    .subscribe(() =>
                        this.facade.refreshWithLastFilterAndPage()
                    );
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
                code: event.item.uniqId,
                name: event.item.name,
            },
        });
    }

    public onExportExcel(): void {
        const regions = this.regions();
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

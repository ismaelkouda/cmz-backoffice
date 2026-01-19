import { CommonModule } from "@angular/common";
import { Component, OnInit, effect, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { DepartmentsFacade } from "@presentation/pages/administrative-boundary/core/application/services/departments/departments.facade";
import { RegionsSelectFacade } from "@presentation/pages/administrative-boundary/core/application/services/regions/regions-select.facade";
import { DEPARTMENTS_TABLE_CONST } from "@presentation/pages/administrative-boundary/core/domain/constants/departments/departments-table.constants";
import { DepartmentsFilterControl } from "@presentation/pages/administrative-boundary/core/domain/controls/departments/departments-filter.control";
import { DepartmentsEntity } from "@presentation/pages/administrative-boundary/core/domain/entities/departments/departments.entity";
import { FilterComponent } from "@shared/components/filter/filter.component";
import { FilterField } from "@shared/components/filter/filter.types";
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { TableComponent } from "@shared/components/table/table.component";
import { SWEET_ALERT_PARAMS } from "@shared/constants/swalWithBootstrapButtonsParams.constant";
import { Paginate } from "@shared/data/dtos/simple-response.dto";
import { parseAndValidateDateRange } from "@shared/domain/utils/date-range.utils";
import { AppCustomizationService } from "@shared/services/app-customization.service";
import { TableExportExcelFileService } from "@shared/services/table-export-excel-file.service";
import { ToastrService } from "ngx-toastr";
import SweetAlert from 'sweetalert2';
import { CrudFormType } from "../../../../../../../shared/domain/utils/crud-form-utils";
import { DEPARTMENTS_FORM, MUNICIPALITIES_BY_DEPARTMENT_ID_ROUTE } from "../departments.routes";

@Component({
    selector: "app-departments-list",
    standalone: true,
    imports: [CommonModule, FilterComponent, TableComponent, PaginationComponent, ReactiveFormsModule],
    templateUrl: "./departments-list.component.html",
    styleUrls: ["./departments-list.component.scss"],
})
export class DepartmentsListComponent implements OnInit {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    public readonly facade = inject(DepartmentsFacade);
    public readonly regionFacade = inject(RegionsSelectFacade);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);
    private readonly tableExportExcelFileService = inject(TableExportExcelFileService);
    private readonly appCustomizationService = inject(AppCustomizationService);
    public readonly tableConfig = DEPARTMENTS_TABLE_CONST;
    readonly regions = toSignal(this.regionFacade.items$, { initialValue: [] });
    readonly departments = toSignal(this.facade.items$, { initialValue: [] });
    readonly isLoading = toSignal(this.facade.isLoading$, { initialValue: false });
    readonly pagination = toSignal(this.facade.pagination$, { initialValue: {} as Paginate<DepartmentsEntity> });
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );
    public formFilter!: FormGroup<DepartmentsFilterControl>;
    public filterFields: FilterField[] = [];
    public statusOptions: { label: string; value: boolean }[] = [];

    constructor() {
        this.title.setTitle(this.translate.instant("ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TITLE"));
        effect(() => {
            this.facade.readAll();
            this.regionFacade.readAll();
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
            this.formFilter = this.fb.group<DepartmentsFilterControl>({
                search: new FormControl<string | null>(null),
                regionCode: new FormControl<string | null>(null),
                municipalityId: new FormControl<string | null>(null),
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
                label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.SEARCH',
                placeholder: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.SEARCH_PLACEHOLDER',
            },
            {
                type: 'select',
                name: 'regionCode',
                label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.REGION',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                options: this.regions(),
                optionLabel: 'name',
                optionValue: 'code',
                showClear: true,
                filter: true,
            },
            /* {
                type: 'select',
                name: 'isActive',
                label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.STATUS',
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
                label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.DATE.FROM',
                placeholder: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.DATE.PLACEHOLDER',
            },
            {
                type: 'date',
                name: 'endDate',
                label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.DATE.TO',
                placeholder: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.DATE.PLACEHOLDER',
            }
        ];
    }

    public filter(formValue: any): void {
        const {
            startDate,
            endDate,
            isValidRange
        } = parseAndValidateDateRange(formValue.startDate, formValue.endDate);
        if (!isValidRange) {
            this.toastService.error(
                this.translate.instant('COMMON.INVALID_DATE_RANGE')
            );
            return;
        }
        const filter = {
            search: formValue.search,
            regionCode: formValue.regionCode,
            isActive: formValue.isActive,
            startDate: startDate?.format('YYYY-MM-DD'),
            endDate: endDate?.format('YYYY-MM-DD')
        };
        this.facade.readAll(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.facade.changePage(event + 1);
    }

    public refresh(): void {
        this.facade.refresh();
    }

    public onCreateClicked({ ref }: { ref: CrudFormType }): void {
        this.router.navigate([DEPARTMENTS_FORM], {
            relativeTo: this.activatedRoute,
            queryParams: {
                ref: ref,
            },
        });
    }

    public onEditClicked({ item, ref }: { item: DepartmentsEntity, ref: CrudFormType }): void {
        console.log(item);
        this.router.navigate([DEPARTMENTS_FORM], {
            relativeTo: this.activatedRoute,
            queryParams: {
                code: item.code,
                ref: ref,
            },
        });
    }

    public onViewClicked(item: DepartmentsEntity): void {
        /* this.router.navigate([item.uniqId, DEPARTMENTS_VIEW_ROUTE], {
            relativeTo: this.activatedRoute,
        }); */
    }

    public onDeleteClicked(item: DepartmentsEntity): void {
        if (this.departments().length < 1 && !item.code) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.TITLE_DELETE'),
            text: `${this.translate.instant('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.MESSAGE_DELETE')}`,
            backdrop: false,
            confirmButtonText: this.translate.instant('COMMON.CONFIRM'),
            cancelButtonText: this.translate.instant('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.delete(item.code).subscribe(() => this.facade.refreshWithLastFilterAndPage());
            }
        });
    }

    public onBadgeClick(event: { item: DepartmentsEntity; col: HTMLTableCellElement }): void {
        console.log(event.item);
        this.router.navigate([MUNICIPALITIES_BY_DEPARTMENT_ID_ROUTE], {
            relativeTo: this.activatedRoute,
            queryParams: {
                code: event.item.code,
                name: event.item.name,
            }
        });
    }

    public onExportExcel(): void {
        const departments = this.departments();
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
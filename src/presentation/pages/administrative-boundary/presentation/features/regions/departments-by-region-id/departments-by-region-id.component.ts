import { CommonModule } from "@angular/common";
import { Component, effect, inject, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { REGIONS_ROUTE } from "@presentation/pages/administrative-boundary/administrative-boundary.route";
import { DepartmentsByRegionIdFacade } from "@presentation/pages/administrative-boundary/core/application/services/regions/departments-by-region-id.facade";
import { DEPARTMENTS_BY_REGION_ID_TABLE_CONST } from "@presentation/pages/administrative-boundary/core/domain/constants/regions/departments-by-region-id-table.constants";
import { DepartmentsByRegionIdFilterControl } from "@presentation/pages/administrative-boundary/core/domain/controls/regions/departments-by-region-id-filter.control";
import { DepartmentsByRegionIdEntity } from "@presentation/pages/administrative-boundary/core/domain/entities/regions/departments-by-region-id.entity";
import { BreadcrumbComponent } from "@shared/components/breadcrumb/breadcrumb.component";
import { FilterComponent } from "@shared/components/filter/filter.component";
import { FilterField } from "@shared/components/filter/filter.types";
import { PageTitleComponent } from "@shared/components/page-title/page-title.component";
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { TableComponent } from "@shared/components/table/table.component";
import { Paginate } from "@shared/data/dtos/simple-response.dto";
import { parseAndValidateDateRange } from "@shared/domain/utils/date-range.utils";
import { ADMINISTRATIVE_BOUNDARY_ROUTE } from "@shared/routes/routes";
import { ToastrService } from "ngx-toastr";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { map } from "rxjs";

@Component({
    selector: "app-departments-by-region-id",
    standalone: true,
    templateUrl: "./departments-by-region-id.component.html",
    styleUrls: ["./departments-by-region-id.component.scss"],
    imports: [CommonModule, PageTitleComponent, BreadcrumbComponent, FilterComponent, TableComponent, PaginationComponent, TranslateModule, ButtonModule, TagModule]
})
export class DepartmentsByRegionIdComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(DepartmentsByRegionIdFacade);
    private readonly title = inject(Title);
    readonly departments = toSignal(this.facade.items$, { initialValue: [] });
    private readonly filterData = toSignal(this.facade.currentFilter$, { initialValue: null });
    readonly isLoading = toSignal(this.facade.isLoading$, { initialValue: false });
    readonly pagination = toSignal(this.facade.pagination$, { initialValue: {} as Paginate<DepartmentsByRegionIdEntity> });
    private readonly paramsCode: Signal<string> = toSignal(
        this.route.queryParams.pipe(map(params => params['code'])),
        { initialValue: '' }
    );
    public readonly paramsName: Signal<string> = toSignal(
        this.route.queryParams.pipe(map(params => params['name'])),
        { initialValue: '' }
    );

    public readonly tableConfig = DEPARTMENTS_BY_REGION_ID_TABLE_CONST;

    public formFilter: FormGroup<DepartmentsByRegionIdFilterControl> = this.fb.group<DepartmentsByRegionIdFilterControl>({
        regionCode: new FormControl<string | null>(this.paramsCode()),
        search: new FormControl<string | null>(null),
        municipalityCode: new FormControl<string | null>(null),
        isActive: new FormControl<boolean | null>(null),
        startDate: new FormControl<string | null>(null),
        endDate: new FormControl<string | null>(null),
    });

    public filterFields: FilterField[] = [
        {
            type: 'text',
            name: 'search',
            label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.FILTER.SEARCH',
            placeholder: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.FILTER.SEARCH_PLACEHOLDER',
        },
        /* {
            type: 'select',
            name: 'municipalityCode',
            label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.FILTER.MUNICIPALITY',
            placeholder: 'COMMON.SELECT_PLACEHOLDER',
            options: ,
            optionLabel: 'name',
            optionValue: 'id',
            showClear: true,
            filter: true,
        }, */
        {
            type: 'date',
            name: 'startDate',
            label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.FILTER.DATE.FROM',
            placeholder: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.FILTER.DATE.PLACEHOLDER',
        },
        {
            type: 'date',
            name: 'endDate',
            label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.FILTER.DATE.TO',
            placeholder: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.FILTER.DATE.PLACEHOLDER',
        }
    ];

    constructor() {
        this.title.setTitle(this.translate.instant("ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.TITLE"));
        effect(() => {
            const regionCode = this.paramsCode();
            if (regionCode) {
                this.facade.reset();
                this.facade.execute({ regionCode });
            } else {
                this.facade.reset();
                this.formFilter.reset();
            }
        });
        effect(() => {
            if (this.filterData()) {
                this.formFilter.patchValue({
                    regionCode: this.paramsCode(),
                    search: this.filterData()?.search,
                    municipalityCode: this.filterData()?.municipalityCode,
                    isActive: this.filterData()?.isActive,
                    startDate: this.filterData()?.startDate,
                    endDate: this.filterData()?.endDate,
                });
            }
        });
    }

    public filter(filterValue: any): void {
        if (!this.paramsCode()) return;
        const {
            startDate,
            endDate,
            isValidRange
        } = parseAndValidateDateRange(filterValue.startDate, filterValue.endDate);
        if (!isValidRange) {
            this.toastService.error(
                this.translate.instant('COMMON.INVALID_DATE_RANGE')
            );
            return;
        }
        const filter = {
            ...filterValue,
            regionCode: this.paramsCode(),
            municipalityCode: filterValue.municipalityCode,
            startDate: startDate?.format('YYYY-MM-DD'),
            endDate: endDate?.format('YYYY-MM-DD')
        }
        this.facade.execute(filter, '1', true);
    }

    public onPageChange(event: number): void {
        if (this.paramsCode()) {
            this.facade.changePage(event + 1);
        }
    }

    public refresh(): void {
        this.facade.refresh();
    }

    public onCancel(): void {
        this.router.navigate([`${ADMINISTRATIVE_BOUNDARY_ROUTE}/${REGIONS_ROUTE}`]);
    }
}

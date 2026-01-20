import { CommonModule } from "@angular/common";
import { Component, effect, inject, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { DEPARTMENTS_ROUTE } from "@presentation/pages/administrative-boundary/administrative-boundary.route";
import { MunicipalitiesByDepartmentIdFacade } from "@presentation/pages/administrative-boundary/core/application/services/departments/municipalities-by-department-id.facade";
import { MUNICIPALITIES_BY_DEPARTMENT_ID_TABLE_CONST } from "@presentation/pages/administrative-boundary/core/domain/constants/departments/municipalities-by-department-id-table.constants";
import { MunicipalitiesByDepartmentIdFilterControl } from "@presentation/pages/administrative-boundary/core/domain/controls/departments/municipalities-by-department-id-filter.control";
import { MunicipalitiesByDepartmentIdEntity } from "@presentation/pages/administrative-boundary/core/domain/entities/departments/municipalities-by-department-id.entity";
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
    selector: "app-municipalities-by-department-id",
    standalone: true,
    templateUrl: "./municipalities-by-department-id.component.html",
    styleUrls: ["./municipalities-by-department-id.component.scss"],
    imports: [CommonModule, PageTitleComponent, BreadcrumbComponent, FilterComponent, TableComponent, PaginationComponent, TranslateModule, ButtonModule, TagModule]
})
export class MunicipalitiesByDepartmentIdComponent {
    private readonly title = inject(Title);
    private readonly facade = inject(MunicipalitiesByDepartmentIdFacade);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);
    readonly municipalities = toSignal(this.facade.items$, { initialValue: [] });
    readonly currentFilter = toSignal(this.facade.currentFilter$, { initialValue: null })
    readonly isLoading = toSignal(this.facade.isLoading$, { initialValue: false });
    readonly pagination = toSignal(this.facade.pagination$, { initialValue: {} as Paginate<MunicipalitiesByDepartmentIdEntity> });
    public readonly tableConfig = MUNICIPALITIES_BY_DEPARTMENT_ID_TABLE_CONST;
    private readonly paramsCode: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(map(params => params['code'])),
        { initialValue: '' }
    );
    public readonly paramsName: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(map(params => params['name'])),
        { initialValue: '' }
    );

    public formFilter: FormGroup<MunicipalitiesByDepartmentIdFilterControl> = this.fb.group<MunicipalitiesByDepartmentIdFilterControl>({
        departmentCode: new FormControl(this.paramsCode()),
        search: new FormControl(''),
        isActive: new FormControl(null),
        startDate: new FormControl(null),
        endDate: new FormControl(null),
    });

    public filterFields: FilterField[] = [
        {
            type: 'text',
            name: 'search',
            label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.FILTER.SEARCH',
            placeholder: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.FILTER.SEARCH_PLACEHOLDER',
        },
        {
            type: 'date',
            name: 'startDate',
            label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.FILTER.DATE.FROM',
            class: 'p-short'
        },
        {
            type: 'date',
            name: 'endDate',
            label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.FILTER.DATE.TO',
            class: 'p-short'
        }
    ];

    constructor() {
        this.title.setTitle("ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.TITLE");
        effect(() => {
            const departmentCode = this.paramsCode();
            if (departmentCode) {
                this.facade.reset();
                this.facade.execute({ departmentCode });
            } else {
                this.facade.reset();
                this.formFilter.reset();
            }
        });

        effect(() => {
            if (this.currentFilter()) {
                this.formFilter.patchValue({
                    departmentCode: this.paramsCode(),
                    search: this.currentFilter()?.search,
                    isActive: this.currentFilter()?.isActive,
                    startDate: this.currentFilter()?.startDate,
                    endDate: this.currentFilter()?.endDate
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
            departmentCode: this.paramsCode(),
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
        this.router.navigate([`${ADMINISTRATIVE_BOUNDARY_ROUTE}/${DEPARTMENTS_ROUTE}`]);
    }
}

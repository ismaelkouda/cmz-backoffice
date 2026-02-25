import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    effect,
    inject,
    Signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { map, tap } from 'rxjs';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { parseAndValidateDateRange } from '@shared/domain/utils/date-range.utils';
import { ADMINISTRATIVE_BOUNDARY_ROUTE } from '@shared/routes/routes';

import { REGIONS_ROUTE } from '@presentation/pages/administrative-boundary/administrative-boundary.routes';
import { DepartmentsByRegionIdFacade } from '@presentation/pages/administrative-boundary/application/services/regions/departments-by-region-id.facade';
import { DEPARTMENTS_BY_REGION_ID_TABLE } from '@presentation/pages/administrative-boundary/domain/constants/regions/departments-by-region-id-table.constants';
import { DepartmentsByRegionIdFilterControl } from '@presentation/pages/administrative-boundary/domain/controls/regions/departments-by-region-id-filter.control';
import { DepartmentsByRegionIdEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';

@Component({
    selector: 'app-departments-by-region-id',
    standalone: true,
    templateUrl: './departments-by-region-id.component.html',
    styleUrls: ['./departments-by-region-id.component.scss'],
    imports: [
        CommonModule,
        PageTitleComponent,
        BreadcrumbComponent,
        FilterComponent,
        TableComponent,
        PaginationComponent,
        TranslateModule,
        ButtonModule,
        TagModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentsByRegionIdComponent {
    private readonly title = inject(Title);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(DepartmentsByRegionIdFacade);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly router = inject(Router);
    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });
    readonly isLoading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: {} as Paginate<DepartmentsByRegionIdEntity>,
    });

    public readonly tableConfig = DEPARTMENTS_BY_REGION_ID_TABLE;
    private readonly paramsUniqId = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((p) => (p['uniqId'] as string) || '')
        ),
        { initialValue: '' }
    );
    public readonly paramsName: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(map((params) => params['name'])),
        { initialValue: '' }
    );

    public formFilter: FormGroup<DepartmentsByRegionIdFilterControl> =
        this.fb.group<DepartmentsByRegionIdFilterControl>({
            search: new FormControl(null),
            municipality: new FormControl(null),
            status: new FormControl(null),
            startDate: new FormControl(null),
            endDate: new FormControl(null),
        });

    public filterFields: FilterField[] = [
        {
            type: 'text',
            name: 'search',
            label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.FILTER.SEARCH',
            placeholder:
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.FILTER.SEARCH_PLACEHOLDER',
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
            placeholder:
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.FILTER.DATE.PLACEHOLDER',
        },
        {
            type: 'date',
            name: 'endDate',
            label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.FILTER.DATE.TO',
            placeholder:
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.FILTER.DATE.PLACEHOLDER',
        },
    ];

    private readonly patchFormFromItem = effect(() => {
        const item = this.currentFilter();
        if (item && Object.keys(item).length > 0) {
            this.formFilter.patchValue(
                {
                    search: item.search,
                    municipality: item.municipality,
                    status: item.status,
                    startDate: item.startDate,
                    endDate: item.endDate,
                },
                { emitEvent: false }
            );
        }
    });

    constructor() {
        this.title.setTitle(
            this.translate.instant(
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.TITLE'
            )
        );
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams
            .pipe(
                map((p) => (p['uniqId'] as string) || ''),
                tap((uniqId) => {
                    if (uniqId) {
                        this.facade.reset();
                        this.facade.execute({ uniqId });
                    } else {
                        this.facade.reset();
                        this.formFilter.reset();
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    public filter(filterValue: any): void {
        if (!this.paramsUniqId()) {
            return;
        }
        const { startDate, endDate, isValidRange } = parseAndValidateDateRange(
            filterValue.startDate,
            filterValue.endDate
        );
        if (!isValidRange) {
            this.toastService.error(
                this.translate.instant('COMMON.INVALID_DATE_RANGE')
            );
            return;
        }
        const filter = {
            ...filterValue,
            departmentId: this.paramsUniqId(),
            startDate: startDate?.format('YYYY-MM-DD'),
            endDate: endDate?.format('YYYY-MM-DD'),
        };
        this.facade.execute(filter, '1', true);
    }

    public onPageChange(event: number): void {
        if (this.paramsUniqId()) {
            this.facade.changePage(JSON.stringify(event + 1));
        }
    }

    public refresh(): void {
        this.facade.refresh();
    }

    public onCancel(): void {
        this.router.navigate([
            `${ADMINISTRATIVE_BOUNDARY_ROUTE}/${REGIONS_ROUTE}`,
        ]);
    }
}

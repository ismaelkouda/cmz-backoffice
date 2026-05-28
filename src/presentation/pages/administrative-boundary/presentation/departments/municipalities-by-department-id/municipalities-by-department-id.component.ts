import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    effect,
    inject,
    OnInit,
    Signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DEPARTMENTS_ROUTE } from '@pages/administrative-boundary/administrative-boundary.routes';
import { MunicipalitiesByDepartmentIdFacade } from '@pages/administrative-boundary/application/services/departments/municipalities-by-department-id.facade';
import { MUNICIPALITIES_BY_DEPARTMENT_ID_TABLE_CONST } from '@pages/administrative-boundary/domain/constants/departments/municipalities-by-department-id-table.constants';
import { MunicipalitiesByDepartmentIdFilterControl } from '@pages/administrative-boundary/domain/controls/departments/municipalities-by-department-id-filter.control';
import { MunicipalitiesByDepartmentIdEntity } from '@pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { parseAndValidateDateRange } from '@shared/domain/utils/date-range.utils';
import { ADMINISTRATIVE_BOUNDARY_ROUTE } from '@shared/routes/routes';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { map, tap } from 'rxjs';

@Component({
    selector: 'app-municipalities-by-department-id',
    standalone: true,
    templateUrl: './municipalities-by-department-id.component.html',
    styleUrls: ['./municipalities-by-department-id.component.scss'],
    imports: [
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
export class MunicipalitiesByDepartmentIdComponent implements OnInit {
    private readonly title = inject(Title);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(MunicipalitiesByDepartmentIdFacade);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly router = inject(Router);
    readonly items = toSignal(this.facade.items$, {
        initialValue: [],
    });
    readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });
    readonly isLoading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: {} as Paginate<MunicipalitiesByDepartmentIdEntity>,
    });
    public readonly tableConfig = MUNICIPALITIES_BY_DEPARTMENT_ID_TABLE_CONST;
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

    public formFilter: FormGroup<MunicipalitiesByDepartmentIdFilterControl> =
        this.fb.group<MunicipalitiesByDepartmentIdFilterControl>({
            search: new FormControl(null),
            region: new FormControl(null),
            department: new FormControl(null),
            status: new FormControl(null),
            startDate: new FormControl(null),
            endDate: new FormControl(null),
        });

    public filterFields: FilterField[] = [
        {
            type: 'text',
            name: 'search',
            label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.FILTER.SEARCH',
            placeholder:
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.FILTER.SEARCH_PLACEHOLDER',
        },
        {
            type: 'date',
            name: 'startDate',
            label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.FILTER.DATE.FROM',
            class: 'p-short',
        },
        {
            type: 'date',
            name: 'endDate',
            label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.FILTER.DATE.TO',
            class: 'p-short',
        },
    ];

    private readonly patchFormFromItem = effect(() => {
        const item = this.currentFilter();
        if (item && Object.keys(item).length > 0) {
            this.formFilter.patchValue(
                {
                    search: item.search,
                    region: item.region,
                    department: item.department,
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
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.TITLE'
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
            department: this.paramsUniqId(),
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
            `${ADMINISTRATIVE_BOUNDARY_ROUTE}/${DEPARTMENTS_ROUTE}`,
        ]);
    }
}

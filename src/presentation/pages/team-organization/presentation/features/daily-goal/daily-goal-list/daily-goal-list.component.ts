import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    OnDestroy,
    OnInit,
    Signal,
    signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { DailyGoalFacade } from '@pages/team-organization/application/services/daily-goal/daily-goal.facade';
import { DailyGoalFilterControl } from '@pages/team-organization/domain/controls/daily-goal/daily-goal-filter.control';
import { DailyGoalEntity } from '@pages/team-organization/domain/entities/daily-goal/daily-goal.entity';
import { Status } from '@pages/team-organization/domain/enums/daily-goal/daily-goal-status.enum';
import { DAILY_GOAL_FORM } from '@pages/team-organization/presentation/features/daily-goal/daily-goal-paths.constants';
import { DAILY_GOAL_TABLE_CONSTANT } from '@presentation/pages/team-organization/presentation/adapters/daily-goal/daily-goal-table.constant';
import { DailyGoalPresenter } from '@presentation/pages/team-organization/presentation/adapters/daily-goal/daily-goal-vm.presenter';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptions,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-daily-goal',
    standalone: true,
    templateUrl: './daily-goal-list.component.html',
    styleUrls: ['./daily-goal-list.component.scss'],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        FilterComponent,
        TableComponent,
        PaginationComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyGoalListComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public readonly facade = inject(DailyGoalFacade);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.config.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    private readonly destroy$ = new Subject<void>();
    public readonly tableConfig = DAILY_GOAL_TABLE_CONSTANT;
    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    readonly statusOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(Status, this.t.bind(this));
    });

    readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();

        return [
            {
                type: 'date',
                name: 'startDate',
                label: 'TEAM_ORGANIZATION.DAILY_GOAL.FILTER.DATE.FROM',
                placeholder:
                    'TEAM_ORGANIZATION.DAILY_GOAL.FILTER.DATE.PLACEHOLDER',
            },
            {
                type: 'date',
                name: 'endDate',
                label: 'TEAM_ORGANIZATION.DAILY_GOAL.FILTER.DATE.TO',
                placeholder:
                    'TEAM_ORGANIZATION.DAILY_GOAL.FILTER.DATE.PLACEHOLDER',
            },
        ];
    });
    readonly presenter = new DailyGoalPresenter(
        this.translate.instant.bind(this.translate)
    );
    readonly itemsVM = computed(() => {
        this.currentLang();
        return this.items().map((item) => this.presenter.map(item));
    });
    readonly form = this.fb.group<DailyGoalFilterControl>({
        startDate: new FormControl<Date | undefined>(undefined, {
            nonNullable: true,
        }),
        endDate: new FormControl<Date | undefined>(undefined, {
            nonNullable: true,
        }),
    });

    constructor() {
        this.facade.readAll();
        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });

        effect(() => {
            this.filterFields();
            this.statusOptions();
        });
    }

    ngOnInit(): void {
        this.title.setTitle(this.t('TEAM_ORGANIZATION.DAILY_GOAL.PAGE_TITLE'));

        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.title.setTitle(
                    this.t('TEAM_ORGANIZATION.DAILY_GOAL.PAGE_TITLE')
                );
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onFilterClicked(filterValues: any): void {
        this.facade.readAll(filterValues, '1', true);
    }

    public onRefreshClicked(): void {
        this.form.reset();
        this.facade.refresh();
    }

    public onPageChangeClicked(page: number): void {
        this.facade.changePage(JSON.stringify(page + 1));
    }

    public onNavigateToForm(event: {
        item: DailyGoalEntity;
        ref: CrudFormType;
    }): void {
        const queryParams = { uniqId: event.item.uniqId, ref: event.ref };
        this.router.navigate(['../', DAILY_GOAL_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    public onExportExcel(): void {
        const items = this.items();
        if (!items.length) {
            this.toast.error(this.t('EXPORT.NO_DATA'));
            return;
        }

        this.exportService.exportAsExcelFile(
            items,
            this.tableConfig,
            `${this.exportFilePrefix}-daily-goal`
        );
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }

    private normalizeExportPrefix(name: string): string {
        return (
            name
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }

    public getCurrentLanguage(): string {
        return this.currentLang();
    }
}

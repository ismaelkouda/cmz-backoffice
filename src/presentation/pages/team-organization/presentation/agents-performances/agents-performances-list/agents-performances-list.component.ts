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
import { AgentsPerformancesFacade } from '@pages/team-organization/application/services/agents-performances/agents-performances.facade';
import { AGENTS_PERFORMANCES_TABLE_CONSTANT } from '@pages/team-organization/domain/constants/agents-performances/agents-performances-table.constant';
import { AgentsPerformancesFilterControl } from '@pages/team-organization/domain/controls/agents-performances/agents-performances-filter.control';
import { AgentsPerformancesEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances.entity';
import { AGENTS_PERFORMANCES_STATUS } from '@pages/team-organization/domain/enums/agents-performances/agents-performances-status.enum';
import { AGENTS_PERFORMANCES_FORM } from '@pages/team-organization/presentation/agents-performances/agents-performances.routes';
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
    selector: 'app-agents-performances',
    standalone: true,
    templateUrl: './agents-performances-list.component.html',
    styleUrls: ['./agents-performances-list.component.scss'],
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
export class AgentsPerformancesListComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public readonly facade = inject(AgentsPerformancesFacade);
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
    public readonly tableConfig = AGENTS_PERFORMANCES_TABLE_CONSTANT;
    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    readonly statusOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(
            AGENTS_PERFORMANCES_STATUS,
            this.t.bind(this)
        );
    });

    readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        const statusOpts = this.statusOptions();

        return [
            {
                type: 'text',
                name: 'search',
                label: this.t(
                    'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.SEARCH'
                ),
                placeholder: this.t(
                    'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.SEARCH_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.SEARCH',
                    placeholder:
                        'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'isActive',
                label: this.t(
                    'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.STATUS'
                ),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: statusOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.STATUS',
                },
            },
            {
                type: 'text',
                name: 'member',
                label: this.t(
                    'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.PARTICIPANT'
                ),
                placeholder: this.t(
                    'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.PARTICIPANT_PLACEHOLDER'
                ),
                icon: 'pi pi-user',
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.PARTICIPANT',
                    placeholder:
                        'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.PARTICIPANT_PLACEHOLDER',
                },
            },
            {
                type: 'date',
                name: 'startDate',
                label: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.DATE.FROM',
                placeholder:
                    'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.DATE.PLACEHOLDER',
            },
            {
                type: 'date',
                name: 'endDate',
                label: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.DATE.TO',
                placeholder:
                    'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.DATE.PLACEHOLDER',
            },
        ];
    });
    readonly form = this.fb.group<AgentsPerformancesFilterControl>({
        search: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        member: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        isActive: new FormControl<boolean | undefined>(undefined, {
            nonNullable: true,
        }),
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
        this.title.setTitle(
            this.t('TEAM_ORGANIZATION.AGENTS_PERFORMANCES.PAGE_TITLE')
        );

        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.title.setTitle(
                    this.t('TEAM_ORGANIZATION.AGENTS_PERFORMANCES.PAGE_TITLE')
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
        item: AgentsPerformancesEntity;
        ref: CrudFormType;
    }): void {
        const queryParams = { uniqId: event.item.uniqId, ref: event.ref };
        this.router.navigate([AGENTS_PERFORMANCES_FORM], {
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
            `${this.exportFilePrefix}-agents-performances`
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

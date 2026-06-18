import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
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
import { AgentsPerformancesFilterControl } from '@pages/team-organization/domain/controls/agents-performances/agents-performances-filter.control';
import { Status } from '@pages/team-organization/domain/enums/agents-performances/agents-performances-status.enum';
import { AGENTS_PERFORMANCES_FORM } from '@pages/team-organization/presentation/features/agents-performances/agents-performances-paths.constants';
import { AGENTS_PERFORMANCES_TABLE_CONSTANT } from '@presentation/pages/team-organization/presentation/adapters/agents-performances/agents-performances-table.constant';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptions,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

import { AgentsPerformancesPresenter } from '../../../adapters/agents-performances/agents-performances-vm.presenter';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { formatDate } from '@shared/domain/functions/format-data.function';
import { AgentsPerformancesVmProps } from '../../../adapters/agents-performances/agents-performances-vm-props.interface';

@Component({
    selector: 'app-agents-performances',
    standalone: true,
    templateUrl: './agents-performances-list.component.html',
    styleUrls: ['./agents-performances-list.component.scss'],
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        FilterComponent,
        TableComponent,
        PaginationComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentsPerformancesListComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly title = inject(Title);
    public readonly facade = inject(AgentsPerformancesFacade);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly excelExport = inject(ExcelExportService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.customization.app.name
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
        return enumToFilterOptions(Status, this.t.bind(this));
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
    protected readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.REFRESH',
            actionId: 'refresh',
            class: 'btn-dark',
            icon: 'pi pi-refresh',
            translateKey: 'COMMON.REFRESH',
            tooltip: this.t(
                'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TOOLTIP.REFRESH'
            ),
        },
        {
            label: 'COMMON.EXPORT',
            actionId: 'export',
            class: 'btn-success',
            icon: 'pi pi-file',
            translateKey: 'COMMON.EXPORT',
            tooltip: this.exportTooltip(),
            disabled: this.canExportData(),
        },
    ]);
    readonly presenter = new AgentsPerformancesPresenter(
        this.translate.instant.bind(this.translate)
    );
    readonly itemsVM = computed(() => {
        this.currentLang();
        return this.items().map((item) => this.presenter.map(item));
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

    private readonly canExport = this.permissionActions.can(
        '/organization/agent-performances',
        'export'
    );
    private readonly canExportData = computed(
        () => !this.canExport() || this.itemsVM().length < 1 || this.loading()
    );
    private readonly exportTooltip = computed(() => {
        const permission = !this.canExport();
        const noData = this.itemsVM().length < 1;
        if (permission) {
            return this.t(
                'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TOOLTIP.NO_PERMISSION_EXPORT'
            );
        }
        if (noData) {
            return this.t(
                'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TOOLTIP.NO_EXPORT'
            );
        }
        return this.t(
            'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TOOLTIP.EXPORT'
        ).replace('{nb}', String(this.itemsVM().length));
    });
    constructor() {
        this.facade.readAll();
        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });

        effect(() => {
            this.pageTitle();
            this.filterFields();
            this.statusOptions();
        });
    }
    private pageTitle(): void {
        this.currentLang();
        this.title.setTitle(
            this.t('TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TITLE')
        );
    }
    protected onFilterClicked(): void {
        this.facade.readAll({}, '1', { forceRefresh: true });
    }
    protected onChangePageClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }
    private readonly headerActions: Record<string, () => void> = {
        refresh: () => this.onRefreshData(),
        export: () => {
            if (!this.canExport()) {
                this.toast.error(this.exportTooltip());
                return;
            }
            this.exportData();
        },
    };
    protected onHeaderButtonClicked(actionId: string): void {
        const action = this.headerActions[actionId];
        if (!action) {
            console.warn('Unknown action:', actionId);
            return;
        }
        action();
    }
    private onRefreshData(): void {
        this.facade.refresh();
    }
    protected onActionClicked(event: {
        item: AgentsPerformancesVmProps;
        actionId: string;
    }): void {
        const actions: Record<string, () => void> = {
            view: () => {
                this.onNavigateToForm(event);
            },
        };
        actions[event.actionId]?.();
    }
    private exportData(): void {
        if (!this.canExport()) {
            this.toast.error(this.exportTooltip());
            return;
        }
        const items = this.itemsVM();
        if (!items.length) {
            this.toast.error(this.translate.instant('EXPORT.NO_DATA'));
            return;
        }

        const fileName = `${this.exportFilePrefix}-agents-performances`;

        const exportColumns: ExportColumn[] =
            AGENTS_PERFORMANCES_TABLE_CONSTANT.cols
                .filter((col) => col.field !== '__action')
                .map((col) => {
                    let width = 15;
                    if (col.width) {
                        const num = Number.parseFloat(col.width);
                        width = Number.isNaN(num) ? 15 : num;
                    }
                    return {
                        field: col.field,
                        header: this.translate.instant(col.header),
                        width: width,
                        transform: (value: any, row: any) => {
                            if (col.field === '__index') {
                                return (items.indexOf(row) + 1).toString();
                            }
                            if (col.field === 'createdAt' && value) {
                                return formatDate(value);
                            }
                            if (Array.isArray(value)) {
                                return value.join(', ');
                            }
                            return value ?? '';
                        },
                    };
                });

        this.excelExport
            .exportToExcel({
                fileName: fileName,
                columns: exportColumns,
                data: items,
                sheetName: this.translate.instant(
                    'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TITLE'
                ),
                autoFilter: true,
            })
            .catch((err) => {
                console.error('Export error', err);
                this.toast.error(this.translate.instant('EXPORT.ERROR'));
            });
    }
    private normalizeExportPrefix(appName: string): string {
        return (
            appName
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }

    public onNavigateToForm(event: {
        item: AgentsPerformancesVmProps;
        actionId: string;
    }): void {
        const queryParams = { uniqId: event.item.uniqId, ref: event.actionId };
        this.router.navigate([AGENTS_PERFORMANCES_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }

    public getCurrentLanguage(): string {
        return this.currentLang();
    }
}

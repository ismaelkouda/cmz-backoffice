import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    Signal,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { AccessLogsFacade } from '@pages/settings-security/application/services/access-logs/access-logs.facade';
import { AccessLogsEntity } from '@pages/settings-security/domain/entities/access-logs/access-logs.entity';
import { ACCESS_LOGS_TABLE } from '@presentation/pages/settings-security/presentation/adapters/access-logs/access-logs-table.constant';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptionsWithValue,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { TableComponent } from '@shared/components/table/table.component';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { formatDate } from '@shared/domain/functions/format-data.function';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { ToastrService } from 'ngx-toastr';
import { AccessLogsFilterStore } from '../../store/access-logs/access-logs.store';
import { AccessLogsPresenter } from '../../adapters/access-logs/access-logs-vm.presenter';
import { AccessLogsActions } from '@presentation/pages/settings-security/domain/enums/access-logs/access-logs-actions.enum';

@Component({
    selector: 'app-access-logs',
    standalone: true,
    templateUrl: './access-logs-list.component.html',
    styleUrls: ['./access-logs-list.component.scss'],
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        BreadcrumbComponent,
        PageTitleComponent,
        FilterComponent,
        TableComponent,
        PaginationComponent,
    ],
    providers: [AccessLogsFilterStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessLogsListComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    public readonly facade = inject(AccessLogsFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly formStore = inject(AccessLogsFilterStore);
    private readonly excelExport = inject(ExcelExportService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.customization.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    private readonly canExport = this.permissionActions.can(
        '/report-status/access-logsed',
        'export'
    );
    public readonly tableConfig = ACCESS_LOGS_TABLE;
    protected readonly form = this.formStore.form;
    readonly isLoading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    private readonly items = toSignal(this.facade.items$, {
        initialValue: [],
    });
    protected readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: {} as Paginate<AccessLogsEntity>,
    });
    private readonly actionsOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptionsWithValue(
            AccessLogsActions,
            this.t.bind(this)
        );
    });
    protected readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        return [
            {
                type: 'text',
                name: 'search',
                label: 'SETTINGS_SECURITY.ACCESS_LOGS.FILTER.SEARCH',
                placeholder:
                    'SETTINGS_SECURITY.ACCESS_LOGS.FILTER.SEARCH_PLACEHOLDER',
            },
            {
                label: 'SETTINGS_SECURITY.ACCESS_LOGS.FILTER.ACTION',
                name: 'action',
                type: 'select',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                options: this.actionsOptions(),
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                filter: true,
            },
            {
                type: 'date',
                name: 'startDate',
                label: 'SETTINGS_SECURITY.ACCESS_LOGS.FILTER.DATE.FROM',
                placeholder:
                    'SETTINGS_SECURITY.ACCESS_LOGS.FILTER.DATE.PLACEHOLDER',
            },
            {
                type: 'date',
                name: 'endDate',
                label: 'SETTINGS_SECURITY.ACCESS_LOGS.FILTER.DATE.TO',
                placeholder:
                    'SETTINGS_SECURITY.ACCESS_LOGS.FILTER.DATE.PLACEHOLDER',
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
            tooltip: this.t('SETTINGS_SECURITY.ACCESS_LOGS.TOOLTIP.REFRESH'),
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
    private readonly presenter = new AccessLogsPresenter(
        this.translate.instant.bind(this.translate)
    );
    protected readonly itemsVM = computed(() => {
        return this.items().map((item) => this.presenter.map(item));
    });
    private readonly canExportData = computed(
        () => !this.canExport() || this.itemsVM().length < 1 || this.loading()
    );
    private readonly exportTooltip = computed(() => {
        const permission = !this.canExport();
        const noData = this.itemsVM().length < 1;
        if (permission) {
            return this.t(
                'SETTINGS_SECURITY.ACCESS_LOGS.TOOLTIP.NO_PERMISSION_EXPORT'
            );
        }
        if (noData) {
            return this.t('SETTINGS_SECURITY.ACCESS_LOGS.TOOLTIP.NO_EXPORT');
        }
        return this.t('SETTINGS_SECURITY.ACCESS_LOGS.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    constructor() {
        this.facade.readAll();
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });
        effect(() => {
            this.pageTitle();
            this.filterFields();
        });
    }
    private pageTitle(): void {
        this.currentLang();
        this.title.setTitle(this.t('SETTINGS_SECURITY.ACCESS_LOGS.TITLE'));
    }
    public onFilterClicked(): void {
        this.facade.readAll(this.formStore.value, '1', { forceRefresh: true });
    }
    public onChangePageClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }
    private t(key: string): string {
        return this.translate.instant(key);
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
        this.formStore.reset();
        this.facade.refresh();
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

        const fileName = `${this.exportFilePrefix}-access-logs`;

        const exportColumns: ExportColumn[] = ACCESS_LOGS_TABLE.cols
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
                        if (col.field === 'reportedAt' && value) {
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
                    'SETTINGS_SECURITY.ACCESS_LOGS.TITLE'
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
}

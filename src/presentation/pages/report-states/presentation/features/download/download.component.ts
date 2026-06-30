import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    Signal,
    computed,
    effect,
    inject,
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
import { DownloadFilterDto } from '@pages/report-states/application/dto/download/download-filter.dto';
import { DownloadFacade } from '@pages/report-states/application/services/download/download.facade';
import { DownloadVmProps } from '@pages/report-states/presentation/adapters/download/download-vm-props.interface';
import { DownloadPresenter } from '@pages/report-states/presentation/adapters/download/download-vm.presenter';
import { DownloadFilterStore } from '@pages/report-states/presentation/store/download/download-filter.store';
import {
    DOWNLOAD_DIALOG_TABLE,
    DOWNLOAD_TABLE,
} from '@presentation/pages/report-states/presentation/adapters/download/download-table.constants';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptions,
    enumToFilterOptionsWithValue,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { ToastrService } from 'ngx-toastr';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { formatDate } from '@shared/domain/functions/format-data.function';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { Status } from '@presentation/pages/report-states/domain/enums/download/download-status.enum';

@Component({
    selector: 'app-download',
    standalone: true,
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss'],
    imports: [
        BreadcrumbComponent,
        TableComponent,
        DialogModule,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        ReactiveFormsModule,
        FilterComponent,
        SkeletonModule,
    ],
    providers: [DownloadFilterStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    protected readonly facade = inject(DownloadFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly formStore = inject(DownloadFilterStore);
    private readonly sweetAlert = inject(SweetAlertService);
    private readonly excelExport = inject(ExcelExportService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.customization.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    private readonly canExport = this.permissionActions.can(
        '/report-status/downloads',
        'export'
    );
    private readonly canDownload = this.permissionActions.can(
        '/report-status/downloads',
        'download'
    );
    protected readonly selectedItem = signal<{ name: string; value: string }[]>(
        []
    );
    protected readonly tableDialogConfig = DOWNLOAD_DIALOG_TABLE;
    protected readonly tableConfig = DOWNLOAD_TABLE;
    protected readonly form = this.formStore.form;
    protected readonly isVisibleDialog = signal<boolean>(false);
    private readonly items = toSignal(this.facade.items$, {
        initialValue: [],
    });
    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });
    protected readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    protected readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    private readonly telecomOperatorsOptions: Signal<FilterOption[]> = computed(
        () => {
            this.currentLang();
            return enumToFilterOptions(TelecomOperator, this.t.bind(this));
        }
    );
    private readonly reportSourceOptions: Signal<FilterOption[]> = computed(
        () => {
            this.currentLang();
            return enumToFilterOptions(ReportSource, this.t.bind(this));
        }
    );
    private readonly reportTypeOptions: Signal<FilterOption[]> = computed(
        () => {
            this.currentLang();
            return enumToFilterOptions(ReportType, this.t.bind(this));
        }
    );
    private readonly statusOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptionsWithValue(Status, this.t.bind(this));
    });
    protected readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        // const telecomOperatorsOpts = this.telecomOperatorsOptions();
        // const reportSourceOpts = this.reportSourceOptions();
        // const reportTypeOpts = this.reportTypeOptions();
        const statusOpts = this.statusOptions();
        return [
            {
                type: 'text',
                name: 'search',
                label: this.t('REPORT_STATES.DOWNLOAD.FILTER.SEARCH'),
                placeholder: this.t(
                    'REPORT_STATES.DOWNLOAD.FILTER.SEARCH_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'REPORT_STATES.DOWNLOAD.FILTER.SEARCH',
                    placeholder:
                        'REPORT_STATES.DOWNLOAD.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'status',
                label: this.t('CONTENT_MANAGEMENT.HOME.FILTER.STATUS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: statusOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'CONTENT_MANAGEMENT.HOME.FILTER.STATUS',
                },
            },
            {
                type: 'date',
                name: 'date',
                label: this.t('REPORT_STATES.DOWNLOAD.FILTER.DATE'),
                placeholder: 'COMMON.DATE_PLACEHOLDER',
            },
            // {
            //     type: 'text',
            //     name: 'initiatorPhoneNumber',
            //     label: this.t('REPORT_STATES.DOWNLOAD.FILTER.INITIATOR'),
            //     placeholder: this.t('COMMON.PHONE_PLACEHOLDER'),
            //     icon: 'pi pi-phone',
            //     translationKeys: {
            //         label: 'REPORT_STATES.DOWNLOAD.FILTER.INITIATOR',
            //         placeholder: 'COMMON.PHONE_PLACEHOLDER',
            //     },
            // },
            // {
            //     type: 'text',
            //     name: 'uniqId',
            //     label: this.t('REPORT_STATES.DOWNLOAD.FILTER.UNIQ_ID'),
            //     placeholder: this.t('COMMON.REPORT_UNIQ_ID_PLACEHOLDER'),
            //     icon: 'pi pi-id-card',
            //     translationKeys: {
            //         label: 'REPORT_STATES.DOWNLOAD.FILTER.UNIQ_ID',
            //         placeholder: 'COMMON.REPORT_UNIQ_ID_PLACEHOLDER',
            //     },
            // },
            // {
            //     type: 'select',
            //     name: 'reportType',
            //     label: this.t('REPORT_STATES.DOWNLOAD.FILTER.REPORT_TYPE'),
            //     placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
            //     options: reportTypeOpts,
            //     optionLabel: 'label',
            //     optionValue: 'value',
            //     showClear: true,
            //     icon: 'pi pi-filter',
            //     translationKeys: {
            //         label: 'REPORT_STATES.DOWNLOAD.FILTER.REPORT_TYPE',
            //     },
            //     class: 'p-long',
            // },
            // {
            //     type: 'multi-select',
            //     name: 'operators',
            //     label: this.t('REPORT_STATES.DOWNLOAD.FILTER.OPERATORS'),
            //     placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
            //     options: telecomOperatorsOpts,
            //     optionLabel: 'label',
            //     optionValue: 'value',
            //     filter: false,
            //     showToggleDownload: false,
            //     showClear: true,
            //     icon: 'pi pi-filter',
            //     translationKeys: {
            //         label: 'REPORT_STATES.DOWNLOAD.FILTER.OPERATORS',
            //     },
            //     class: 'p-medium',
            // },
            // {
            //     type: 'select',
            //     name: 'source',
            //     label: this.t('REPORT_STATES.DOWNLOAD.FILTER.SOURCE'),
            //     placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
            //     options: reportSourceOpts,
            //     optionLabel: 'label',
            //     optionValue: 'value',
            //     showClear: true,
            //     icon: 'pi pi-filter',
            //     translationKeys: {
            //         label: 'REPORT_STATES.DOWNLOAD.FILTER.SOURCE',
            //     },
            // },
            // {
            //     type: 'date',
            //     name: 'startDate',
            //     label: 'COMMON.START_DATE',
            //     placeholder: 'COMMON.DATE_PLACEHOLDER',
            // },
            // {
            //     type: 'date',
            //     name: 'endDate',
            //     label: 'COMMON.END_DATE',
            //     placeholder: 'COMMON.DATE_PLACEHOLDER',
            // },
        ];
    });
    protected readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.REFRESH',
            actionId: 'refresh',
            class: 'btn-dark',
            icon: 'pi pi-refresh',
            translateKey: 'COMMON.REFRESH',
            tooltip: this.t('REPORT_STATES.DOWNLOAD.TOOLTIP.REFRESH'),
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
    private readonly presenter = new DownloadPresenter(
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
                'REPORT_STATES.DOWNLOAD.TOOLTIP.NO_PERMISSION_EXPORT'
            );
        }
        if (noData) {
            return this.t('REPORT_STATES.DOWNLOAD.TOOLTIP.NO_EXPORT');
        }
        return this.t('REPORT_STATES.DOWNLOAD.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    constructor() {
        this.facade.read(this.currentFilter() as DownloadFilterDto);
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });
        effect(() => {
            this.pageTitle();
            this.filterFields();
            this.telecomOperatorsOptions();
            this.reportSourceOptions();
            this.reportTypeOptions();
        });
    }
    private pageTitle(): void {
        this.currentLang();
        this.title.setTitle(this.t('REPORT_STATES.DOWNLOAD.TITLE'));
    }
    public onFilterClicked(): void {
        this.facade.read(this.formStore.value, '1', { forceRefresh: true });
    }
    public onChangePageClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }
    protected onActionClicked(event: {
        item: DownloadVmProps;
        actionId?: string;
    }): void {
        const { item } = event;
        window.open(item.url, '_blank');
    }
    protected onVisibleDialogClicked(event: boolean): void {
        this.isVisibleDialog.set(event);
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
    protected onHeaderClicked(actionId: string): void {
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
    public onBadgeClicked(event: {
        item: DownloadVmProps;
        col: HTMLTableCellElement;
    }): void {
        this.selectedItem.set(event.item.filters);
        this.isVisibleDialog.set(true);
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

        const fileName = `${this.exportFilePrefix}-download`;

        const exportColumns: ExportColumn[] = DOWNLOAD_TABLE.cols
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
                    'REPORT_STATES.DOWNLOAD.TITLE'
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

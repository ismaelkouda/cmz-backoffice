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
import { RejectFilterDto } from '@pages/report-states/application/dto/reject/reject-filter.dto';
import { RejectFacade } from '@pages/report-states/application/services/reject/reject.facade';
import { RejectVmProps } from '@pages/report-states/presentation/adapters/reject/reject-vm-props.interface';
import { RejectPresenter } from '@pages/report-states/presentation/adapters/reject/reject-vm.presenter';
import { RejectFilterStore } from '@pages/report-states/presentation/store/reject/reject-filter.store';
import { REJECT_TABLE } from '@presentation/pages/report-states/presentation/adapters/reject/reject-table.constants';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptions,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { ManagementDialogComponent } from '@shared/components/management/presentation/management-dialog/management-dialog.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { ToastrService } from 'ngx-toastr';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { formatDate } from '@shared/domain/functions/format-data.function';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { MenuItem } from 'primeng/api';
import { DownloadType } from '@presentation/pages/report-states/domain/enums/download-type.enum';

@Component({
    selector: 'app-reject',
    standalone: true,
    templateUrl: './reject.component.html',
    styleUrls: ['./reject.component.scss'],
    imports: [
        BreadcrumbComponent,
        TableComponent,
        ManagementDialogComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        ReactiveFormsModule,
        FilterComponent,
    ],
    providers: [RejectFilterStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RejectComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    protected readonly facade = inject(RejectFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly formStore = inject(RejectFilterStore);
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
        '/report-status/rejected',
        'export'
    );
    private readonly canDownload = this.permissionActions.can(
        '/report-status/rejected',
        'download'
    );
    protected readonly selectedReportId = signal<string>('');
    protected readonly tableConfig = REJECT_TABLE;
    protected readonly form = this.formStore.form;
    protected readonly isVisibleDialog = signal<boolean>(false);
    protected readonly selectedManagementType = signal<TypeReport>(
        TypeReport.REQUESTS
    );
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
    protected readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        const telecomOperatorsOpts = this.telecomOperatorsOptions();
        const reportSourceOpts = this.reportSourceOptions();
        const reportTypeOpts = this.reportTypeOptions();
        return [
            {
                type: 'text',
                name: 'initiatorPhoneNumber',
                label: this.t('REPORT_STATES.REJECT.FILTER.INITIATOR'),
                placeholder: this.t('COMMON.PHONE_PLACEHOLDER'),
                icon: 'pi pi-phone',
                translationKeys: {
                    label: 'REPORT_STATES.REJECT.FILTER.INITIATOR',
                    placeholder: 'COMMON.PHONE_PLACEHOLDER',
                },
            },
            {
                type: 'text',
                name: 'uniqId',
                label: this.t('REPORT_STATES.REJECT.FILTER.UNIQ_ID'),
                placeholder: this.t('COMMON.REPORT_UNIQ_ID_PLACEHOLDER'),
                icon: 'pi pi-id-card',
                translationKeys: {
                    label: 'REPORT_STATES.REJECT.FILTER.UNIQ_ID',
                    placeholder: 'COMMON.REPORT_UNIQ_ID_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'reportType',
                label: this.t('REPORT_STATES.REJECT.FILTER.REPORT_TYPE'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: reportTypeOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'REPORT_STATES.REJECT.FILTER.REPORT_TYPE',
                },
                class: 'p-long',
            },
            {
                type: 'multi-select',
                name: 'operators',
                label: this.t('REPORT_STATES.REJECT.FILTER.OPERATORS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: telecomOperatorsOpts,
                optionLabel: 'label',
                optionValue: 'value',
                filter: false,
                showToggleReject: false,
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'REPORT_STATES.REJECT.FILTER.OPERATORS',
                },
                class: 'p-medium',
            },
            {
                type: 'select',
                name: 'source',
                label: this.t('REPORT_STATES.REJECT.FILTER.SOURCE'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: reportSourceOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'REPORT_STATES.REJECT.FILTER.SOURCE',
                },
            },
            {
                type: 'date',
                name: 'startDate',
                label: 'COMMON.START_DATE',
                placeholder: 'COMMON.DATE_PLACEHOLDER',
            },
            {
                type: 'date',
                name: 'endDate',
                label: 'COMMON.END_DATE',
                placeholder: 'COMMON.DATE_PLACEHOLDER',
            },
        ];
    });
    protected readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.DOWNLOAD',
            actionId: 'download',
            type: 'splitbutton',
            class: 'btn-primary',
            icon: 'pi pi-download',
            translateKey: 'COMMON.DOWNLOAD',
            items: this.buildDownloadMenuItems(),
            disabled:
                // !this.hasActiveFilter() ||
                !this.canDownload() || this.itemsVM().length <= 0,
            tooltip: this.downloadTooltip(),
        },
        {
            label: 'COMMON.REFRESH',
            actionId: 'refresh',
            class: 'btn-dark',
            icon: 'pi pi-refresh',
            translateKey: 'COMMON.REFRESH',
            tooltip: this.t('REPORT_STATES.REJECT.TOOLTIP.REFRESH'),
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

    private buildDownloadMenuItems(): MenuItem[] {
        return Object.entries(DownloadType).map(([, translationKey]) => ({
            label: this.t(translationKey),
            command: () => this.onDownloadTypeSelected(translationKey),
        }));
    }
    protected readonly downloadType = signal<DownloadType | null>(null);
    public readonly displayDownloadModal = signal<boolean>(false);
    private readonly openDownloadRequested = signal<boolean>(false);
    private onDownloadTypeSelected(downloadType: DownloadType): void {
        this.downloadType.set(downloadType);
        this.openDownloadRequested.set(true);
    }
    private readonly assignModalEffect = effect(() => {
        if (!this.openDownloadRequested()) {
            return;
        }
        this.displayDownloadModal.set(true);
        this.openDownloadRequested.set(false);
        this.onDownloadClicked();
    });

    public closeAssignModal(): void {
        this.displayDownloadModal.set(false);
    }
    // private readonly hasActiveFilter = computed(() => {
    //     const filter = this.currentFilter();
    //     if (!filter) {
    //         return false;
    //     }
    //     return Object.values(filter).some((v) => {
    //         if (Array.isArray(v)) {
    //             return v.length > 0;
    //         }
    //         return v !== null && v !== undefined && v !== '';
    //     });
    // });
    protected readonly downloadTooltip = computed(() => {
        // const noFilter = !this.hasActiveFilter();
        const permission = !this.canDownload();
        const noData = this.itemsVM().length < 1;
        if (permission) {
            return this.t(
                'REPORT_STATES.REJECT.TOOLTIP.NO_PERMISSION_DOWNLOAD'
            );
        }
        // if (noFilter) {
        //     return this.t('REPORT_STATES.REJECT.TOOLTIP.FILTER_REQUIRE');
        // }
        if (noData) {
            return this.t('REPORT_STATES.REJECT.TOOLTIP.NO_DOWNLOAD');
        }
        return this.t('REPORT_STATES.REJECT.TOOLTIP.DOWNLOAD').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    protected async onDownloadClicked(): Promise<void> {
        if (!this.canDownload()) {
            this.toast.error(this.downloadTooltip());
            return;
        }
        // if (!this.hasActiveFilter()) {
        //     const message = this.t(
        //         'REPORT_STATES.REJECT.TOOLTIP.FILTER_REQUIRE'
        //     );
        //     this.toast.error(message);
        //     return;
        // }
        const uniqId = this.downloadType();
        if (!uniqId) {
            return;
        }
        const translateType = this.t(uniqId);
        const confirmed = await this.sweetAlert.confirm({
            titleKey: 'REPORT_STATES.REJECT.SWEET_ALERT.TITLE.DOWNLOAD',
            messageKey: 'REPORT_STATES.REJECT.SWEET_ALERT.MESSAGE.DOWNLOAD',
            messageParams: {
                uniqId: translateType,
            },
            titleParams: {
                uniqId: translateType,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.download(this.formStore.downloadValue(uniqId));
    }
    private readonly presenter = new RejectPresenter(
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
            return this.t('REPORT_STATES.REJECT.TOOLTIP.NO_PERMISSION_EXPORT');
        }
        if (noData) {
            return this.t('REPORT_STATES.REJECT.TOOLTIP.NO_EXPORT');
        }
        return this.t('REPORT_STATES.REJECT.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    constructor() {
        this.facade.read(this.currentFilter() as RejectFilterDto);
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
        this.title.setTitle(this.t('REPORT_STATES.REJECT.TITLE'));
    }
    public onFilterClicked(): void {
        this.facade.read(this.formStore.value, '1', { forceRefresh: true });
    }
    public onChangePageClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }
    protected onActionClicked(event: {
        item: RejectVmProps;
        actionId?: string;
    }): void {
        const { item } = event;
        this.selectedManagementType.set(item.type);
        this.selectedReportId.set(item.uniqId);
        this.isVisibleDialog.set(true);
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

        const fileName = `${this.exportFilePrefix}-reject`;

        const exportColumns: ExportColumn[] = REJECT_TABLE.cols
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
                sheetName: this.translate.instant('REPORT_STATES.REJECT.TITLE'),
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

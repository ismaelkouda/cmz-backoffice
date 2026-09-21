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
import { Location } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { RequestFilterDto } from '@pages/report-states/application/dto/request/request-filter.dto';
import { RequestFacade } from '@pages/report-states/application/services/request/request.facade';
import { RequestPresenter } from '@pages/report-states/presentation/adapters/request/request-vm.presenter';
import { RequestFilterStore } from '@pages/report-states/presentation/store/request/request-filter.store';
import { ALL_REPORT_TABLE } from '@presentation/pages/report-states/presentation/adapters/request/request-table.constants';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptions,
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
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { formatDate } from '@shared/domain/functions/format-data.function';
import { MenuItem } from 'primeng/api';
import { DownloadType } from '@presentation/pages/report-states/domain/enums/download-type.enum';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-request',
    standalone: true,
    templateUrl: './request.component.html',
    styleUrls: ['./request.component.scss'],
    imports: [
        BreadcrumbComponent,
        TableComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        ReactiveFormsModule,
        FilterComponent,
        ButtonModule,
    ],
    providers: [RequestFilterStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly route = inject(ActivatedRoute);
    private readonly location = inject(Location);
    private readonly title = inject(Title);
    protected readonly facade = inject(RequestFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly formStore = inject(RequestFilterStore);
    private readonly sweetAlert = inject(SweetAlertService);
    private readonly excelExport = inject(ExcelExportService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly reportUniqId =
        this.route.snapshot.queryParamMap.get('reportUniqId') ?? '';
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.customization.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    private readonly canExport = this.permissionActions.can(
        '/report-status/all-reports/request',
        'export'
    );
    private readonly canDownload = this.permissionActions.can(
        '/report-status/all-reports/request',
        'download'
    );
    protected readonly tableConfig = ALL_REPORT_TABLE;
    protected readonly form = this.formStore.form;
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
                label: this.t('REPORT_STATES.REQUEST.FILTER.INITIATOR'),
                placeholder: this.t('COMMON.PHONE_PLACEHOLDER'),
                icon: 'pi pi-phone',
                translationKeys: {
                    label: 'REPORT_STATES.REQUEST.FILTER.INITIATOR',
                    placeholder: 'COMMON.PHONE_PLACEHOLDER',
                },
            },
            {
                type: 'text',
                name: 'uniqId',
                label: this.t('REPORT_STATES.REQUEST.FILTER.UNIQ_ID'),
                placeholder: this.t(
                    'REPORT_STATES.REQUEST.FILTER.UNIQ_ID_PLACEHOLDER'
                ),
                icon: 'pi pi-id-card',
                translationKeys: {
                    label: 'REPORT_STATES.REQUEST.FILTER.UNIQ_ID',
                    placeholder:
                        'REPORT_STATES.REQUEST.FILTER.UNIQ_ID_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'reportType',
                label: this.t('REPORT_STATES.REQUEST.FILTER.REPORT_TYPE'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: reportTypeOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'REPORT_STATES.REQUEST.FILTER.REPORT_TYPE',
                },
                class: 'p-long',
            },
            {
                type: 'multi-select',
                name: 'operators',
                label: this.t('REPORT_STATES.REQUEST.FILTER.OPERATORS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: telecomOperatorsOpts,
                optionLabel: 'label',
                optionValue: 'value',
                filter: false,
                showToggleAll: false,
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'REPORT_STATES.REQUEST.FILTER.OPERATORS',
                },
                class: 'p-medium',
            },
            {
                type: 'select',
                name: 'source',
                label: this.t('REPORT_STATES.REQUEST.FILTER.SOURCE'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: reportSourceOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'REPORT_STATES.REQUEST.FILTER.SOURCE',
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
            disabled: !this.canDownload() || this.itemsVM().length <= 0,
            tooltip: this.downloadTooltip(),
        },
        {
            label: 'COMMON.REFRESH',
            actionId: 'refresh',
            class: 'btn-dark',
            icon: 'pi pi-refresh',
            translateKey: 'COMMON.REFRESH',
            tooltip: this.t('REPORT_STATES.REQUEST.TOOLTIP.REFRESH'),
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
    private onDownloadTypeSelected(downloadType: DownloadType): void {
        this.downloadType.set(downloadType);
        this.onDownloadClicked();
    }
    protected readonly downloadTooltip = computed(() => {
        const permission = !this.canDownload();
        const noData = this.itemsVM().length < 1;
        if (permission) {
            return this.t(
                'REPORT_STATES.REQUEST.TOOLTIP.NO_PERMISSION_DOWNLOAD'
            );
        }
        if (noData) {
            return this.t('REPORT_STATES.REQUEST.TOOLTIP.NO_DOWNLOAD');
        }
        return this.t('REPORT_STATES.REQUEST.TOOLTIP.DOWNLOAD').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    protected async onDownloadClicked(): Promise<void> {
        if (!this.canDownload()) {
            this.toast.error(this.downloadTooltip());
            return;
        }
        const uniqId = this.downloadType();
        if (!uniqId) {
            return;
        }
        const translateType = this.t(uniqId);
        const confirmed = await this.sweetAlert.confirm({
            titleKey: 'REPORT_STATES.REQUEST.SWEET_ALERT.TITLE.DOWNLOAD',
            messageKey: 'REPORT_STATES.REQUEST.SWEET_ALERT.MESSAGE.DOWNLOAD',
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
    private readonly presenter = new RequestPresenter(
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
            return this.t('REPORT_STATES.REQUEST.TOOLTIP.NO_PERMISSION_EXPORT');
        }
        if (noData) {
            return this.t('REPORT_STATES.REQUEST.TOOLTIP.NO_EXPORT');
        }
        return this.t('REPORT_STATES.REQUEST.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    constructor() {
        if (this.reportUniqId) {
            this.formStore.form.patchValue(
                { requestReportUniqId: this.reportUniqId },
                { emitEvent: false }
            );
        }
        this.facade.read({
            ...(this.currentFilter() as RequestFilterDto),
            requestReportUniqId: this.reportUniqId || undefined,
        });
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
        this.title.setTitle(this.t('REPORT_STATES.REQUEST.TITLE'));
    }
    public onFilterClicked(): void {
        this.facade.read(this.formStore.value, '1', { forceRefresh: true });
    }
    public onChangePageClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }
    public navigateToBack(): void {
        this.location.back();
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
        if (this.reportUniqId) {
            this.formStore.form.patchValue(
                { requestReportUniqId: this.reportUniqId },
                { emitEvent: false }
            );
        }
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

        const fileName = `${this.exportFilePrefix}-requests`;

        const exportColumns: ExportColumn[] = ALL_REPORT_TABLE.cols.map(
            (col) => {
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
            }
        );

        this.excelExport
            .exportToExcel({
                fileName: fileName,
                columns: exportColumns,
                data: items,
                sheetName: this.translate.instant(
                    'REPORT_STATES.REQUEST.TITLE'
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

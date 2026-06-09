import {
    Component,
    DestroyRef,
    Signal,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { QueuesFilterDto } from '@pages/requests/application/dto/queues/queues-filter.dto';
import { QueuesFacade } from '@pages/requests/application/services/queues/queues.facade';
import { QueuesVmProps } from '@pages/requests/presentation/adapters/queues/queues-vm-props.interface';
import { QueuesPresenter } from '@pages/requests/presentation/adapters/queues/queues-vm.presenter';
import { QueuesFilterStore } from '@pages/requests/presentation/store/queues/queues-filter.store';
import { QUEUES_TABLE } from '@presentation/pages/requests/presentation/adapters/queues/queues-table.constant';
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
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { formatDate } from '@shared/domain/functions/format-data.function';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';

@Component({
    selector: 'app-queues',
    standalone: true,
    templateUrl: './queues.component.html',
    styleUrls: ['./queues.component.scss'],
    imports: [
        FilterComponent,
        BreadcrumbComponent,
        TableComponent,
        ManagementDialogComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
    ],
    providers: [QueuesFilterStore],
})
export class QueuesComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    protected readonly facade = inject(QueuesFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly formStore = inject(QueuesFilterStore);
    // private readonly exportService = inject(TableExportExcelFileService);
    private readonly excelExport = inject(ExcelExportService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.customization.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    private readonly canExport = this.permissionActions.can(
        '/requests/queues',
        'export'
    );
    private readonly canTake = this.permissionActions.can(
        '/requests/queues',
        'take'
    );
    protected selectedReportId: string | null = null;
    protected readonly tableConfig = QUEUES_TABLE;
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
                label: this.t('REQUESTS.QUEUES.FILTER.INITIATOR'),
                placeholder: this.t('COMMON.PHONE_PLACEHOLDER'),
                icon: 'pi pi-phone',
                translationKeys: {
                    label: 'REQUESTS.QUEUES.FILTER.INITIATOR',
                    placeholder: 'COMMON.PHONE_PLACEHOLDER',
                },
            },
            {
                type: 'text',
                name: 'uniqId',
                label: this.t('REQUESTS.QUEUES.FILTER.UNIQ_ID'),
                placeholder: this.t('COMMON.REPORT_UNIQ_ID_PLACEHOLDER'),
                icon: 'pi pi-id-card',
                translationKeys: {
                    label: 'REQUESTS.QUEUES.FILTER.UNIQ_ID',
                    placeholder: 'COMMON.REPORT_UNIQ_ID_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'reportType',
                label: this.t('REQUESTS.QUEUES.FILTER.REPORT_TYPE'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: reportTypeOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'REQUESTS.QUEUES.FILTER.REPORT_TYPE',
                },
                class: 'p-long',
            },
            {
                type: 'multi-select',
                name: 'operators',
                label: this.t('REQUESTS.QUEUES.FILTER.OPERATORS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: telecomOperatorsOpts,
                optionLabel: 'label',
                optionValue: 'value',
                filter: false,
                showToggleAll: false,
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'REQUESTS.QUEUES.FILTER.OPERATORS',
                },
                class: 'p-medium',
            },
            {
                type: 'select',
                name: 'source',
                label: this.t('REQUESTS.QUEUES.FILTER.SOURCE'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: reportSourceOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'REQUESTS.QUEUES.FILTER.SOURCE',
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
            label: 'COMMON.REFRESH',
            actionId: 'refresh',
            class: 'btn-dark',
            icon: 'pi pi-refresh',
            translateKey: 'COMMON.REFRESH',
            tooltip: this.t('REQUESTS.QUEUES.TOOLTIP.REFRESH'),
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
    private readonly presenter = new QueuesPresenter(
        this.translate.instant.bind(this.translate)
    );
    protected readonly itemsVM = computed(() => {
        return this.items().map((item) =>
            this.presenter.map(item, {
                canTake: this.canTake(),
            })
        );
    });
    private readonly canExportData = computed(
        () => !this.canExport() || this.itemsVM().length < 1 || this.loading()
    );
    private readonly exportTooltip = computed(() => {
        const permission = !this.canExport();
        const noData = this.itemsVM().length < 1;
        if (permission) {
            return this.t('REQUESTS.QUEUES.TOOLTIP.NO_PERMISSION_EXPORT');
        }
        if (noData) {
            return this.t('REQUESTS.QUEUES.TOOLTIP.NO_EXPORT');
        }
        return this.t('REQUESTS.QUEUES.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    constructor() {
        this.facade.read(this.currentFilter() as QueuesFilterDto);
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
        this.title.setTitle(this.t('REQUESTS.QUEUES.TITLE'));
    }
    protected onFilterClicked(): void {
        console.log('this.formStore.value', this.formStore.value);
        this.facade.read(this.formStore.value, '1', { forceRefresh: true });
    }
    protected onChangePageClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }
    protected onActionClicked(event: {
        item: QueuesVmProps;
        actionId?: string;
    }): void {
        const { item } = event;
        this.selectedManagementType.set(item.type);
        this.selectedReportId = item.uniqId;
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

        this.facade.read({}, PAGINATION_CONST.DEFAULT_PAGE, {
            forceRefresh: true,
        });
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

        const fileName = `${this.exportFilePrefix}-queues`;

        const exportColumns: ExportColumn[] = QUEUES_TABLE.cols
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
                sheetName: this.translate.instant('REQUESTS.QUEUES.TITLE'),
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

    // private exportToExcel(): void {
    //     // 1. Récupérer les données depuis le store/service
    //     const queuesData = this.itemsVM; // Observable de QueuesVmProps[]

    //     // 2. Transformer les colonnes de QUEUES_TABLE en ExportColumn[]
    //     const exportColumns: ExportColumn[] = QUEUES_TABLE.cols
    //         .filter((col) => col.field !== '__action') // exclure colonne actions
    //         .map((col) => ({
    //             field: col.field,
    //             header: this.translate.instant(col.header), // traduction dynamique
    //             width: this.parseWidthToNumber(col.width), // "8rem" -> 8
    //             transform: (value, row) => {
    //                 // cas spécial pour __index (généré)
    //                 if (col.field === '__index') {
    //                     return row.__index + 1;
    //                 }
    //                 // pour les dates, formater avec moment/date-fns
    //                 if (col.field === 'reportedAt' && value) {
    //                     return formatDate(value, 'dd/MM/yyyy HH:mm');
    //                 }
    //                 return value;
    //             },
    //         }));

    //     // 3. Appeler le service
    //     this.excelExport
    //         .exportToExcel({
    //             fileName: 'queues_export',
    //             columns: exportColumns,
    //             data: this.rawQueuesData, // les données brutes (non présentées)
    //             sheetName: 'Files d'attente',
    //             autoFilter: true,
    //             headerStyle: {
    //                 font: { bold: true },
    //                 fill: { fgColor: 'E0E0E0' },
    //             },
    //         })
    //         .catch((err) => console.error('Export error', err));
    // }
}

import { CommonModule } from '@angular/common';
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
import { CloseFilterDto } from '@pages/report-states/application/dto/close/close-filter.dto';
import { CloseFacade } from '@pages/report-states/application/services/close/close.facade';
import { CloseVmProps } from '@pages/report-states/presentation/adapters/close/close-vm-props.interface';
import { ClosePresenter } from '@pages/report-states/presentation/adapters/close/close-vm.presenter';
import { CloseFilterStore } from '@pages/report-states/presentation/store/close/close-filter.store';
import { CLOSE_TABLE } from '@presentation/pages/report-states/presentation/adapters/close/close-table.constants';
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
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-close',
    standalone: true,
    templateUrl: './close.component.html',
    styleUrls: ['./close.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        TableComponent,
        ManagementDialogComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        ReactiveFormsModule,
        FilterComponent,
    ],
    providers: [CloseFilterStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    protected readonly facade = inject(CloseFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly formStore = inject(CloseFilterStore);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.customization.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    private readonly canExport = this.permissionActions.can(
        '/report-status/evaluated',
        'export'
    );
    protected selectedReportId: string | null = null;
    protected readonly tableConfig = CLOSE_TABLE;
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
                label: this.t('REPORT_STATES.CLOSE.FILTER.INITIATOR'),
                placeholder: this.t('COMMON.PHONE_PLACEHOLDER'),
                icon: 'pi pi-phone',
                translationKeys: {
                    label: 'REPORT_STATES.CLOSE.FILTER.INITIATOR',
                    placeholder: 'COMMON.PHONE_PLACEHOLDER',
                },
            },
            {
                type: 'text',
                name: 'uniqId',
                label: this.t('REPORT_STATES.CLOSE.FILTER.UNIQ_ID'),
                placeholder: this.t('COMMON.REPORT_UNIQ_ID_PLACEHOLDER'),
                icon: 'pi pi-id-card',
                translationKeys: {
                    label: 'REPORT_STATES.CLOSE.FILTER.UNIQ_ID',
                    placeholder: 'COMMON.REPORT_UNIQ_ID_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'reportType',
                label: this.t('REPORT_STATES.CLOSE.FILTER.REPORT_TYPE'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: reportTypeOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'REPORT_STATES.CLOSE.FILTER.REPORT_TYPE',
                },
                class: 'p-long',
            },
            {
                type: 'multi-select',
                name: 'operators',
                label: this.t('REPORT_STATES.CLOSE.FILTER.OPERATORS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: telecomOperatorsOpts,
                optionLabel: 'label',
                optionValue: 'value',
                filter: false,
                showToggleAll: false,
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'REPORT_STATES.CLOSE.FILTER.OPERATORS',
                },
                class: 'p-medium',
            },
            {
                type: 'select',
                name: 'source',
                label: this.t('REPORT_STATES.CLOSE.FILTER.SOURCE'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: reportSourceOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'REPORT_STATES.CLOSE.FILTER.SOURCE',
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
            tooltip: this.t('REPORT_STATES.CLOSE.TOOLTIP.REFRESH'),
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
    private readonly presenter = new ClosePresenter(
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
            return this.t('REPORT_STATES.CLOSE.TOOLTIP.NO_PERMISSION_EXPORT');
        }
        if (noData) {
            return this.t('REPORT_STATES.CLOSE.TOOLTIP.NO_EXPORT');
        }
        return this.t('REPORT_STATES.CLOSE.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    constructor() {
        this.facade.read(this.currentFilter() as CloseFilterDto);
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
        this.title.setTitle(this.t('REPORT_STATES.CLOSE.TITLE'));
    }
    public onFilterClicked(): void {
        this.facade.read(this.formStore.value, '1', true);
    }
    public onChangePageClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }
    protected onActionClicked(event: {
        item: CloseVmProps;
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
        this.facade.refresh();
    }
    private exportData(): void {
        if (!this.canExport()) {
            this.toast.error(this.exportTooltip());
            return;
        }
        const item = this.items();
        if (item && item.length > 0) {
            const fileName = `${this.exportFilePrefix}-close`;
            this.exportService.exportAsExcelFile(
                item,
                this.tableConfig,
                fileName
            );
        } else {
            this.toast.error(this.translate.instant('EXPORT.NO_DATA'));
        }
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

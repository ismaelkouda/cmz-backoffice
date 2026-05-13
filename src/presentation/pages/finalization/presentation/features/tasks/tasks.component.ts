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
import { Title } from '@angular/platform-browser';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { TasksFilterDto } from '@pages/finalization/application/dto/tasks/tasks-filter.dto';
import { DetailsFacade } from '@pages/finalization/application/services/details/details.facade';
import { TasksFacade } from '@pages/finalization/application/services/tasks/tasks.facade';
import { TASKS_TABLE } from '@pages/finalization/domain/constants/tasks/tasks-table.constants';
import { TasksVmProps } from '@pages/finalization/domain/interfaces/tasks/tasks-vm-props.interface';
import { TasksPresenter } from '@pages/finalization/presentation/adapters/tasks/tasks-vm.presenter';
import { TasksFilterStore } from '@pages/finalization/presentation/store/tasks/tasks-filter.store';
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
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { ReportSource } from '@shared/domain/enums/report-source.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { ToastrService } from 'ngx-toastr';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-tasks',
    standalone: true,
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        TableComponent,
        ManagementDialogComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        FilterComponent,
    ],
    providers: [TasksFilterStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    protected readonly facade = inject(TasksFacade);
    private readonly finalizeFacade = inject(DetailsFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly formStore = inject(TasksFilterStore);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.customization.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    private readonly canExport = this.permissionActions.can(
        '/reports-finalization/tasks',
        'export'
    );
    private readonly canFinalize = this.permissionActions.can(
        '/reports-finalization/tasks',
        'execute'
    );
    protected selectedReportId: string | null = null;
    protected readonly tableConfig = TASKS_TABLE;
    protected readonly form = this.formStore.form;
    protected readonly isVisibleDialog = signal<boolean>(false);
    protected readonly selectedManagementType = signal<TypeReport>(
        TypeReport.FINALIZATION
    );
    protected readonly selectedInTable = signal<TasksVmProps[]>([]);
    private lastSuccess = this.finalizeFacade.actionSuccess();

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
                label: this.t('FINALIZATION.TASKS.FILTER.INITIATOR'),
                placeholder: this.t('COMMON.PHONE_PLACEHOLDER'),
                icon: 'pi pi-phone',
                translationKeys: {
                    label: 'FINALIZATION.TASKS.FILTER.INITIATOR',
                    placeholder: 'COMMON.PHONE_PLACEHOLDER',
                },
            },
            {
                type: 'text',
                name: 'uniqId',
                label: this.t('FINALIZATION.TASKS.FILTER.UNIQ_ID'),
                placeholder: this.t('COMMON.REPORT_UNIQ_ID_PLACEHOLDER'),
                icon: 'pi pi-id-card',
                translationKeys: {
                    label: 'FINALIZATION.TASKS.FILTER.UNIQ_ID',
                    placeholder: 'COMMON.REPORT_UNIQ_ID_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'reportType',
                label: this.t('FINALIZATION.TASKS.FILTER.REPORT_TYPE'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: reportTypeOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'FINALIZATION.TASKS.FILTER.REPORT_TYPE',
                },
                class: 'p-long',
            },
            {
                type: 'multi-select',
                name: 'operators',
                label: this.t('FINALIZATION.TASKS.FILTER.OPERATORS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: telecomOperatorsOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'FINALIZATION.TASKS.FILTER.OPERATORS',
                },
                class: 'p-medium',
            },
            {
                type: 'select',
                name: 'source',
                label: this.t('FINALIZATION.TASKS.FILTER.SOURCE'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: reportSourceOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'FINALIZATION.TASKS.FILTER.SOURCE',
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
            tooltip: this.t('FINALIZATION.QUEUES.TOOLTIP.REFRESH'),
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
    private readonly presenter = new TasksPresenter(
        this.translate.instant.bind(this.translate)
    );
    protected readonly itemsVM = computed(() => {
        return this.items().map((item) =>
            this.presenter.map(item, {
                canFinalize: this.canFinalize(),
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
            return this.t('FINALIZATION.TASKS.TOOLTIP.NO_PERMISSION_EXPORT');
        }
        if (noData) {
            return this.t('FINALIZATION.TASKS.TOOLTIP.NO_EXPORT');
        }
        return this.t('FINALIZATION.TASKS.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    private readonly formStateEffect = effect(() => {
        if (this.finalizeFacade.actionLoading()) {
            this.formStore.disable();
        } else {
            this.formStore.enable();
        }
    });
    private readonly successEffect = effect(() => {
        const current = this.finalizeFacade.actionSuccess();
        if (current === this.lastSuccess) {
            return;
        }

        this.lastSuccess = current;
    });
    constructor() {
        this.facade.read(this.currentFilter() as TasksFilterDto);
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
        this.title.setTitle(this.t('FINALIZATION.TASKS.TITLE'));
    }
    protected onFilterClicked(): void {
        this.facade.read(this.formStore.value, '1', true);
    }
    protected onChangePageClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }
    protected onActionClicked(event: {
        item: TasksVmProps;
        actionId?: string;
    }): void {
        const { item } = event;
        this.selectedManagementType.set(item.type);
        this.selectedReportId = item.uniqId;
        this.isVisibleDialog.set(true);
    }
    protected onSelectionChange(
        selection: TasksVmProps | TasksVmProps[]
    ): void {
        const tasks = Array.isArray(selection) ? selection : [selection];
        this.selectedInTable.set(tasks.filter((u) => !!u));
    }
    protected onVisibleDialogClicked(event: boolean): void {
        this.isVisibleDialog.set(event);
    }
    private t(key: string): string {
        return this.translate.instant(key);
    }
    private readonly headerActions: Record<string, () => void> = {
        refresh: () => this.onRefreshData(),
        export: () => this.exportData(),
        finalize: () => this.onTakeBulkClicked(),
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
        const tasks = this.items();
        if (tasks && tasks.length > 0) {
            const fileName = `${this.exportFilePrefix}-tasks`;
            this.exportService.exportAsExcelFile(
                tasks,
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
    private onTakeBulkClicked(): void {
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('FINALIZATION.TASKS.SWEET_ALERT.TITLE.TAKE'),
            text: this.t('FINALIZATION.TASKS.SWEET_ALERT.TITLE.MESSAGE'),
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((res) => {
            if (res.isConfirmed) {
                this.finalizeFacade.take({
                    uniqId: JSON.stringify(
                        this.selectedInTable().map((p) => p.uniqId)
                    ),
                });
            }
        });
    }
}

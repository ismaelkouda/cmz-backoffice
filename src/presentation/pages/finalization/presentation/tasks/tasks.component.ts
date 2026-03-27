import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
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
import { TasksFacade } from '@pages/finalization/application/services/tasks/tasks.facade';
import { TASKS_TABLE } from '@pages/finalization/domain/constants/tasks/tasks-table.constants';
import { TasksVmProps } from '@pages/finalization/domain/interfaces/tasks/tasks-vm-props.interface';
import { TasksPresenter } from '@pages/finalization/presentation/adapters/tasks/tasks-vm.presenter';
import { DetailsFacade } from '@pages/finalization/application/services/details/details.facade';
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
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';
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
export class TasksComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    public readonly facade = inject(TasksFacade);
    public readonly finalizeFacade = inject(DetailsFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    public readonly formStore = inject(TasksFilterStore);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.config.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    public selectedReportId: string | null = null;
    public readonly tableConfig = TASKS_TABLE;
    readonly form = this.formStore.form;
    public readonly reportTreatmentVisible = signal<boolean>(false);
    public readonly selectedManagementType = signal<TypeReport>(
        TypeReport.FINALIZATION
    );
    public readonly selectedInTable = signal<TasksVmProps[]>([]);
    private lastSuccess = this.finalizeFacade.actionSuccess();
    readonly items = toSignal(this.facade.items$, {
        initialValue: [],
    });
    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    readonly telecomOperatorsOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(TelecomOperator, this.t.bind(this));
    });
    readonly reportSourceOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(ReportSource, this.t.bind(this));
    });
    readonly reportTypeOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(ReportType, this.t.bind(this));
    });
    readonly filterFields: Signal<FilterField[]> = computed(() => {
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
    readonly presenter = new TasksPresenter(
        this.translate.instant.bind(this.translate)
    );
    readonly itemsVM = computed(() => {
        this.currentLang();
        return this.items().map((item) => this.presenter.map(item));
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

    public readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.FINALIZE',
            actionId: 'finalize',
            class: 'btn-primary',
            icon: 'pi pi-check-circle',
            translateKey: 'COMMON.FINALIZE',
            disabled: !this.selectedInTable().length,
        },
    ]);

    constructor() {
        this.facade.read(this.currentFilter() as TasksFilterDto);
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });

        effect(() => {
            this.filterFields();
            this.telecomOperatorsOptions();
            this.reportSourceOptions();
            this.reportTypeOptions();
        });
    }

    ngOnInit(): void {
        this.title.setTitle(this.t('FINALIZATION.TASKS.TITLE'));
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.title.setTitle(this.t('FINALIZATION.TASKS.TITLE'));
            });
    }

    public onFilterClicked(): void {
        this.facade.read(this.formStore.value, '1', true);
    }

    public onRefreshClicked(): void {
        this.formStore.reset();
        this.facade.refresh();
    }

    public onPageChange(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }

    public onExportClicked(): void {
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

    public onActionClicked(event: {
        item: TasksVmProps;
        actionId?: string;
    }): void {
        const { item } = event;
        this.selectedManagementType.set(item.type);
        this.selectedReportId = item.uniqId;
        this.reportTreatmentVisible.set(true);
    }

    public onVisibleChange(event: boolean): void {
        this.reportTreatmentVisible.set(event);
    }

    public onHeaderButtonClicked(actionId: string): void {
        if (actionId === CrudFormType.TAKE) {
            SweetAlert.fire({
                ...SWEET_ALERT_PARAMS,
                title: this.t('FINALIZATION.TASKS.SWEET_ALERT.TITLE_TAKE'),
                text: this.t('FINALIZATION.TASKS.SWEET_ALERT.TITLE_MESSAGE'),
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
                    this.facade.refreshWithLastFilterAndPage();
                }
            });
        }
    }

    public onSelectionChange(selection: TasksVmProps | TasksVmProps[]): void {
        const tasks = Array.isArray(selection) ? selection : [selection];
        this.selectedInTable.set(tasks.filter((u) => !!u));
    }
}

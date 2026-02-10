import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    computed,
    inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { OPERATORS_CONST } from '@shared/domain/constants/operator';
import { REPORT_CONST } from '@shared/domain/constants/report';
import { SOURCE_CONST } from '@shared/domain/constants/source';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';

import { TasksFacade } from '@presentation/pages/report-requests/application/tasks.facade';
import { TASKS_TABLE_CONST } from '@presentation/pages/report-requests/domain/constants/tasks/tasks-table.constants';
import { TasksFilterPayloadEntity } from '@presentation/pages/report-requests/domain/entities/tasks/tasks-filter-payload.entity';
import { TasksEntity } from '@presentation/pages/report-requests/domain/entities/tasks/tasks.entity';
import { TasksFilter } from '@presentation/pages/report-requests/domain/value-objects/tasks-filter.vo';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';

@Component({
    selector: 'app-tasks',
    standalone: true,
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        TableComponent,
        ManagementComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        ReactiveFormsModule,
        FilterComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit {
    readonly hasAnimated = computed(() => this.tasksItems().length === 0);
    private readonly title = inject(Title);
    public readonly facade = inject(TasksFacade);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    public readonly tableConfig = TASKS_TABLE_CONST;

    readonly isLoading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly tasksItems = toSignal(this.facade.items$, { initialValue: [] });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: {} as Paginate<TasksEntity>,
    });

    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;

    public formFilter: FormGroup = this.fb.group({
        initiator_phone_number: new FormControl(''),
        uniq_id: new FormControl(''),
        start_date: new FormControl(null),
        end_date: new FormControl(null),
        report_type: new FormControl(null),
        operators: new FormControl([]),
        source: new FormControl(null),
    });

    public filterFields: FilterField[] = [];
    private reportOptions: Record<string, string>[] = [];
    private operatorOptions: Record<string, string>[] = [];
    private sourceOptions: Record<string, string>[] = [];

    constructor() {
        this.title.setTitle('REPORTS_REQUESTS.TASKS.TITLE');
    }

    ngOnInit(): void {
        this.loadTranslatedOptions();
        this.initFilterFields();
        this.loadData();
    }

    private loadTranslatedOptions(): void {
        this.operatorOptions = OPERATORS_CONST.map((operator) => ({
            ...operator,
            label: this.translate.instant(operator.label),
        }));

        this.reportOptions = REPORT_CONST.map((source) => ({
            ...source,
            label: this.translate.instant(source.label),
        }));

        this.sourceOptions = SOURCE_CONST.map((source) => ({
            ...source,
            label: this.translate.instant(source.label),
        }));
    }

    private initFilterFields(): void {
        this.filterFields = [
            {
                type: 'text',
                name: 'initiator_phone_number',
                label: 'REPORTS_REQUESTS.TASKS.FILTER.INITIATOR',
                placeholder: 'REPORTS_REQUESTS.TASKS.FILTER.INITIATOR',
                class: 'p-short',
            },
            {
                type: 'text',
                name: 'uniq_id',
                label: 'REPORTS_REQUESTS.TASKS.FILTER.UNIQ_ID',
                placeholder: 'REPORTS_REQUESTS.TASKS.FILTER.UNIQ_ID',
            },
            {
                type: 'select',
                name: 'report_type',
                label: 'REPORTS_REQUESTS.TASKS.FILTER.REPORT_TYPE',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                class: 'p-long',
                options: this.reportOptions,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                filter: false,
            },
            {
                type: 'multi-select',
                name: 'operators',
                label: 'REPORTS_REQUESTS.TASKS.FILTER.OPERATORS',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                class: 'p-medium',
                options: this.operatorOptions,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                showToggleAll: false,
                filter: false,
            },
            {
                type: 'select',
                name: 'source',
                label: 'REPORTS_REQUESTS.TASKS.FILTER.SOURCE',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                class: 'p-medium',
                options: this.sourceOptions,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                filter: false,
            },
            {
                type: 'date',
                name: 'start_date',
                label: 'REPORTS_REQUESTS.TASKS.FILTER.DATE.FROM',
                class: 'p-short',
            },
            {
                type: 'date',
                name: 'end_date',
                label: 'REPORTS_REQUESTS.TASKS.FILTER.DATE.TO',
                class: 'p-short',
            },
        ];
    }

    private loadData(): void {
        const defaultFilter = TasksFilter.create(
            {} as TasksFilterPayloadEntity
        );
        this.facade.fetchTasks(defaultFilter, '1', false);
    }

    public filter(formValue: {
        initiator_phone_number?: string;
        uniq_id?: string;
        start_date?: string | null;
        end_date?: string | null;
        report_type?: string | null;
        operators?: string[];
        source?: string | null;
    }): void {
        const createdFromValue = formValue?.start_date;
        const createdToValue = formValue.end_date;

        const startDate = moment(createdFromValue, moment.ISO_8601, true);
        const endDate = moment(createdToValue, moment.ISO_8601, true);

        if (!this.isValidDateRange(startDate, endDate)) {
            return;
        }

        const filterData: TasksFilterPayloadEntity = {
            initiator_phone_number:
                formValue.initiator_phone_number?.trim() ?? '',
            uniq_id: formValue.uniq_id?.trim() ?? '',
            start_date: startDate.isValid()
                ? startDate.format('YYYY-MM-DD')
                : '',
            end_date: endDate.isValid() ? endDate.format('YYYY-MM-DD') : '',
            source: formValue.source?.trim() ?? '',
            report_type: formValue.report_type?.trim() ?? '',
            operators: formValue.operators ?? [],
        };

        const filter = TasksFilter.create(filterData);
        this.facade.fetchTasks(filter, '1', true);
    }

    private isValidDateRange(
        startDate: moment.Moment,
        endDate: moment.Moment
    ): boolean {
        if (startDate.isValid() && endDate.isValid()) {
            if (startDate.isAfter(endDate)) {
                const invalidDateRange = this.translate.instant(
                    'COMMON.INVALID_DATE_RANGE'
                );
                this.toastService.error(invalidDateRange);
                return false;
            }
        }
        return true;
    }

    public onPageChange(event: number): void {
        this.facade.changePage(event + 1);
    }

    public onActionClicked(event: {
        item: TasksEntity;
        actionId?: string;
    }): void {
        const { item, actionId } = event;
        console.log('Action clicked:', actionId, 'on item:', item);
        this.selectedReportId = item.uniqId;
        this.reportTreatmentVisible = true;
    }

    public onReportTreatmentClosed(): void {
        this.reportTreatmentVisible = false;
        this.selectedReportId = null;
    }

    public refreshTasks(): void {
        this.facade.refresh();
    }

    public onExportExcel(): void {
        const queues = this.tasksItems();
        if (queues && queues.length > 0) {
            const fileName = `${this.exportFilePrefix}-queues`;
            this.tableExportExcelFileService.exportAsExcelFile(
                queues,
                this.tableConfig,
                fileName
            );
        } else {
            this.toastService.error(this.translate.instant('EXPORT.NO_DATA'));
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

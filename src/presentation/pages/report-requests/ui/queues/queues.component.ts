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
import { OPERATORS_CONST } from '@shared/domain/constants/operator';
import { REPORT_CONST } from '@shared/domain/constants/report';
import { SOURCE_CONST } from '@shared/domain/constants/source';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';

import { QueuesFacade } from '@presentation/pages/report-requests/application/queues.facade';
import { QueuesFilterPayloadEntity } from '@presentation/pages/report-requests/domain/entities/queues/queues-filter-payload.entity';
import { QueuesEntity } from '@presentation/pages/report-requests/domain/entities/queues/queues.entity';
import { QueuesFilter } from '@presentation/pages/report-requests/domain/value-objects/queues-filter.vo';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';

import { QUEUES_TABLE_CONST } from '../../domain/constants/queues/queues-table.constants';

@Component({
    selector: 'app-queues',
    standalone: true,
    templateUrl: './queues.component.html',
    styleUrls: ['./queues.component.scss'],
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
export class QueuesComponent implements OnInit {
    readonly hasAnimated = computed(() => this.items().length === 0);
    private readonly title = inject(Title);
    public readonly facade = inject(QueuesFacade);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);

    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;

    public readonly tableConfig = QUEUES_TABLE_CONST;

    readonly items = toSignal(this.facade.queues$, {
        initialValue: [],
    });
    readonly isLoading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });

    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.config.app.name
    );

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
        this.title.setTitle('REPORTS_REQUESTS.QUEUES.TITLE');
    }

    ngOnInit(): void {
        this.buildOptions();
        this.initFilterFields();
        this.loadData();
        this.translate.onLangChange.subscribe(() => {
            this.buildOptions();
            this.initFilterFields();
        });
    }

    private buildOptions(): void {
        this.operatorOptions = OPERATORS_CONST.map((op) => ({
            ...op,
            label: this.translate.instant(op.label),
        }));

        this.reportOptions = REPORT_CONST.map((rep) => ({
            ...rep,
            label: this.translate.instant(rep.label),
        }));

        this.sourceOptions = SOURCE_CONST.map((src) => ({
            ...src,
            label: this.translate.instant(src.label),
        }));
    }

    private initFilterFields(): void {
        this.filterFields = [
            {
                type: 'text',
                name: 'initiator_phone_number',
                label: 'REPORTS_REQUESTS.QUEUES.FILTER.INITIATOR',
                placeholder: 'REPORTS_REQUESTS.QUEUES.FILTER.INITIATOR',
                class: 'p-short',
            },
            {
                type: 'text',
                name: 'uniq_id',
                label: 'REPORTS_REQUESTS.QUEUES.FILTER.UNIQ_ID',
                placeholder: 'REPORTS_REQUESTS.QUEUES.FILTER.UNIQ_ID',
            },
            {
                type: 'select',
                name: 'report_type',
                label: 'REPORTS_REQUESTS.QUEUES.FILTER.REPORT_TYPE',
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
                label: 'REPORTS_REQUESTS.QUEUES.FILTER.OPERATORS',
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
                label: 'REPORTS_REQUESTS.QUEUES.FILTER.SOURCE',
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
                label: 'REPORTS_REQUESTS.QUEUES.FILTER.DATE.FROM',
                class: 'p-short',
            },
            {
                type: 'date',
                name: 'end_date',
                label: 'REPORTS_REQUESTS.QUEUES.FILTER.DATE.TO',
                class: 'p-short',
            },
        ];
    }

    private loadData(): void {
        const defaultFilter = QueuesFilter.create(
            {} as QueuesFilterPayloadEntity
        );
        this.facade.fetchQueues(defaultFilter, '1', false);
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

        const filterData: QueuesFilterPayloadEntity = {
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

        const filter = QueuesFilter.create(filterData);
        this.facade.fetchQueues(filter, '1', true);
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
        item: QueuesEntity;
        actionId?: string;
    }): void {
        const { item } = event;
        this.selectedReportId = item.uniqId;
        this.reportTreatmentVisible = true;
    }

    public onReportTreatmentClosed(): void {
        this.reportTreatmentVisible = false;
        this.selectedReportId = null;
    }

    public refreshQueues(): void {
        this.facade.refresh();
    }

    public onExportExcel(): void {
        const queues = this.items();
        if (queues && queues.length > 0) {
            const fileName = `${this.exportFilePrefix}-queues`;
            this.exportService.exportAsExcelFile(
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

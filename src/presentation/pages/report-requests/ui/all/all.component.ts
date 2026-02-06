import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
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

import { AllFacade } from '@presentation/pages/report-requests/application/all.facade';
import { AllEntity } from '@presentation/pages/report-requests/domain/entities/all/all.entity';
import { AllFilter } from '@presentation/pages/report-requests/domain/value-objects/all-filter.vo';
import { ManagementComponent } from '@presentation/pages/reports-processing/ui/management/management.component';

import { ALL_TABLE_CONST } from '../../domain/constants/all/all-table.constants';
import { STATUS_CONST } from '../../domain/constants/tasks/status.constant';
import { AllFilterPayloadEntity } from '../../domain/entities/all/all-filter-payload.entity';

@Component({
    selector: 'app-all',
    standalone: true,
    templateUrl: './all.component.html',
    styleUrls: ['./all.component.scss'],
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
export class AllComponent implements OnInit {
    private readonly title = inject(Title);
    public readonly facade = inject(AllFacade);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );
    private readonly appCustomizationService = inject(AppCustomizationService);

    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    readonly allItems = toSignal(this.facade.all$, {
        initialValue: [],
    });
    readonly isLoading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });

    public reportTreatmentVisible = false;
    public selectedReportId: string | null = null;

    public readonly tableConfig = ALL_TABLE_CONST;

    public formFilter: FormGroup = this.fb.group({
        initiator_phone_number: new FormControl(''),
        uniq_id: new FormControl(''),
        start_date: new FormControl(null),
        end_date: new FormControl(null),
        report_type: new FormControl(null),
        operators: new FormControl([]),
        source: new FormControl(null),
        state: new FormControl(null),
    });

    public filterFields: FilterField[] = [];
    private reportOptions: Record<string, string>[] = [];
    private operatorOptions: Record<string, string>[] = [];
    private sourceOptions: Record<string, string>[] = [];
    private stateOptions: Record<string, string>[] = [];

    constructor() {
        this.title.setTitle('REPORTS_REQUESTS.ALL.TITLE');
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

        this.stateOptions = STATUS_CONST.map((state) => ({
            ...state,
            label: this.translate.instant(state.label),
        }));
    }

    private initFilterFields(): void {
        this.filterFields = [
            {
                type: 'text',
                name: 'initiator_phone_number',
                label: 'REPORTS_REQUESTS.ALL.FILTER.INITIATOR',
                placeholder: 'REPORTS_REQUESTS.ALL.FILTER.INITIATOR',
                class: 'p-short',
            },
            {
                type: 'text',
                name: 'uniq_id',
                label: 'REPORTS_REQUESTS.ALL.FILTER.UNIQ_ID',
                placeholder: 'REPORTS_REQUESTS.ALL.FILTER.UNIQ_ID',
            },
            {
                type: 'select',
                name: 'report_type',
                label: 'REPORTS_REQUESTS.ALL.FILTER.REPORT_TYPE',
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
                label: 'REPORTS_REQUESTS.ALL.FILTER.OPERATORS',
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
                label: 'REPORTS_REQUESTS.ALL.FILTER.SOURCE',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                class: 'p-medium',
                options: this.sourceOptions,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                filter: false,
            },
            {
                type: 'select',
                name: 'state',
                label: 'REPORTS_REQUESTS.ALL.FILTER.STATE',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                class: 'p-medium',
                options: this.stateOptions,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                filter: false,
            },
            {
                type: 'date',
                name: 'start_date',
                label: 'REPORTS_REQUESTS.ALL.FILTER.DATE.FROM',
                class: 'p-short',
            },
            {
                type: 'date',
                name: 'end_date',
                label: 'REPORTS_REQUESTS.ALL.FILTER.DATE.TO',
                class: 'p-short',
            },
        ];
    }

    private loadData(): void {
        const defaultFilter = AllFilter.create();
        this.facade.fetchAll(defaultFilter, '1', false);
    }

    public filter(filterData: AllFilterPayloadEntity): void {
        const filter = AllFilter.create(filterData);
        this.facade.fetchAll(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.facade.changePage(event + 1);
    }

    public onActionClicked({
        item,
        actionId,
    }: {
        item: AllEntity;
        actionId: undefined;
    }): void {
        console.log('actionId', actionId);
        this.selectedReportId = item.uniqId;
        this.reportTreatmentVisible = true;
    }

    public onReportTreatmentClosed(): void {
        this.reportTreatmentVisible = false;
        this.selectedReportId = null;
    }

    public refreshAll(): void {
        this.facade.refresh();
    }

    public onExportExcel(): void {
        const all = this.allItems();
        if (all && all.length > 0) {
            const fileName = `${this.exportFilePrefix}-all`;
            this.tableExportExcelFileService.exportAsExcelFile(
                all,
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

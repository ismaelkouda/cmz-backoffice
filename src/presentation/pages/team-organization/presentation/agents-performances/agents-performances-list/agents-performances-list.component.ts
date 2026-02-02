import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    OnInit,
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
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { parseAndValidateDateRange } from '@shared/domain/utils/date-range.utils';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';

import { AgentsPerformancesFacade } from '@presentation/pages/team-organization/application/services/agents-performances/agents-performances.facade';
import { AGENTS_PERFORMANCES_TABLE_CONSTANT } from '@presentation/pages/team-organization/domain/constants/agents-performances/agents-performances-table.constant';
import { AgentsPerformancesFilterControl } from '@presentation/pages/team-organization/domain/controls/agents-performances/agents-performances-filter.control';
import { AgentsPerformancesEntity } from '@presentation/pages/team-organization/domain/entities/agents-performances/agents-performances.entity';

@Component({
    selector: 'app-agents-performances',
    standalone: true,
    templateUrl: './agents-performances-list.component.html',
    styleUrls: ['./agents-performances-list.component.scss'],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        BreadcrumbComponent,
        PageTitleComponent,
        FilterComponent,
        TableComponent,
        PaginationComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentsPerformancesListComponent implements OnInit {
    private readonly title = inject(Title);
    public readonly facade = inject(AgentsPerformancesFacade);
    private readonly translate = inject(TranslateService);
    private readonly toastr = inject(ToastrService);
    private readonly fb = inject(FormBuilder);
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );
    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );
    public readonly tableConfig = AGENTS_PERFORMANCES_TABLE_CONSTANT;
    readonly isLoading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: {} as Paginate<AgentsPerformancesEntity>,
    });
    public formFilter!: FormGroup<AgentsPerformancesFilterControl>;

    constructor() {
        this.setPageTitle();

        effect(
            () => {
                this.facade.readAll();
            },
            { allowSignalWrites: true }
        );
    }

    ngOnInit(): void {
        this.initFilter();
    }

    private setPageTitle(): void {
        this.title.setTitle(
            this.translate.instant(
                'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TITLE'
            )
        );
    }

    private initFilter(): void {
        this.formFilter = this.fb.group<AgentsPerformancesFilterControl>({
            search: new FormControl<string | null>(null),
            startDate: new FormControl<string | null>(null),
            endDate: new FormControl<string | null>(null),
        });
    }

    public filterFields(): FilterField[] {
        return [
            {
                type: 'text',
                name: 'search',
                label: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.SEARCH',
                placeholder:
                    'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.SEARCH_PLACEHOLDER',
            },
            {
                type: 'date',
                name: 'startDate',
                label: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.DATE.FROM',
                placeholder:
                    'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.DATE.PLACEHOLDER',
            },
            {
                type: 'date',
                name: 'endDate',
                label: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.DATE.TO',
                placeholder:
                    'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.FILTER.DATE.PLACEHOLDER',
            },
        ];
    }

    public filter(formValue: any): void {
        const { startDate, endDate, isValidRange } = parseAndValidateDateRange(
            formValue.startDate,
            formValue.endDate
        );

        if (!isValidRange) {
            this.toastr.error(
                this.translate.instant('COMMON.INVALID_DATE_RANGE')
            );
            return;
        }

        const filter = {
            search: formValue.search,
            startDate: startDate?.format('YYYY-MM-DD'),
            endDate: endDate?.format('YYYY-MM-DD'),
        };

        this.facade.readAll(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.facade.changePage(event + 1);
    }

    public refresh(): void {
        this.formFilter.reset();
        this.facade.refresh();
    }

    public onExportExcel(): void {
        const agentsPerformances = this.items();

        if (!agentsPerformances || agentsPerformances.length === 0) {
            this.toastr.error(this.translate.instant('EXPORT.NO_DATA'));
            return;
        }

        const fileName = `${this.exportFilePrefix}-agents-performances`;
        this.tableExportExcelFileService.exportAsExcelFile(
            agentsPerformances,
            this.tableConfig,
            fileName
        );
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

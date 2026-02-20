import { CommonModule, JsonPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
    Signal,
    computed,
    OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';

import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { HISTORY_TABLE_CONSTANT } from '@shared/components/history/domain/constants/history-table.constant';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { parseAndValidateDateRange } from '@shared/domain/utils/date-range.utils';

import { HistoryFilterDto } from './application/dto/history-filter.dto';
import { HistoryFacade } from './application/services/history.facade';

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
        DialogModule,
        JsonPipe,
    ],
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent implements OnInit {
    private readonly title = inject(Title);
    private readonly facade = inject(HistoryFacade);
    private readonly translate = inject(TranslateService);
    private readonly toastr = inject(ToastrService);
    private readonly detailsFacade = inject(HistoryFacade);
    private readonly fb = inject(FormBuilder);
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );
    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly paginationResponse = toSignal(this.facade.pagination$);

    readonly details = toSignal(this.detailsFacade.items$, {
        initialValue: [],
    });
    readonly displayDetails = signal<boolean>(false);

    readonly pagination = computed(() => {
        const p = this.paginationResponse();
        return {
            page: Number(p?.current_page ?? 0),
            first:
                (Number(p?.current_page ?? 1) - 1) * Number(p?.per_page ?? 10),
            rows: Number(p?.per_page ?? 10),
            pageCount: Number(p?.last_page ?? 1),
            totalRecords: Number(p?.total ?? 0),
        };
    });

    readonly selectedItem = signal<any>(null);

    readonly form = this.fb.group({
        search: new FormControl<string>(''),
        startDate: new FormControl<Date | null>(null),
        endDate: new FormControl<Date | null>(null),
    });

    readonly filterFields: Signal<FilterField[]> = computed(() => [
        {
            type: 'text',
            name: 'search',
            label: 'HISTORY.FILTER.SEARCH',
            placeholder: 'HISTORY.FILTER.SEARCH_PLACEHOLDER',
            icon: 'pi pi-search',
        },
        {
            type: 'date',
            name: 'startDate',
            label: 'HISTORY.FILTER.START_DATE',
            placeholder: 'HISTORY.FILTER.START_DATE_PLACEHOLDER',
            icon: 'pi pi-calendar',
        },
        {
            type: 'date',
            name: 'endDate',
            label: 'HISTORY.FILTER.END_DATE',
            placeholder: 'HISTORY.FILTER.END_DATE_PLACEHOLDER',
            icon: 'pi pi-calendar',
        },
    ]);

    readonly tableConfig = HISTORY_TABLE_CONSTANT;

    ngOnInit(): void {
        this.setPageTitle();
        this.facade.readAll();
    }

    private setPageTitle(): void {
        this.title.setTitle(this.translate.instant('HISTORY.TITLE'));
    }

    onFilter(values: any): void {
        const { startDate, endDate, isValidRange } = parseAndValidateDateRange(
            values.startDate,
            values.endDate
        );

        if (!isValidRange) {
            this.toastr.error(
                this.translate.instant('COMMON.INVALID_DATE_RANGE')
            );
            return;
        }
        const filter: HistoryFilterDto = {
            search: values.search,
            startDate: startDate?.format('YYYY-MM-DD'),
            endDate: endDate?.format('YYYY-MM-DD'),
        };
        this.facade.readAll(filter);
    }

    onRefresh(): void {
        this.form.reset();
        this.facade.refresh();
    }

    onPageChange(event: any): void {
        this.facade.changePage(event.page + 1);
    }

    onViewDetails(item: any): void {
        this.selectedItem.set(item);
        this.detailsFacade.readAll(item.uniqId);
        this.displayDetails.set(true);
    }

    public onExportExcel(): void {
        const accessLogs = this.items();

        if (!accessLogs || accessLogs.length === 0) {
            this.toastr.error(this.translate.instant('EXPORT.NO_DATA'));
            return;
        }

        const fileName = `${this.exportFilePrefix}-access-logs`;
        this.tableExportExcelFileService.exportAsExcelFile(
            accessLogs,
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

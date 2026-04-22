import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
    Signal,
    computed,
    OnInit,
    DestroyRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { HISTORY_TABLE_CONSTANT } from '@shared/components/history/presentation/adapters/history-table.constant';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { parseAndValidateDateRange } from '@shared/domain/utils/date-range.utils';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { map } from 'rxjs';

import { HistoryFilterDto } from '../../../application/dto/history-filter.dto';
import { HistoryFacade } from '../../../application/services/history.facade';
import { HistoryVmProps } from '../../adapters/history-vm-props.interface';
import { HistoryPresenter } from '../../adapters/history-vm.presenter';
import { HistoryDialogComponent } from '../history-dialog/history-dialog.component';

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        FilterComponent,
        TableComponent,
        HistoryDialogComponent,
        PaginationComponent,
        ReactiveFormsModule,
        DialogModule,
    ],
    templateUrl: './history-page.component.html',
    styleUrls: ['./history-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryPageComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly title = inject(Title);
    private readonly facade = inject(HistoryFacade);
    private readonly translate = inject(TranslateService);
    private readonly toastr = inject(ToastrService);
    private readonly destroyRef = inject(DestroyRef);
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
    readonly pagination = toSignal(this.facade.pagination$);

    readonly details = toSignal(this.detailsFacade.items$, {
        initialValue: [],
    });
    readonly displayDetails = signal<boolean>(false);

    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );

    readonly presenter = new HistoryPresenter();

    readonly itemsVM = computed(() => {
        this.currentLang();
        return this.items().map((item) => this.presenter.map(item));
    });

    readonly selectedItem = signal<any>(null);

    public readonly typeModel: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((params: Params) => {
                console.log('params: ', params);
                return params['ref'];
            })
        ),
        { initialValue: '' }
    );
    public readonly module: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((params: Params) => {
                return params['module'];
            })
        ),
        { initialValue: '' }
    );
    public uniqId!: string;

    readonly form = this.fb.group({
        search: new FormControl<string>(''),
        startDate: new FormControl<Date | null>(null),
        endDate: new FormControl<Date | null>(null),
    });
    public readonly isVisibleDialog = signal<boolean>(false);

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
            label: 'COMMON.START_DATE',
            placeholder: 'COMMON.DATE_PLACEHOLDER',
        },
        {
            type: 'date',
            name: 'endDate',
            label: 'COMMON.END_DATE',
            placeholder: 'COMMON.DATE_PLACEHOLDER',
        },
    ]);

    readonly tableConfig = HISTORY_TABLE_CONSTANT;

    ngOnInit(): void {
        this.facade.readAll(
            {
                typeModel: this.typeModel(),
                module: this.module(),
                startDate: '',
                endDate: '',
                search: '',
            },
            '1',
            true
        );
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
            typeModel: this.typeModel(),
            module: this.module(),
            search: values.search,
            startDate: startDate?.format('YYYY-MM-DD'),
            endDate: endDate?.format('YYYY-MM-DD'),
        };
        this.facade.readAll(filter);
    }

    onRefreshClicked(): void {
        this.form.reset();
        this.facade.refresh();
    }

    onPageChange(event: any): void {
        this.facade.changePage(event.page + 1);
    }

    public onActionClicked(event: {
        item: HistoryVmProps;
        actionId?: string;
    }): void {
        const { item } = event;
        this.uniqId = item.uniqId;
        this.isVisibleDialog.set(true);
    }

    public onVisibleChange(event: boolean): void {
        this.isVisibleDialog.set(event);
    }

    public onExportClicked(): void {
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

import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
    Signal,
    computed,
    DestroyRef,
} from '@angular/core';
import {
    takeUntilDestroyed,
    toObservable,
    toSignal,
} from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { HistoryFacade } from '@shared/components/history/application/services/history.facade';
import { HISTORY_TABLE } from '@shared/components/history/presentation/adapters/history-table.constant';
import { HistoryVmProps } from '@shared/components/history/presentation/adapters/history-vm-props.interface';
import { HistoryPresenter } from '@shared/components/history/presentation/adapters/history-vm.presenter';
import { HistoryDialogComponent } from '@shared/components/history/presentation/features/history-dialog/history-dialog.component';
import { HistoryFilterStore } from '@shared/components/history/presentation/store/history-filter.store';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { map, switchMap } from 'rxjs';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { formatDate } from '@shared/domain/functions/format-data.function';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [
        TranslateModule,
        FilterComponent,
        TableComponent,
        HistoryDialogComponent,
        PaginationComponent,
        ReactiveFormsModule,
        DialogModule,
    ],
    providers: [HistoryFilterStore],
    templateUrl: './history-page.component.html',
    styleUrls: ['./history-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryPageComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly route = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    protected readonly facade = inject(HistoryFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly store = inject(HistoryFilterStore);
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
    protected uniqId: string | null = null;
    protected readonly tableConfig = HISTORY_TABLE;
    protected readonly form = this.store.form;
    protected readonly isVisibleDialog = signal<boolean>(false);

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

    protected readonly typeModel = computed(() => this.getQueryParam('ref'));
    protected readonly module = computed(() => this.getQueryParam('module'));
    private readonly queryParams = toSignal(
        this.route.queryParams.pipe(map((params: Params) => params)),
        { initialValue: {} }
    );
    private getQueryParam(key: string): string {
        const params = this.queryParams() as Record<string, string>;
        return params[key] ?? '';
    }
    protected readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();

        return [
            {
                type: 'text',
                name: 'search',
                label: this.t('HISTORY.FILTER.SEARCH'),
                placeholder: this.t('HISTORY.FILTER.SEARCH'),
                icon: 'pi pi-id-card',
                translationKeys: {
                    label: 'HISTORY.FILTER.SEARCH',
                    placeholder: 'HISTORY.FILTER.SEARCH',
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
            tooltip: this.t('HISTORY.TOOLTIP.REFRESH'),
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
    private readonly presenter = new HistoryPresenter(
        this.translate.instant.bind(this.translate)
    );
    protected readonly itemsVM = computed(() => {
        this.currentLang();
        return this.items().map((item) => this.presenter.map(item));
    });

    private readonly canExportData = computed(
        () => this.itemsVM().length < 1 || this.loading()
    );

    private readonly exportTooltip = computed(() => {
        const noData = this.itemsVM().length < 1;
        if (noData) {
            return this.t('HISTORY.TOOLTIP.NO_EXPORT');
        }
        return this.t('HISTORY.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    private readonly pageTitleKey = computed(() => 'HISTORY.TITLE');
    private readonly pageTitle$ = toObservable(this.pageTitleKey).pipe(
        switchMap((key) => this.translate.stream(key)),
        takeUntilDestroyed(this.destroyRef)
    );
    constructor() {
        this.pageTitle$.subscribe((translatedTitle) => {
            this.title.setTitle(translatedTitle);
        });
        this.initializeFetchEffect();
    }
    private initializeFetchEffect(): void {
        const typeModel = this.typeModel();
        const module = this.module();
        if (!typeModel) {
            return;
        }
        this.facade.readAll({ typeModel, module }, '1');
    }
    protected onHeaderClicked(actionId: string): void {
        const action = this.headerActions[actionId];
        if (!action) {
            console.warn('Unknown action:', actionId);
            return;
        }
        action();
    }
    private onRefreshData(): void {
        this.store.reset();
        this.facade.refresh();
    }
    protected onFilterClicked(): void {
        const typeModel = this.typeModel();
        const module = this.module();
        this.facade.readAll(this.store.value(typeModel, module), '1');
    }
    protected onChangePageClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }
    private readonly headerActions: Record<string, () => void> = {
        refresh: () => this.onRefreshData(),
        export: () => {
            if (this.canExportData()) {
                this.toast.error(this.exportTooltip());
                return;
            }
            this.exportData();
        },
    };
    protected onActionClicked(event: {
        item: HistoryVmProps;
        actionId?: string;
    }): void {
        const { item } = event;
        this.uniqId = item.uniqId;
        this.isVisibleDialog.set(true);
    }
    protected onVisibleDialogClicked(event: boolean): void {
        this.isVisibleDialog.set(event);
    }
    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
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

        const fileName = `${this.exportFilePrefix}-history`;

        const exportColumns: ExportColumn[] = HISTORY_TABLE.cols
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
                        if (col.field === 'createdAt' && value) {
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
                sheetName: this.translate.instant('HISTORY.TITLE'),
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
}

import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
    Signal,
    computed,
    DestroyRef,
    effect,
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
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { map, switchMap } from 'rxjs';

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
    providers: [HistoryFilterStore],
    templateUrl: './history-page.component.html',
    styleUrls: ['./history-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryPageComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    protected readonly facade = inject(HistoryFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly store = inject(HistoryFilterStore);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.customization.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
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
    private readonly presenter = new HistoryPresenter();
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
        effect(() => {
            const typeModel = this.typeModel();
            const module = this.module();
            if (!typeModel) {
                return;
            }
            this.facade.readAll({ typeModel, module }, '1', true);
        });
    }
    protected onHeaderButtonClicked(actionId: string): void {
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
        this.facade.readAll(this.store.value(typeModel, module), '1', true);
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
        if (!this.canExportData()) {
            this.toast.error(this.exportTooltip());
            return;
        }
        const item = this.items();
        if (item && item.length > 0) {
            const fileName = `${this.exportFilePrefix}-history`;
            this.exportService.exportAsExcelFile(
                item,
                this.tableConfig,
                fileName
            );
        } else {
            this.toast.error(this.t('EXPORT.NO_DATA'));
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

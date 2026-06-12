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
import { ActivatedRoute, Router } from '@angular/router';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { HomeFacade } from '@pages/content-management/application/services/home/home.facade';
import { Status } from '@pages/content-management/domain/enums/home/home-status.enum';
import { HomeFilterDto } from '@presentation/pages/content-management/application/dto/home/home-filter.dto';
import { HomeFilterStore } from '@presentation/pages/content-management/application/store/home/home-filter.store';
import { FILTER_KEYS } from '@presentation/pages/content-management/domain/constants/home/home-filter-keys.constants';
import { HOME_TABLE } from '@presentation/pages/content-management/domain/constants/home/home-table.constants';
import { HomeVmProps } from '@presentation/pages/content-management/presentation/adapters/home/home-vm-props.interface';
import { HomePresenter } from '@presentation/pages/content-management/presentation/adapters/home/home-vm.presenter';
import { HOME_FORM_ROUTE } from '@presentation/pages/content-management/presentation/features/home/home-paths.constants';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptions,
    enumToFilterOptionsWithValue,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { Platform } from '@shared/domain/enums/platform.enum';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { ToastrService } from 'ngx-toastr';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';
type TTableActions = 'edit' | 'delete' | 'enable' | 'disable';

@Component({
    selector: 'app-home-list',
    standalone: true,
    templateUrl: './home-list.component.html',
    styleUrls: ['./home-list.component.scss'],
    imports: [
        FilterComponent,
        TableComponent,
        PaginationComponent,
        TranslateModule,
    ],
    providers: [HomeFilterStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeListComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly title = inject(Title);
    private readonly sweetAlert = inject(SweetAlertService);
    private readonly dateMapper = inject(ApiDateMapper);

    protected readonly facade = inject(HomeFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly formStore = inject(HomeFilterStore);
    private readonly excelExport = inject(ExcelExportService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.customization.app.name
    );
    private readonly canExport = this.permissionActions.can(
        '/content-management/home-blocks',
        'export'
    );
    private readonly canCreate = this.permissionActions.can(
        '/content-management/home-blocks',
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        '/content-management/home-blocks',
        'edit'
    );
    private readonly canDelete = this.permissionActions.can(
        '/content-management/home-blocks',
        'delete'
    );
    private readonly canEnable = this.permissionActions.can(
        '/content-management/home-blocks',
        'edit'
    );
    private readonly canDisable = this.permissionActions.can(
        '/content-management/home-blocks',
        'edit'
    );
    private readonly canChoose = computed(
        () => this.canEdit() && this.canDelete()
    );
    private readonly canExportData = computed(
        () => !this.canExport() || this.itemsVM().length < 1 || this.loading()
    );
    private readonly exportTooltip = computed(() => {
        const permission = !this.canExport();
        const noData = this.itemsVM().length < 1;
        if (permission) {
            return this.t(
                'CONTENT_MANAGEMENT.HOME.TOOLTIP.NO_PERMISSION_EXPORT'
            );
        }
        if (noData) {
            return this.t('CONTENT_MANAGEMENT.HOME.TOOLTIP.NO_EXPORT');
        }
        return this.t('CONTENT_MANAGEMENT.HOME.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    private readonly createTooltip = computed(() => {
        if (!this.canCreate()) {
            return this.t(
                'CONTENT_MANAGEMENT.HOME.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t('CONTENT_MANAGEMENT.HOME.TOOLTIP.CREATE');
    });
    private readonly editTooltip = computed(() => {
        if (!this.canEdit()) {
            return this.t('CONTENT_MANAGEMENT.HOME.TOOLTIP.NO_PERMISSION_EDIT');
        }
        return this.t('CONTENT_MANAGEMENT.HOME.TOOLTIP.NOT_EDIT');
    });
    private readonly deleteTooltip = computed(() => {
        if (!this.canDelete()) {
            return this.t(
                'CONTENT_MANAGEMENT.HOME.TOOLTIP.NO_PERMISSION_DELETE'
            );
        }
        return this.t('CONTENT_MANAGEMENT.HOME.TOOLTIP.NOT_DELETE');
    });
    private readonly enableTooltip = computed(() => {
        if (!this.canEnable()) {
            return this.t(
                'CONTENT_MANAGEMENT.HOME.TOOLTIP.NO_PERMISSION_ACTIVE'
            );
        }
        return this.t('CONTENT_MANAGEMENT.HOME.TOOLTIP.NOT_ACTIVE');
    });
    private readonly disableTooltip = computed(() => {
        if (!this.canDisable()) {
            return this.t(
                'CONTENT_MANAGEMENT.HOME.TOOLTIP.NO_PERMISSION_DISABLE'
            );
        }
        return this.t('CONTENT_MANAGEMENT.HOME.TOOLTIP.NOT_DISABLE');
    });
    private readonly chooseTooltip = computed(() => {
        if (!this.canChoose()) {
            return this.t(
                'CONTENT_MANAGEMENT.HOME.TOOLTIP.NO_PERMISSION_CHOOSE'
            );
        }
        return this.t('CONTENT_MANAGEMENT.HOME.TOOLTIP.NOT_CHOOSE');
    });
    protected readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.CREATE',
            actionId: 'create',
            icon: 'pi pi-user-plus',
            class: 'btn-primary',
            disabled: !this.canCreate(),
            tooltip: this.createTooltip(),
        },
        {
            label: 'COMMON.REFRESH',
            actionId: 'refresh',
            class: 'btn-dark',
            icon: 'pi pi-refresh',
            translateKey: 'COMMON.REFRESH',
            tooltip: this.t('CONTENT_MANAGEMENT.HOME.TOOLTIP.REFRESH'),
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

    protected readonly tableConfig = HOME_TABLE;
    protected readonly form = this.formStore.form;
    private readonly items = toSignal(this.facade.items$, { initialValue: [] });
    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });
    protected readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    protected readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    private readonly statusOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptionsWithValue(Status, this.t.bind(this));
    });
    readonly platformOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(Platform, this.t.bind(this));
    });
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    protected readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        const statusOpts = this.statusOptions();
        const platformOpts = this.platformOptions();

        return [
            {
                type: 'text',
                name: FILTER_KEYS.SEARCH,
                label: this.t('CONTENT_MANAGEMENT.HOME.FILTER.SEARCH'),
                placeholder: this.t(
                    'CONTENT_MANAGEMENT.HOME.FILTER.SEARCH_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'CONTENT_MANAGEMENT.HOME.FILTER.SEARCH',
                    placeholder:
                        'CONTENT_MANAGEMENT.HOME.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: FILTER_KEYS.STATUS,
                label: this.t('CONTENT_MANAGEMENT.HOME.FILTER.STATUS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: statusOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'CONTENT_MANAGEMENT.HOME.FILTER.STATUS',
                },
            },
            {
                type: 'multi-select',
                name: FILTER_KEYS.PLATFORMS,
                label: this.t('CONTENT_MANAGEMENT.HOME.FILTER.PLATFORMS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: platformOpts,
                optionLabel: 'label',
                optionValue: 'value',
                filter: false,
                showToggleAll: false,
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'CONTENT_MANAGEMENT.HOME.FILTER.PLATFORMS',
                },
                class: 'p-medium',
            },
            {
                type: 'date',
                name: FILTER_KEYS.START_DATE,
                label: 'CONTENT_MANAGEMENT.HOME.FILTER.DATE.FROM',
                placeholder: 'CONTENT_MANAGEMENT.HOME.FILTER.DATE.PLACEHOLDER',
            },
            {
                type: 'date',
                name: FILTER_KEYS.END_DATE,
                label: 'CONTENT_MANAGEMENT.HOME.FILTER.DATE.TO',
                placeholder: 'CONTENT_MANAGEMENT.HOME.FILTER.DATE.PLACEHOLDER',
            },
        ];
    });
    private readonly presenter = new HomePresenter(
        this.translate.instant.bind(this.translate)
    );
    protected readonly itemsVM = computed(() => {
        const canEdit = this.canEdit();
        const canDelete = this.canDelete();
        const canEnable = this.canEnable();
        const canDisable = this.canDisable();
        const canChoose = this.canChoose();
        const authorization = {
            canEdit: canEdit,
            canDelete: canDelete,
            canEnable: canEnable,
            canDisable: canDisable,
            canChoose: canChoose,
        };
        const editTooltip = this.editTooltip();
        const deleteTooltip = this.deleteTooltip();
        const enableTooltip = this.enableTooltip();
        const disableTooltip = this.disableTooltip();
        const chooseTooltip = this.chooseTooltip();
        const tooltip = {
            edit: editTooltip,
            delete: deleteTooltip,
            enable: enableTooltip,
            disable: disableTooltip,
            choose: chooseTooltip,
        };
        return this.items().map((item) =>
            this.presenter.map(item, {
                authorization,
                tooltip,
            })
        );
    });
    constructor() {
        this.facade.readAll(this.currentFilter() as HomeFilterDto);
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });
        effect(() => {
            this.pageTitle();
            this.filterFields();
            this.statusOptions();
            this.platformOptions();
        });
    }
    private pageTitle(): void {
        this.currentLang();
        this.title.setTitle(this.t('CONTENT_MANAGEMENT.HOME.TITLE'));
    }
    private onRefreshData(): void {
        this.formStore.reset();
        this.facade.refresh();
    }
    private readonly headerActions: Record<string, () => void> = {
        create: () => {
            if (!this.canCreate()) {
                this.toast.error(this.createTooltip());
                return;
            }
            this.onNavigateToForm({
                item: undefined,
                ref: 'create',
            });
        },
        refresh: () => this.onRefreshData(),
        export: () => {
            if (this.canExportData()) {
                this.toast.error(this.exportTooltip());
                return;
            }
            this.exportData();
        },
    };
    private readonly tableActions: Record<
        TTableActions,
        (item: HomeVmProps) => void
    > = {
        edit: (item) => {
            if (!this.canEdit()) {
                this.toast.error(this.editTooltip());
                return;
            }

            this.onNavigateToForm({
                item,
                ref: 'edit',
            });
        },

        delete: (item) => {
            if (!this.canDelete()) {
                this.toast.error(this.deleteTooltip());
                return;
            }
            this.onDelete(item);
        },

        enable: (item) => {
            if (!this.canEnable()) {
                this.toast.error(this.enableTooltip());
                return;
            }

            this.onEnableClicked(item);
        },

        disable: (item) => {
            if (!this.canDisable()) {
                this.toast.error(this.disableTooltip());
                return;
            }

            this.onDisableClicked(item);
        },
    };
    private onNavigateToForm(event: {
        item?: HomeVmProps;
        ref: 'create' | 'edit';
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate(['../', HOME_FORM_ROUTE], {
            relativeTo: this.route,
            queryParams,
        });
    }
    protected onFilterClicked(filterValues: any): void {
        this.facade.readAll(filterValues, '1', { forceRefresh: true });
    }
    protected onChangePageClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }
    protected onHeaderButtonClicked(actionId: string): void {
        const action = this.headerActions[actionId];
        if (!action) {
            console.warn('Unknown action:', actionId);
            return;
        }
        action();
    }
    protected onActionClicked(event: {
        item: HomeVmProps;
        actionId?: TTableActions;
    }): void {
        const { item, actionId } = event;
        if (!actionId) {
            console.warn('Missing actionId');
            return;
        }
        const action = this.tableActions[actionId];
        if (!action) {
            console.warn('Unknown action:', actionId);
            return;
        }
        action(item);
    }
    protected async onDelete(item: HomeVmProps): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey: 'CONTENT_MANAGEMENT.HOME.SWEET_ALERT.TITLE.DELETE',
            messageKey: 'CONTENT_MANAGEMENT.HOME.SWEET_ALERT.MESSAGE.DELETE',
            messageParams: {
                uniqId: item.actionsRef,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.delete({ uniqId });
    }
    protected async onEnableClicked(item: HomeVmProps): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey: 'CONTENT_MANAGEMENT.HOME.SWEET_ALERT.TITLE_ENABLE',
            messageKey: 'CONTENT_MANAGEMENT.HOME.SWEET_ALERT.MESSAGE.ENABLE',
            messageParams: {
                uniqId: item.actionsRef,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.enable({ uniqId });
    }
    protected async onDisableClicked(item: HomeVmProps): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey: 'CONTENT_MANAGEMENT.HOME.SWEET_ALERT.TITLE_DISABLE',
            messageKey: 'CONTENT_MANAGEMENT.HOME.SWEET_ALERT.MESSAGE.DISABLE',
            messageParams: {
                uniqId: item.actionsRef,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.disable({ uniqId });
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

        const fileName = `${this.exportFilePrefix}-homes`;

        const exportColumns: ExportColumn[] = HOME_TABLE.cols
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
                            return this.dateMapper.toDateTimeApi(value);
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
                sheetName: this.translate.instant(
                    'CONTENT_MANAGEMENT.HOME.TITLE'
                ),
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
    private t(key: string): string {
        return this.translate.instant(key);
    }
}

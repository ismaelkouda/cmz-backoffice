import {
    Component,
    DestroyRef,
    Signal,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SiteGroupFacade } from '@pages/coverage-areas/application/services/site-group/site-group.facade';
import { SITE_GROUP_FORM } from '@pages/coverage-areas/presentation/features/site-group/site-group-paths.constants';
import { SiteGroupFilterDto } from '@pages/coverage-areas/application/dto/site-group/site-group-filter.dto';
import { SITE_GROUP_TABLE } from '@pages/coverage-areas/presentation/adapters/site-group/site-group-table.constant';
import { SiteGroupVmProps } from '@pages/coverage-areas/presentation/adapters/site-group/site-group-vm-props.interface';
import { SiteGroupPresenter } from '@pages/coverage-areas/presentation/adapters/site-group/site-group-vm.presenter';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { ToastrService } from 'ngx-toastr';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { formatDate } from '@shared/domain/functions/format-data.function';
import { SiteGroupFilterStore } from '@pages/coverage-areas/presentation/store/site-group/site-group-filter.store';
import {
    enumToFilterOptionsWithValue,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { Status } from '@pages/coverage-areas/domain/enums/site-group/site-group-status.enum';
type TTableActions = 'details' | 'edit' | 'delete' | 'enable' | 'disable';

const PERMISSION_PATH = '/coverage-areas/site-groups';

@Component({
    selector: 'app-site-group-list',
    standalone: true,
    imports: [
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    providers: [SiteGroupFilterStore],
    templateUrl: './site-group-list.component.html',
    styleUrls: ['./site-group-list.component.scss'],
})
export class SiteGroupListComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    private readonly sweetAlert = inject(SweetAlertService);
    protected readonly facade = inject(SiteGroupFacade);
    private readonly formStore = inject(SiteGroupFilterStore);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly excelExport = inject(ExcelExportService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.customization.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    private readonly canExport = this.permissionActions.can(
        PERMISSION_PATH,
        'export'
    );
    private readonly canCreate = this.permissionActions.can(
        PERMISSION_PATH,
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        PERMISSION_PATH,
        'edit'
    );
    private readonly canDelete = this.permissionActions.can(
        PERMISSION_PATH,
        'delete'
    );
    private readonly canEnable = this.permissionActions.can(
        PERMISSION_PATH,
        'edit'
    );
    private readonly canDisable = this.permissionActions.can(
        PERMISSION_PATH,
        'edit'
    );
    private readonly canChoose = computed(
        () =>
            (this.canEdit() && this.canDelete()) ||
            this.canEnable() ||
            this.canDisable()
    );
    private readonly canExportData = computed(
        () => !this.canExport() || this.itemsVM().length < 1 || this.loading()
    );
    private readonly exportTooltip = computed(() => {
        const permission = !this.canExport();
        const noData = this.itemsVM().length < 1;
        if (permission) {
            return this.t(
                'COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NO_PERMISSION_EXPORT'
            );
        }
        if (noData) {
            return this.t('COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NO_EXPORT');
        }
        return this.t('COVERAGE_AREAS.SITE_GROUP.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    private readonly createTooltip = computed(() => {
        if (!this.canCreate()) {
            return this.t(
                'COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t('COVERAGE_AREAS.SITE_GROUP.TOOLTIP.CREATE');
    });
    private readonly editTooltip = computed(() => {
        if (!this.canEdit()) {
            return this.t(
                'COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NO_PERMISSION_EDIT'
            );
        }
        return this.t('COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NOT_EDIT');
    });
    private readonly deleteTooltip = computed(() => {
        if (!this.canDelete()) {
            return this.t(
                'COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NO_PERMISSION_DELETE'
            );
        }
        return this.t('COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NOT_DELETE');
    });
    private readonly enableTooltip = computed(() => {
        if (!this.canEnable()) {
            return this.t(
                'COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NO_PERMISSION_ACTIVE'
            );
        }
        return this.t('COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NOT_ACTIVE');
    });
    private readonly disableTooltip = computed(() => {
        if (!this.canDisable()) {
            return this.t(
                'COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NO_PERMISSION_DISABLE'
            );
        }
        return this.t('COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NOT_DISABLE');
    });
    private readonly chooseTooltip = computed(() => {
        if (!this.canChoose()) {
            return this.t(
                'COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NO_PERMISSION_CHOOSE'
            );
        }
        return this.t('COVERAGE_AREAS.SITE_GROUP.TOOLTIP.NOT_CHOOSE');
    });
    protected readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.CREATE',
            actionId: 'create',
            icon: 'pi pi-plus',
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
            tooltip: this.t('COVERAGE_AREAS.SITE_GROUP.TOOLTIP.REFRESH'),
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

    protected readonly tableConfig = SITE_GROUP_TABLE;
    protected readonly form = this.formStore.form;
    protected readonly items = toSignal(this.facade.items$, {
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
    readonly statusOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptionsWithValue(Status, this.t.bind(this));
    });
    protected readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        const statusOpts = this.statusOptions();
        return [
            {
                type: 'text',
                name: 'search',
                label: this.t('COVERAGE_AREAS.SITE_GROUP.FILTER.SEARCH'),
                placeholder: this.t(
                    'COVERAGE_AREAS.SITE_GROUP.FILTER.SEARCH_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'COVERAGE_AREAS.SITE_GROUP.FILTER.SEARCH',
                    placeholder:
                        'COVERAGE_AREAS.SITE_GROUP.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'status',
                label: this.t('COVERAGE_AREAS.SITE_GROUP.FILTER.STATUS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: statusOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
            },
            {
                type: 'date',
                name: 'startDate',
                label: 'COVERAGE_AREAS.SITE_GROUP.FILTER.DATE.FROM',
                placeholder:
                    'COVERAGE_AREAS.SITE_GROUP.FILTER.DATE.PLACEHOLDER',
            },
            {
                type: 'date',
                name: 'endDate',
                label: 'COVERAGE_AREAS.SITE_GROUP.FILTER.DATE.TO',
                placeholder:
                    'COVERAGE_AREAS.SITE_GROUP.FILTER.DATE.PLACEHOLDER',
            },
        ];
    });
    private readonly presenter = new SiteGroupPresenter(
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
        this.facade.readAll(this.currentFilter() as SiteGroupFilterDto);
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });
        effect(() => {
            this.pageTitle();
        });
    }
    private pageTitle(): void {
        this.currentLang();
        this.title.setTitle(this.t('COVERAGE_AREAS.SITE_GROUP.TITLE'));
    }
    private onRefreshData(): void {
        this.facade.refresh();
    }
    protected onFilterClicked(): void {
        this.facade.readAll(this.formStore.value, '1', { forceRefresh: true });
    }
    protected onChangePageClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }
    protected onHeaderClicked(actionId: string): void {
        const actions: Record<string, () => void> = {
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
        actions[actionId]?.();
    }
    private readonly tableActions: Record<
        TTableActions,
        (item: SiteGroupVmProps) => void
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
        details: (item) => {
            this.onNavigateToForm({
                item,
                ref: 'details',
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
        item?: SiteGroupVmProps;
        ref: 'create' | 'edit' | 'details';
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate(['../', SITE_GROUP_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }
    protected onActionClicked(event: {
        item: SiteGroupVmProps;
        actionId?: TTableActions;
    }): void {
        const { item, actionId } = event;
        if (!actionId) {
            return;
        }
        const action = this.tableActions[actionId];
        if (!action) {
            return;
        }
        action(item);
    }
    protected async onDelete(item: SiteGroupVmProps): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey: 'COVERAGE_AREAS.SITE_GROUP.SWEET_ALERT.TITLE.DELETE',
            messageKey: 'COVERAGE_AREAS.SITE_GROUP.SWEET_ALERT.MESSAGE.DELETE',
            messageParams: {
                uniqId: item.actionsRef,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.delete({ uniqId });
    }
    protected async onEnableClicked(item: SiteGroupVmProps): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey: 'COVERAGE_AREAS.SITE_GROUP.SWEET_ALERT.TITLE.ENABLE',
            messageKey: 'COVERAGE_AREAS.SITE_GROUP.SWEET_ALERT.MESSAGE.ENABLE',
            messageParams: {
                uniqId: item.actionsRef,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.enable({ uniqId });
    }
    protected async onDisableClicked(item: SiteGroupVmProps): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey: 'COVERAGE_AREAS.SITE_GROUP.SWEET_ALERT.TITLE.DISABLE',
            messageKey: 'COVERAGE_AREAS.SITE_GROUP.SWEET_ALERT.MESSAGE.DISABLE',
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

        const fileName = `${this.exportFilePrefix}-site-groups`;

        const exportColumns: ExportColumn[] = SITE_GROUP_TABLE.cols
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
                        if (col.field === 'updatedAt' && value) {
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
                sheetName: this.translate.instant(
                    'COVERAGE_AREAS.SITE_GROUP.TITLE'
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

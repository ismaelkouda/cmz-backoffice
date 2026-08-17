import {
    ChangeDetectionStrategy,
    Component,
    Signal,
    computed,
    DestroyRef,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RadioRelayLinksFacade } from '@pages/coverage-areas/application/services/radio-relay-links/radio-relay-links.facade';
import { RADIO_RELAY_LINKS_FORM } from '@pages/coverage-areas/presentation/features/radio-relay-links/radio-relay-links-paths.constants';
import { RADIO_RELAY_LINKS_TABLE } from '@pages/coverage-areas/presentation/adapters/radio-relay-links/radio-relay-links-table.constant';
import { RadioRelayLinksVmProps } from '@pages/coverage-areas/presentation/adapters/radio-relay-links/radio-relay-links-vm-props.interface';
import { RadioRelayLinksPresenter } from '@pages/coverage-areas/presentation/adapters/radio-relay-links/radio-relay-links-vm.presenter';
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
import { RadioRelayLinksFilterStore } from '@pages/coverage-areas/presentation/store/radio-relay-links/radio-relay-links-filter.store';
import {
    enumToFilterOptionsWithValue,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { RadioRelayLinksStatus } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-status.enum';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';
import { Title } from '@angular/platform-browser';

type TTableActions = 'details' | 'edit' | 'delete' | 'enable' | 'disable';

const PERMISSION_PATH = '/coverage-areas/radio-relay-links';

@Component({
    selector: 'app-radio-relay-links-list',
    standalone: true,
    imports: [
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    providers: [RadioRelayLinksFilterStore],
    templateUrl: './radio-relay-links-list.component.html',
    styleUrls: ['./radio-relay-links-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioRelayLinksListComponent implements OnInit {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    private readonly sweetAlert = inject(SweetAlertService);
    protected readonly facade = inject(RadioRelayLinksFacade);
    private readonly formStore = inject(RadioRelayLinksFilterStore);
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
                'COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.NO_PERMISSION_EXPORT'
            );
        }
        if (noData) {
            return this.t('COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.NO_EXPORT');
        }
        return this.t(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.EXPORT'
        ).replace('{nb}', String(this.itemsVM().length));
    });
    private readonly createTooltip = computed(() => {
        if (!this.canCreate()) {
            return this.t(
                'COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t('COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.CREATE');
    });
    private readonly editTooltip = computed(() => {
        if (!this.canEdit()) {
            return this.t(
                'COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.NO_PERMISSION_EDIT'
            );
        }
        return this.t('COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.NOT_EDIT');
    });
    private readonly deleteTooltip = computed(() => {
        if (!this.canDelete()) {
            return this.t(
                'COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.NO_PERMISSION_DELETE'
            );
        }
        return this.t('COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.NOT_DELETE');
    });
    private readonly enableTooltip = computed(() => {
        if (!this.canEnable()) {
            return this.t(
                'COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.NO_PERMISSION_ACTIVE'
            );
        }
        return this.t('COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.NOT_ACTIVE');
    });
    private readonly disableTooltip = computed(() => {
        if (!this.canDisable()) {
            return this.t(
                'COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.NO_PERMISSION_DISABLE'
            );
        }
        return this.t('COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.NOT_DISABLE');
    });
    private readonly chooseTooltip = computed(() => {
        if (!this.canChoose()) {
            return this.t(
                'COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.NO_PERMISSION_CHOOSE'
            );
        }
        return this.t('COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.NOT_CHOOSE');
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
            tooltip: this.t('COVERAGE_AREAS.RADIO_RELAY_LINKS.TOOLTIP.REFRESH'),
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

    protected readonly tableConfig = RADIO_RELAY_LINKS_TABLE;
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
        return enumToFilterOptionsWithValue(
            RadioRelayLinksStatus,
            this.t.bind(this)
        );
    });
    readonly operatorOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptionsWithValue(
            RadioRelayLinksOperator,
            this.t.bind(this)
        );
    });
    readonly frequencyOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptionsWithValue(
            RadioRelayLinksFrequency,
            this.t.bind(this)
        );
    });
    protected readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        const operatorOpts = this.operatorOptions();
        const frequencyOpts = this.frequencyOptions();
        return [
            {
                type: 'text',
                name: 'search',
                label: this.t('COVERAGE_AREAS.RADIO_RELAY_LINKS.FILTER.SEARCH'),
                placeholder: this.t(
                    'COVERAGE_AREAS.RADIO_RELAY_LINKS.FILTER.SEARCH_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'COVERAGE_AREAS.RADIO_RELAY_LINKS.FILTER.SEARCH',
                    placeholder:
                        'COVERAGE_AREAS.RADIO_RELAY_LINKS.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'operator',
                label: this.t(
                    'COVERAGE_AREAS.RADIO_RELAY_LINKS.FILTER.OPERATOR'
                ),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: operatorOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
            },
            {
                type: 'select',
                name: 'frequency',
                label: this.t(
                    'COVERAGE_AREAS.RADIO_RELAY_LINKS.FILTER.FREQUENCY'
                ),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: frequencyOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
            },
            {
                type: 'date',
                name: 'startDate',
                label: 'COVERAGE_AREAS.RADIO_RELAY_LINKS.FILTER.DATE.FROM',
                placeholder:
                    'COVERAGE_AREAS.RADIO_RELAY_LINKS.FILTER.DATE.PLACEHOLDER',
            },
            {
                type: 'date',
                name: 'endDate',
                label: 'COVERAGE_AREAS.RADIO_RELAY_LINKS.FILTER.DATE.TO',
                placeholder:
                    'COVERAGE_AREAS.RADIO_RELAY_LINKS.FILTER.DATE.PLACEHOLDER',
            },
        ];
    });
    private readonly presenter = new RadioRelayLinksPresenter(
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
        this.facade.readAll(this.currentFilter() as any);
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => this.currentLang.set(event.lang));
    }
    private pageTitle(): void {
        this.currentLang();
        this.title.setTitle(this.t('COVERAGE_AREAS.RADIO_RELAY_LINKS.TITLE'));
    }
    ngOnInit(): void {
        this.pageTitle();
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
        (item: RadioRelayLinksVmProps) => void
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
        item?: RadioRelayLinksVmProps;
        ref: 'create' | 'edit' | 'details';
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate(['../', RADIO_RELAY_LINKS_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }
    protected onActionClicked(event: {
        item: RadioRelayLinksVmProps;
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
    protected async onDelete(item: RadioRelayLinksVmProps): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey:
                'COVERAGE_AREAS.RADIO_RELAY_LINKS.SWEET_ALERT.TITLE.DELETE',
            messageKey:
                'COVERAGE_AREAS.RADIO_RELAY_LINKS.SWEET_ALERT.MESSAGE.DELETE',
            messageParams: {
                uniqId: item.actionsRef,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.delete({ uniqId });
    }
    protected async onEnableClicked(
        item: RadioRelayLinksVmProps
    ): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey:
                'COVERAGE_AREAS.RADIO_RELAY_LINKS.SWEET_ALERT.TITLE.ENABLE',
            messageKey:
                'COVERAGE_AREAS.RADIO_RELAY_LINKS.SWEET_ALERT.MESSAGE.ENABLE',
            messageParams: {
                uniqId: item.actionsRef,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.enable({ uniqId });
    }
    protected async onDisableClicked(
        item: RadioRelayLinksVmProps
    ): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey:
                'COVERAGE_AREAS.RADIO_RELAY_LINKS.SWEET_ALERT.TITLE.DISABLE',
            messageKey:
                'COVERAGE_AREAS.RADIO_RELAY_LINKS.SWEET_ALERT.MESSAGE.DISABLE',
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

        const fileName = `${this.exportFilePrefix}-radio-relay-links`;

        const exportColumns: ExportColumn[] = RADIO_RELAY_LINKS_TABLE.cols
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
                    'COVERAGE_AREAS.RADIO_RELAY_LINKS.TITLE'
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

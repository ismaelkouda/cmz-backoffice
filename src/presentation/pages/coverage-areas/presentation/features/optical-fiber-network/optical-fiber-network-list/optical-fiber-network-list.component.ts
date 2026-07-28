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
import { OpticalFiberNetworkFacade } from '@pages/coverage-areas/application/services/optical-fiber-network/optical-fiber-network.facade';
import { OPTICAL_FIBER_NETWORK_FORM } from '@pages/coverage-areas/presentation/features/optical-fiber-network/optical-fiber-network-paths.constants';
import { OpticalFiberNetworkFilterDto } from '@pages/coverage-areas/application/dto/optical-fiber-network/optical-fiber-network-filter.dto';
import { OPTICAL_FIBER_NETWORK_TABLE } from '@pages/coverage-areas/presentation/adapters/optical-fiber-network/optical-fiber-network-table.constant';
import { OpticalFiberNetworkVmProps } from '@pages/coverage-areas/presentation/adapters/optical-fiber-network/optical-fiber-network-vm-props.interface';
import { OpticalFiberNetworkPresenter } from '@pages/coverage-areas/presentation/adapters/optical-fiber-network/optical-fiber-network-vm.presenter';
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
import { OpticalFiberNetworkFilterStore } from '@pages/coverage-areas/presentation/store/optical-fiber-network/optical-fiber-network-filter.store';
import {
    enumToFilterOptionsWithValue,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { Operator } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-operator.enum';

type TTableActions = 'details' | 'edit' | 'delete' | 'enable' | 'disable';

const PERMISSION_PATH = '/coverage-areas/optical-fiber-networks';
const I18N = 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK';

@Component({
    selector: 'app-optical-fiber-network-list',
    standalone: true,
    imports: [
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    providers: [OpticalFiberNetworkFilterStore],
    templateUrl: './optical-fiber-network-list.component.html',
    styleUrls: ['./optical-fiber-network-list.component.scss'],
})
export class OpticalFiberNetworkListComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    private readonly sweetAlert = inject(SweetAlertService);
    protected readonly facade = inject(OpticalFiberNetworkFacade);
    private readonly formStore = inject(OpticalFiberNetworkFilterStore);
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
        if (!this.canExport()) {
            return this.t(`${I18N}.TOOLTIP.NO_PERMISSION_EXPORT`);
        }
        if (this.itemsVM().length < 1) {
            return this.t(`${I18N}.TOOLTIP.NO_EXPORT`);
        }
        return this.t(`${I18N}.TOOLTIP.EXPORT`).replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    private readonly createTooltip = computed(() =>
        !this.canCreate()
            ? this.t(`${I18N}.TOOLTIP.NO_PERMISSION_CREATE`)
            : this.t(`${I18N}.TOOLTIP.CREATE`)
    );
    private readonly editTooltip = computed(() =>
        !this.canEdit()
            ? this.t(`${I18N}.TOOLTIP.NO_PERMISSION_EDIT`)
            : this.t(`${I18N}.TOOLTIP.NOT_EDIT`)
    );
    private readonly deleteTooltip = computed(() =>
        !this.canDelete()
            ? this.t(`${I18N}.TOOLTIP.NO_PERMISSION_DELETE`)
            : this.t(`${I18N}.TOOLTIP.NOT_DELETE`)
    );
    private readonly enableTooltip = computed(() =>
        !this.canEnable()
            ? this.t(`${I18N}.TOOLTIP.NO_PERMISSION_ACTIVE`)
            : this.t(`${I18N}.TOOLTIP.NOT_ACTIVE`)
    );
    private readonly disableTooltip = computed(() =>
        !this.canDisable()
            ? this.t(`${I18N}.TOOLTIP.NO_PERMISSION_DISABLE`)
            : this.t(`${I18N}.TOOLTIP.NOT_DISABLE`)
    );
    private readonly chooseTooltip = computed(() =>
        !this.canChoose()
            ? this.t(`${I18N}.TOOLTIP.NO_PERMISSION_CHOOSE`)
            : this.t(`${I18N}.TOOLTIP.NOT_CHOOSE`)
    );

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
            tooltip: this.t(`${I18N}.TOOLTIP.REFRESH`),
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

    protected readonly tableConfig = OPTICAL_FIBER_NETWORK_TABLE;
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

    readonly operatorOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptionsWithValue(Operator, this.t.bind(this));
    });

    protected readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        return [
            {
                type: 'text',
                name: 'search',
                label: this.t(`${I18N}.FILTER.SEARCH`),
                placeholder: this.t(`${I18N}.FILTER.SEARCH_PLACEHOLDER`),
                icon: 'pi pi-search',
                translationKeys: {
                    label: `${I18N}.FILTER.SEARCH`,
                    placeholder: `${I18N}.FILTER.SEARCH_PLACEHOLDER`,
                },
            },
            {
                type: 'select',
                name: 'operator',
                label: this.t(`${I18N}.FILTER.OPERATOR`),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: this.operatorOptions(),
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
            },
            {
                type: 'date',
                name: 'startDate',
                label: `${I18N}.FILTER.DATE.FROM`,
                placeholder: `${I18N}.FILTER.DATE.PLACEHOLDER`,
            },
            {
                type: 'date',
                name: 'endDate',
                label: `${I18N}.FILTER.DATE.TO`,
                placeholder: `${I18N}.FILTER.DATE.PLACEHOLDER`,
            },
        ];
    });

    private readonly presenter = new OpticalFiberNetworkPresenter(
        this.translate.instant.bind(this.translate)
    );

    protected readonly itemsVM = computed(() => {
        const authorization = {
            canEdit: this.canEdit(),
            canDelete: this.canDelete(),
            canEnable: this.canEnable(),
            canDisable: this.canDisable(),
            canChoose: this.canChoose(),
        };
        const tooltip = {
            edit: this.editTooltip(),
            delete: this.deleteTooltip(),
            enable: this.enableTooltip(),
            disable: this.disableTooltip(),
            choose: this.chooseTooltip(),
        };
        return this.items().map((item) =>
            this.presenter.map(item, { authorization, tooltip })
        );
    });

    constructor() {
        this.facade.readAll(
            this.currentFilter() as OpticalFiberNetworkFilterDto
        );
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
        this.title.setTitle(this.t(`${I18N}.TITLE`));
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
                this.onNavigateToForm({ item: undefined, ref: 'create' });
            },
            refresh: () => this.facade.refresh(),
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
        (item: OpticalFiberNetworkVmProps) => void
    > = {
        edit: (item) => {
            if (!this.canEdit()) {
                this.toast.error(this.editTooltip());
                return;
            }
            this.onNavigateToForm({ item, ref: 'edit' });
        },
        details: (item) => this.onNavigateToForm({ item, ref: 'details' }),
        delete: (item) => {
            if (!this.canDelete()) {
                this.toast.error(this.deleteTooltip());
                return;
            }
            void this.onDelete(item);
        },
        enable: (item) => {
            if (!this.canEnable()) {
                this.toast.error(this.enableTooltip());
                return;
            }
            void this.onEnableClicked(item);
        },
        disable: (item) => {
            if (!this.canDisable()) {
                this.toast.error(this.disableTooltip());
                return;
            }
            void this.onDisableClicked(item);
        },
    };

    private onNavigateToForm(event: {
        item?: OpticalFiberNetworkVmProps;
        ref: 'create' | 'edit' | 'details';
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate(['../', OPTICAL_FIBER_NETWORK_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    protected onActionClicked(event: {
        item: OpticalFiberNetworkVmProps;
        actionId?: TTableActions;
    }): void {
        const { item, actionId } = event;
        if (!actionId) {
            return;
        }
        this.tableActions[actionId]?.(item);
    }

    protected async onDelete(item: OpticalFiberNetworkVmProps): Promise<void> {
        if (!item.uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey: `${I18N}.SWEET_ALERT.TITLE.DELETE`,
            messageKey: `${I18N}.SWEET_ALERT.MESSAGE.DELETE`,
            messageParams: { uniqId: item.actionsRef },
        });
        if (!confirmed) {
            return;
        }
        this.facade.delete({ uniqId: item.uniqId });
    }

    protected async onEnableClicked(
        item: OpticalFiberNetworkVmProps
    ): Promise<void> {
        if (!item.uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey: `${I18N}.SWEET_ALERT.TITLE.ENABLE`,
            messageKey: `${I18N}.SWEET_ALERT.MESSAGE.ENABLE`,
            messageParams: { uniqId: item.actionsRef },
        });
        if (!confirmed) {
            return;
        }
        this.facade.enable({ uniqId: item.uniqId });
    }

    protected async onDisableClicked(
        item: OpticalFiberNetworkVmProps
    ): Promise<void> {
        if (!item.uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey: `${I18N}.SWEET_ALERT.TITLE.DISABLE`,
            messageKey: `${I18N}.SWEET_ALERT.MESSAGE.DISABLE`,
            messageParams: { uniqId: item.actionsRef },
        });
        if (!confirmed) {
            return;
        }
        this.facade.disable({ uniqId: item.uniqId });
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

        const fileName = `${this.exportFilePrefix}-optical-fiber-networks`;
        const exportColumns: ExportColumn[] = OPTICAL_FIBER_NETWORK_TABLE.cols
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
                    width,
                    transform: (value: any, row: any) => {
                        if (col.field === '__index') {
                            return (items.indexOf(row) + 1).toString();
                        }
                        if (col.field === 'updatedAt' && value) {
                            return formatDate(value);
                        }
                        return value ?? '';
                    },
                };
            });

        this.excelExport
            .exportToExcel({
                fileName,
                columns: exportColumns,
                data: items,
                sheetName: this.translate.instant(`${I18N}.TITLE`),
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

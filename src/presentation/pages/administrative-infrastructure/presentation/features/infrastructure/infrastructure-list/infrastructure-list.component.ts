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
import { InfrastructureFacade } from '@presentation/pages/administrative-infrastructure/application/services/infrastructure/infrastructure.facade';
import { INFRASTRUCTURE_FORM } from '@presentation/pages/administrative-infrastructure/presentation/features/infrastructure/infrastructure-paths.constants';
import { InfrastructureFilterDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure/infrastructure-filter.dto';
import { INFRASTRUCTURE_TABLE } from '@presentation/pages/administrative-infrastructure/presentation/adapters/infrastructure/infrastructure-table.constant';
import { InfrastructureVmProps } from '@presentation/pages/administrative-infrastructure/presentation/adapters/infrastructure/infrastructure-vm-props.interface';
import { InfrastructurePresenter } from '@presentation/pages/administrative-infrastructure/presentation/adapters/infrastructure/infrastructure-vm.presenter';
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
import { InfrastructureFilterStore } from '@presentation/pages/administrative-infrastructure/presentation/store/infrastructure/infrastructure-filter.store';
import { INFRASTRUCTURE_FILTER_KEYS } from '@presentation/pages/administrative-infrastructure/presentation/constants/infrastructure/infrastructure-filter-keys.constant';
import { FilterField } from '@shared/components/filter/filter.types';
import { RegionsSelectFacade } from '@presentation/pages/administrative-boundary/application/services/regions/regions-select.facade';
import { InfrastructureTypeSelectFacade } from '@presentation/pages/administrative-infrastructure/application/services/infrastructure-type/infrastructure-type-select.facade';
type TTableActions = 'details' | 'edit' | 'delete';

@Component({
    selector: 'app-infrastructure-list',
    standalone: true,
    imports: [
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    providers: [InfrastructureFilterStore],
    templateUrl: './infrastructure-list.component.html',
    styleUrls: ['./infrastructure-list.component.scss'],
})
export class InfrastructureListComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    private readonly sweetAlert = inject(SweetAlertService);
    protected readonly facade = inject(InfrastructureFacade);
    private readonly infrastructureTypeFacade = inject(
        InfrastructureTypeSelectFacade
    );
    private readonly regionsFacade = inject(RegionsSelectFacade);
    private readonly formStore = inject(InfrastructureFilterStore);
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
        '/equipments/list',
        'export'
    );
    private readonly canCreate = this.permissionActions.can(
        '/equipments/list',
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        '/equipments/list',
        'edit'
    );
    private readonly canDelete = this.permissionActions.can(
        '/equipments/list',
        'delete'
    );
    private readonly canEnable = this.permissionActions.can(
        '/equipments/list',
        'edit'
    );
    private readonly canDisable = this.permissionActions.can(
        '/equipments/list',
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
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.NO_PERMISSION_EXPORT'
            );
        }
        if (noData) {
            return this.t(
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.NO_EXPORT'
            );
        }
        return this.t(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.EXPORT'
        ).replace('{nb}', String(this.itemsVM().length));
    });
    private readonly createTooltip = computed(() => {
        if (!this.canCreate()) {
            return this.t(
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.CREATE'
        );
    });
    private readonly editTooltip = computed(() => {
        if (!this.canEdit()) {
            return this.t(
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.NO_PERMISSION_EDIT'
            );
        }
        return this.t(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.NOT_EDIT'
        );
    });
    private readonly deleteTooltip = computed(() => {
        if (!this.canDelete()) {
            return this.t(
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.NO_PERMISSION_DELETE'
            );
        }
        return this.t(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.NOT_DELETE'
        );
    });
    private readonly chooseTooltip = computed(() => {
        if (!this.canChoose()) {
            return this.t(
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.NO_PERMISSION_CHOOSE'
            );
        }
        return this.t(
            'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.NOT_CHOOSE'
        );
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
            tooltip: this.t(
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.REFRESH'
            ),
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

    protected readonly tableConfig = INFRASTRUCTURE_TABLE;
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
    private readonly regions = toSignal(this.regionsFacade.items$, {
        initialValue: [],
    });
    private readonly infrastructureType = toSignal(
        this.infrastructureTypeFacade.items$,
        {
            initialValue: [],
        }
    );
    protected readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        return [
            {
                type: 'text',
                name: INFRASTRUCTURE_FILTER_KEYS.SEARCH,
                label: this.t(
                    'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FILTER.SEARCH'
                ),
                placeholder: this.t(
                    'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FILTER.SEARCH_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FILTER.SEARCH',
                    placeholder:
                        'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: INFRASTRUCTURE_FILTER_KEYS.TYPE,
                label: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FILTER.TYPE',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                options: this.infrastructureType(),
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                filter: true,
            },
            {
                type: 'select',
                name: INFRASTRUCTURE_FILTER_KEYS.REGION,
                label: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FILTER.REGION',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                options: this.regions(),
                optionLabel: 'name',
                optionValue: 'value',
                showClear: true,
                filter: true,
            },
            {
                type: 'select',
                name: INFRASTRUCTURE_FILTER_KEYS.DEPARTMENT,
                label: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FILTER.DEPARTMENT',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                options: this.formStore.vm().departments,
                disabled: this.formStore.vm().isDepartmentDisabled,
                optionLabel: 'name',
                optionValue: 'value',
                showClear: true,
                filter: true,
            },
            {
                type: 'select',
                name: INFRASTRUCTURE_FILTER_KEYS.MUNICIPALITY,
                label: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FILTER.MUNICIPALITY',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                options: this.formStore.vm().municipalities,
                disabled: this.formStore.vm().isMunicipalityDisabled,
                optionLabel: 'name',
                optionValue: 'value',
                showClear: true,
                filter: true,
            },
            {
                type: 'date',
                name: INFRASTRUCTURE_FILTER_KEYS.START_DATE,
                label: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FILTER.DATE.FROM',
                placeholder:
                    'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FILTER.DATE.PLACEHOLDER',
            },
            {
                type: 'date',
                name: INFRASTRUCTURE_FILTER_KEYS.END_DATE,
                label: 'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FILTER.DATE.TO',
                placeholder:
                    'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.FILTER.DATE.PLACEHOLDER',
            },
        ];
    });
    private readonly presenter = new InfrastructurePresenter(
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
        const chooseTooltip = this.chooseTooltip();
        const tooltip = {
            edit: editTooltip,
            delete: deleteTooltip,
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
        this.facade.readAll(this.currentFilter() as InfrastructureFilterDto);
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });
        this.regionsFacade.readAll({ forceRefresh: true });
        this.infrastructureTypeFacade.readAll({ forceRefresh: true });
        effect(() => {
            this.pageTitle();
        });
    }
    private pageTitle(): void {
        this.currentLang();
        this.title.setTitle(
            this.t('ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TITLE')
        );
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
        (item: InfrastructureVmProps) => void
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
    };
    private onNavigateToForm(event: {
        item?: InfrastructureVmProps;
        ref: 'create' | 'edit' | 'details';
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate(['../', INFRASTRUCTURE_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }
    protected onActionClicked(event: {
        item: InfrastructureVmProps;
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
    protected async onDelete(item: InfrastructureVmProps): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey:
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.SWEET_ALERT.TITLE.DELETE',
            messageKey:
                'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.SWEET_ALERT.MESSAGE.DELETE',
            messageParams: {
                uniqId: item.actionsRef,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.delete({ uniqId });
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

        const fileName = `${this.exportFilePrefix}-infrastructure`;

        const exportColumns: ExportColumn[] = INFRASTRUCTURE_TABLE.cols
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
                    'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TITLE'
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

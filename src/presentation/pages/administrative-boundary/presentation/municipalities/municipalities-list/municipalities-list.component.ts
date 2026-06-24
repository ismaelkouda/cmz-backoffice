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
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { MunicipalitiesFacade } from '@pages/administrative-boundary/application/services/municipalities/municipalities.facade';
import { RegionsSelectFacade } from '@pages/administrative-boundary/application/services/regions/regions-select.facade';
import { FILTER_KEYS } from '@pages/administrative-boundary/domain/constants/municipalities/municipalities-filter-keys.constants';
import { MUNICIPALITIES_TABLE } from '@pages/administrative-boundary/domain/constants/municipalities/municipalities-table.constants';
import { MunicipalitiesFilterDto } from '@presentation/pages/administrative-boundary/application/dto/municipalities/municipalities-filter.dto';
import { MunicipalitiesFilterStore } from '@presentation/pages/administrative-boundary/application/store/municipalities/municipalities-filter.store';
import { MunicipalitiesVmProps } from '@presentation/pages/administrative-boundary/presentation/adapters/municipalities/municipalities-vm-props.interface';
import { MunicipalitiesPresenter } from '@presentation/pages/administrative-boundary/presentation/adapters/municipalities/municipalities-vm.presenter';
import { MUNICIPALITIES_FORM_ROUTE } from '@presentation/pages/administrative-boundary/presentation/municipalities/municipalities-paths.constants';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { ToastrService } from 'ngx-toastr';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { formatDate } from '@shared/domain/functions/format-data.function';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
type TTableActions = 'edit' | 'delete';

@Component({
    selector: 'app-municipalities-list',
    standalone: true,
    imports: [
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    providers: [MunicipalitiesFilterStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './municipalities-list.component.html',
    styleUrls: ['./municipalities-list.component.scss'],
})
export class MunicipalitiesListComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly title = inject(Title);
    private readonly sweetAlert = inject(SweetAlertService);

    protected readonly facade = inject(MunicipalitiesFacade);
    private readonly regionsFacade = inject(RegionsSelectFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly formStore = inject(MunicipalitiesFilterStore);
    private readonly excelExport = inject(ExcelExportService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.customization.app.name
    );
    private readonly canExport = this.permissionActions.can(
        '/territorial-structure/municipalities',
        'export'
    );
    private readonly canCreate = this.permissionActions.can(
        '/territorial-structure/municipalities',
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        '/territorial-structure/municipalities',
        'edit'
    );
    private readonly canDelete = this.permissionActions.can(
        '/territorial-structure/municipalities',
        'delete'
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
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.NO_PERMISSION_EXPORT'
            );
        }
        if (noData) {
            return this.t(
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.NO_EXPORT'
            );
        }
        return this.t(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.EXPORT'
        ).replace('{nb}', String(this.itemsVM().length));
    });
    private readonly createTooltip = computed(() => {
        if (!this.canCreate()) {
            return this.t(
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t('ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.CREATE');
    });
    private readonly editTooltip = computed(() => {
        if (!this.canEdit()) {
            return this.t(
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.NO_PERMISSION_EDIT'
            );
        }
        return this.t(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.NOT_EDIT'
        );
    });
    private readonly deleteTooltip = computed(() => {
        if (!this.canDelete()) {
            return this.t(
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.NO_PERMISSION_DELETE'
            );
        }
        return this.t(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.NOT_DELETE'
        );
    });
    private readonly chooseTooltip = computed(() => {
        if (!this.canChoose()) {
            return this.t(
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.NO_PERMISSION_CHOOSE'
            );
        }
        return this.t(
            'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.NOT_CHOOSE'
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
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.REFRESH'
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

    protected readonly tableConfig = MUNICIPALITIES_TABLE;
    protected readonly form = this.formStore.form;
    private readonly regions = toSignal(this.regionsFacade.items$, {
        initialValue: [],
    });
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
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );

    protected readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        return [
            {
                type: 'text',
                name: FILTER_KEYS.SEARCH,
                label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.SEARCH',
                placeholder:
                    'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.SEARCH_PLACEHOLDER',
            },
            {
                type: 'select',
                name: FILTER_KEYS.REGION,
                label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.REGION',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                options: this.regions(),
                optionLabel: 'name',
                optionValue: 'value',
                showClear: true,
                filter: true,
            },
            {
                type: 'select',
                name: FILTER_KEYS.DEPARTMENT,
                label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.DEPARTMENT',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                options: this.formStore.vm().departments,
                disabled: this.formStore.vm().isDepartmentDisabled,
                optionLabel: 'name',
                optionValue: 'value',
                showClear: true,
                filter: true,
            },
            {
                type: 'date',
                name: FILTER_KEYS.START_DATE,
                label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.DATE.FROM',
                placeholder:
                    'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.DATE.PLACEHOLDER',
            },
            {
                type: 'date',
                name: FILTER_KEYS.END_DATE,
                label: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.DATE.TO',
                placeholder:
                    'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.FILTER.DATE.PLACEHOLDER',
            },
        ];
    });
    private readonly presenter = new MunicipalitiesPresenter(
        this.translate.instant.bind(this.translate)
    );
    protected readonly itemsVM = computed(() => {
        const canEdit = this.canEdit();
        const canDelete = this.canDelete();
        const canChoose = this.canChoose();
        const authorization = {
            canEdit: canEdit,
            canDelete: canDelete,
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
        this.facade.readAll(this.currentFilter() as MunicipalitiesFilterDto);
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });
        this.regionsFacade.readAll({ forceRefresh: true });
        effect(() => {
            this.pageTitle();
            this.filterFields();
        });
    }
    private pageTitle(): void {
        this.currentLang();
        this.title.setTitle(
            this.t('ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TITLE')
        );
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
        (item: MunicipalitiesVmProps) => void
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
    };

    private onNavigateToForm(event: {
        item?: MunicipalitiesVmProps;
        ref: 'create' | 'edit';
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate(['../', MUNICIPALITIES_FORM_ROUTE], {
            relativeTo: this.route,
            queryParams,
        });
    }
    protected onFilterClicked(): void {
        this.facade.readAll(this.formStore.value, '1', { forceRefresh: true });
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
        item: MunicipalitiesVmProps;
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

    protected async onDelete(item: MunicipalitiesVmProps): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey:
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.TITLE.DELETE',
            messageKey:
                'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.SWEET_ALERT.MESSAGE.DELETE',
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

        const fileName = `${this.exportFilePrefix}-municipalities`;

        const exportColumns: ExportColumn[] = MUNICIPALITIES_TABLE.cols
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
                    'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TITLE'
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

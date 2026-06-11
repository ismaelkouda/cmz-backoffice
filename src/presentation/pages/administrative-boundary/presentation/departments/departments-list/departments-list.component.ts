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
import { DepartmentsFacade } from '@pages/administrative-boundary/application/services/departments/departments.facade';
import { RegionsSelectFacade } from '@pages/administrative-boundary/application/services/regions/regions-select.facade';
import { FILTER_KEYS } from '@pages/administrative-boundary/domain/constants/departments/departments-filter-keys.constants';
import { DEPARTMENTS_TABLE } from '@pages/administrative-boundary/domain/constants/departments/departments-table.constants';
import { DepartmentsFilterDto } from '@presentation/pages/administrative-boundary/application/dto/departments/departments-filter.dto';
import { DepartmentsFilterStore } from '@presentation/pages/administrative-boundary/application/store/departments/departments-filter.store';
import { DepartmentsVmProps } from '@presentation/pages/administrative-boundary/presentation/adapters/departments/departments-vm-props.interface';
import { DepartmentsPresenter } from '@presentation/pages/administrative-boundary/presentation/adapters/departments/departments-vm.presenter';
import {
    DEPARTMENTS_FORM_ROUTE,
    DEPARTMENTS_MUNICIPALITIES_ROUTE,
} from '@presentation/pages/administrative-boundary/presentation/departments/departments-paths.constants';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { ToastrService } from 'ngx-toastr';

type TTableActions = 'edit' | 'delete';

@Component({
    selector: 'app-departments-list',
    standalone: true,
    imports: [
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    providers: [DepartmentsFilterStore],
    templateUrl: './departments-list.component.html',
    styleUrls: ['./departments-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentsListComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly title = inject(Title);
    private readonly sweetAlert = inject(SweetAlertService);

    protected readonly facade = inject(DepartmentsFacade);
    private readonly regionsFacade = inject(RegionsSelectFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly formStore = inject(DepartmentsFilterStore);
    // private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly canExport = this.permissionActions.can(
        '/territorial-structure/departments',
        'export'
    );
    private readonly canCreate = this.permissionActions.can(
        '/territorial-structure/departments',
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        '/territorial-structure/departments',
        'edit'
    );
    private readonly canDelete = this.permissionActions.can(
        '/territorial-structure/departments',
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
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.NO_PERMISSION_EXPORT'
            );
        }
        if (noData) {
            return this.t(
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.NO_EXPORT'
            );
        }
        return this.t(
            'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.EXPORT'
        ).replace('{nb}', String(this.itemsVM().length));
    });
    private readonly createTooltip = computed(() => {
        if (!this.canCreate()) {
            return this.t(
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.CREATE');
    });
    private readonly editTooltip = computed(() => {
        if (!this.canEdit()) {
            return this.t(
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.NO_PERMISSION_EDIT'
            );
        }
        return this.t('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.NOT_EDIT');
    });
    private readonly deleteTooltip = computed(() => {
        if (!this.canDelete()) {
            return this.t(
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.NO_PERMISSION_DELETE'
            );
        }
        return this.t('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.NOT_DELETE');
    });
    private readonly chooseTooltip = computed(() => {
        if (!this.canChoose()) {
            return this.t(
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.NO_PERMISSION_CHOOSE'
            );
        }
        return this.t('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.NOT_CHOOSE');
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
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.REFRESH'
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
    protected readonly tableConfig = DEPARTMENTS_TABLE;
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
                label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.SEARCH',
                placeholder:
                    'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.SEARCH_PLACEHOLDER',
            },
            {
                type: 'select',
                name: FILTER_KEYS.REGION,
                label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.REGION',
                placeholder: 'COMMON.SELECT_PLACEHOLDER',
                options: this.regions(),
                optionLabel: 'name',
                optionValue: 'value',
                showClear: true,
                filter: true,
            },
            {
                type: 'date',
                name: FILTER_KEYS.START_DATE,
                label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.DATE.FROM',
                placeholder:
                    'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.DATE.PLACEHOLDER',
            },
            {
                type: 'date',
                name: FILTER_KEYS.END_DATE,
                label: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.DATE.TO',
                placeholder:
                    'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.FILTER.DATE.PLACEHOLDER',
            },
        ];
    });
    private readonly presenter = new DepartmentsPresenter(
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
        this.facade.readAll(this.currentFilter() as DepartmentsFilterDto);
        this.regionsFacade.readAll();
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });
        effect(() => {
            this.pageTitle();
            this.filterFields();
        });
    }
    private pageTitle(): void {
        this.currentLang();
        this.title.setTitle(
            this.t('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TITLE')
        );
    }
    private onRefreshData(): void {
        this.formStore.reset();
        this.facade.refresh();
    }
    private exportData(): void {
        if (!this.canExport()) {
            this.toast.error(this.exportTooltip());
            return;
        }
        const items = this.items();
        if (!items.length) {
            this.toast.error(this.t('EXPORT.NO_DATA'));
            return;
        }

        // this.exportService.exportAsExcelFile(
        //     items,
        //     this.tableConfig,
        //     `${this.normalizeExportPrefix}-departments`
        // );
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
        (item: DepartmentsVmProps) => void
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
        item?: DepartmentsVmProps;
        ref: 'create' | 'edit';
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate(['../', DEPARTMENTS_FORM_ROUTE], {
            relativeTo: this.route,
            queryParams,
        });
    }
    protected onFilterClicked(filterValues: any): void {
        this.facade.readAll(filterValues, '1');
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
        item: DepartmentsVmProps;
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

    protected async onDelete(item: DepartmentsVmProps): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey:
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.TITLE.DELETE',
            messageKey:
                'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.SWEET_ALERT.MESSAGE.DELETE',
            messageParams: {
                uniqId: item.actionsRef,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.delete({ uniqId });
    }
    private t(key: string): string {
        return this.translate.instant(key);
    }
    private get normalizeExportPrefix(): string {
        const appName = this.appConfig.customization.app.name;
        return (
            appName
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }
    public onBadgeClicked(event: {
        item: DepartmentsVmProps;
        col: HTMLTableCellElement;
    }): void {
        this.router.navigate(['../', DEPARTMENTS_MUNICIPALITIES_ROUTE], {
            relativeTo: this.route,
            queryParams: { uniqId: event.item.uniqId, name: event.item.name },
        });
    }
}

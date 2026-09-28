import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    Signal,
    computed,
    effect,
    inject,
    signal,
    ViewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { SlaFilterDto } from '@pages/sla/application/dto/sla/sla-filter.dto';
import { SlaFacade } from '@pages/sla/application/services/sla/sla.facade';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { SlaVmProps } from '@pages/sla/presentation/adapters/sla/sla-vm-props.interface';
import { SlaPresenter } from '@pages/sla/presentation/adapters/sla/sla-vm.presenter';
import { SlaFilterStore } from '@pages/sla/presentation/store/sla/sla-filter.store';
import { SLA_LIST_TABLE } from '@presentation/pages/sla/presentation/adapters/sla/sla-table.constant';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { SlaFormComponent } from '../sla-form/sla-form.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { ToastrService } from 'ngx-toastr';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { formatDate } from '@shared/domain/functions/format-data.function';

@Component({
    selector: 'app-sla-list',
    standalone: true,
    templateUrl: './sla-list.component.html',
    styleUrls: ['./sla-list.component.scss'],
    imports: [
        FilterComponent,
        TableComponent,
        TranslateModule,
        SlaFormComponent,
    ],
    providers: [SlaFilterStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaListComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    protected readonly facade = inject(SlaFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly sweetAlert = inject(SweetAlertService);
    private readonly formStore = inject(SlaFilterStore);
    private readonly excelExport = inject(ExcelExportService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.customization.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    private readonly canExport = this.permissionActions.can(
        '/sla/baseline',
        'export'
    );
    private readonly canCreate = this.permissionActions.can(
        '/sla/baseline',
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        '/sla/baseline',
        'edit'
    );
    private readonly canDelete = this.permissionActions.can(
        '/sla/baseline',
        'delete'
    );
    private readonly canEnable = this.permissionActions.can(
        '/sla/baseline',
        'enable'
    );
    private readonly canDisable = this.permissionActions.can(
        '/sla/baseline',
        'disable'
    );
    protected readonly tableConfig = SLA_LIST_TABLE;
    protected readonly form = this.formStore.form;
    private readonly items = toSignal(this.facade.items$, {
        initialValue: [],
    });
    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });
    protected readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    protected readonly filterFields: Signal<FilterField[]> = computed(() => [
        {
            name: 'search',
            label: this.t('SLA.SLA_LIST.FILTER.SEARCH'),
            type: 'text',
            placeholder: this.t('SLA.SLA_LIST.FILTER.SEARCH_PLACEHOLDER'),
        } as FilterField,
    ]);

    // Form modal state
    protected readonly formVisible = signal(false);
    protected readonly formMode = signal<'create' | 'edit' | 'view'>('create');
    protected readonly selectedItem = signal<SlaVmProps | null>(null);

    @ViewChild(SlaFormComponent) slaForm!: SlaFormComponent;

    protected readonly itemsVM = computed(() => {
        return this.items().map((item) => this.presenter.map(item));
    });

    private readonly presenter = new SlaPresenter(
        this.translate.instant.bind(this.translate)
    );

    protected readonly headerButtons = computed<TableHeaderButton[]>(() => [
        // {
        //     label: 'COMMON.CREATE',
        //     actionId: 'create',
        //     icon: 'pi pi-plus',
        //     class: 'btn-primary',
        //     disabled: !this.canCreate(),
        //     tooltip: this.createTooltip(),
        // },
        {
            label: 'COMMON.REFRESH',
            actionId: 'refresh',
            class: 'btn-dark',
            icon: 'pi pi-refresh',
            translateKey: 'COMMON.REFRESH',
            tooltip: this.t('SLA.SLA_LIST.TOOLTIP.REFRESH'),
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

    private readonly createTooltip = computed(() => {
        if (!this.canCreate()) {
            return this.t('SLA.SLA_LIST.TOOLTIP.NO_PERMISSION_CREATE');
        }
        return this.t('SLA.SLA_LIST.TOOLTIP.CREATE');
    });

    private readonly canExportData = computed(
        () => !this.canExport() || this.itemsVM().length < 1 || this.loading()
    );

    private readonly exportTooltip = computed(() => {
        const permission = !this.canExport();
        const noData = this.itemsVM().length < 1;
        if (permission) {
            return this.t('SLA.SLA_LIST.TOOLTIP.NO_PERMISSION_EXPORT');
        }
        if (noData) {
            return this.t('SLA.SLA_LIST.TOOLTIP.NO_EXPORT');
        }
        return this.t('SLA.SLA_LIST.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });

    constructor() {
        this.facade.read(this.currentFilter() as SlaFilterDto);
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
        this.title.setTitle(this.t('SLA.SLA_LIST.TITLE'));
    }

    public onFilterClicked(): void {
        this.facade.read(this.formStore.value, { forceRefresh: true });
    }

    protected onHeaderClicked(actionId: string): void {
        const actions: Record<string, () => void> = {
            create: () => this.openForm('create'),
            refresh: () => this.onRefreshData(),
            export: () => this.exportData(),
        };
        actions[actionId]?.();
    }

    private onRefreshData(): void {
        this.formStore.reset();
        this.facade.refresh();
    }

    protected onActionClicked(event: {
        item: SlaVmProps;
        actionId: string;
    }): void {
        const { item, actionId } = event;
        const actions: Record<string, () => void> = {
            edit: () => this.openForm('edit', item),
            view: () => this.openForm('view', item),
            enable: () => this.onEnable(item),
            disable: () => this.onDisable(item),
            delete: () => this.onDelete(item),
        };
        actions[actionId]?.();
    }

    private openForm(
        mode: 'create' | 'edit' | 'view',
        item?: SlaVmProps
    ): void {
        this.formMode.set(mode);
        this.selectedItem.set(item || null);
        this.formVisible.set(true);
    }

    private async onEnable(item: SlaVmProps): Promise<void> {
        if (!this.canEnable()) {
            this.toast.error(this.enableTooltip());
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey: 'SLA.SLA_LIST.SWEET_ALERT.TITLE.ENABLE',
            messageKey: 'SLA.SLA_LIST.SWEET_ALERT.MESSAGE.ENABLE',
            messageParams: { name: item.name },
        });
        if (!confirmed) {
            return;
        }
        this.facade.enable({ id: item.id });
    }

    private async onDisable(item: SlaVmProps): Promise<void> {
        if (!this.canDisable()) {
            this.toast.error(this.disableTooltip());
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey: 'SLA.SLA_LIST.SWEET_ALERT.TITLE.DISABLE',
            messageKey: 'SLA.SLA_LIST.SWEET_ALERT.MESSAGE.DISABLE',
            messageParams: { name: item.name },
        });
        if (!confirmed) {
            return;
        }
        this.facade.disable({ id: item.id });
    }

    private async onDelete(item: SlaVmProps): Promise<void> {
        if (!this.canDelete()) {
            this.toast.error(this.deleteTooltip());
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey: 'SLA.SLA_LIST.SWEET_ALERT.TITLE.DELETE',
            messageKey: 'SLA.SLA_LIST.SWEET_ALERT.MESSAGE.DELETE',
            messageParams: { name: item.name },
        });
        if (!confirmed) {
            return;
        }
        this.facade.delete({ id: item.id });
    }

    private readonly enableTooltip = computed(() => {
        if (!this.canEnable()) {
            return this.t('SLA.SLA_LIST.TOOLTIP.NO_PERMISSION_ENABLE');
        }
        return this.t('SLA.SLA_LIST.TOOLTIP.ENABLE');
    });

    private readonly disableTooltip = computed(() => {
        if (!this.canDisable()) {
            return this.t('SLA.SLA_LIST.TOOLTIP.NO_PERMISSION_DISABLE');
        }
        return this.t('SLA.SLA_LIST.TOOLTIP.DISABLE');
    });

    private readonly deleteTooltip = computed(() => {
        if (!this.canDelete()) {
            return this.t('SLA.SLA_LIST.TOOLTIP.NO_PERMISSION_DELETE');
        }
        return this.t('SLA.SLA_LIST.TOOLTIP.DELETE');
    });

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

        const fileName = `${this.exportFilePrefix}-sla-referentiel`;

        const exportColumns: ExportColumn[] = SLA_LIST_TABLE.cols
            .filter(
                (col) =>
                    col.field !== '__action' && col.field !== '__actionDropdown'
            )
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
                        const val = row[col.field];
                        if (col.field === '__index') {
                            return (items.indexOf(row) + 1).toString();
                        }
                        if (col.field === 'createdAt' && val) {
                            return formatDate(val);
                        }
                        if (col.field === 'updatedAt' && val) {
                            return formatDate(val);
                        }
                        return val ?? '';
                    },
                };
            });

        this.excelExport
            .exportToExcel({
                fileName: fileName,
                columns: exportColumns,
                data: items,
                sheetName: this.translate.instant('SLA.SLA_LIST.TITLE'),
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

    protected onFormClosed(): void {
        this.formVisible.set(false);
        this.selectedItem.set(null);
    }

    protected onFormSaved(value: { name: string; description: string }): void {
        if (this.formMode() === 'edit' && this.selectedItem()) {
            this.facade.update({ id: this.selectedItem()?.id ?? '', ...value });
        } else if (this.formMode() === 'create') {
            this.facade.create(value);
        }
        this.formVisible.set(false);
        this.selectedItem.set(null);
    }
}

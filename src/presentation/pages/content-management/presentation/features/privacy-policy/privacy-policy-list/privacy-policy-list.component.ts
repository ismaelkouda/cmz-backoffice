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
import { PrivacyPolicyFacade } from '@pages/content-management/application/services/privacy-policy/privacy-policy.facade';
import { Status } from '@pages/content-management/domain/enums/privacy-policy/privacy-policy-status.enum';
import { PrivacyPolicyFilterDto } from '@presentation/pages/content-management/application/dto/privacy-policy/privacy-policy-filter.dto';
import { PrivacyPolicyFilterStore } from '@presentation/pages/content-management/application/store/privacy-policy/privacy-policy-filter.store';
import { FILTER_KEYS } from '@presentation/pages/content-management/domain/constants/privacy-policy/privacy-policy-filter-keys.constants';
import { PRIVACY_POLICY_TABLE } from '@presentation/pages/content-management/domain/constants/privacy-policy/privacy-policy-table.constants';
import { PrivacyPolicyPresenter } from '@presentation/pages/content-management/presentation/adapters/privacy-policy/privacy-policy-vm.presenter';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptionsWithValue,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { ToastrService } from 'ngx-toastr';

import { PrivacyPolicyVmProps } from '../../../adapters/privacy-policy/privacy-policy-vm-props.interface';
import { PRIVACY_POLICY_FORM_ROUTE } from '../privacy-policy-paths.constants';
import { ExportColumn } from '@shared/domain/interfaces/export-config.interface';
import { ExcelExportService } from '@shared/domain/services/excel-export.service';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';
type TTableActions = 'edit' | 'delete' | 'publish' | 'unpublish';

@Component({
    selector: 'app-privacy-policy-list',
    standalone: true,
    templateUrl: './privacy-policy-list.component.html',
    styleUrls: ['./privacy-policy-list.component.scss'],
    imports: [
        FilterComponent,
        TableComponent,
        PaginationComponent,
        TranslateModule,
    ],
    providers: [PrivacyPolicyFilterStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyListComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly title = inject(Title);
    private readonly sweetAlert = inject(SweetAlertService);
    private readonly dateMapper = inject(ApiDateMapper);

    public readonly facade = inject(PrivacyPolicyFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly formStore = inject(PrivacyPolicyFilterStore);
    private readonly excelExport = inject(ExcelExportService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.customization.app.name
    );
    private readonly canExport = this.permissionActions.can(
        '/content-management/privacy-policy',
        'export'
    );
    private readonly canCreate = this.permissionActions.can(
        '/content-management/privacy-policy',
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        '/content-management/privacy-policy',
        'edit'
    );
    private readonly canDelete = this.permissionActions.can(
        '/content-management/privacy-policy',
        'delete'
    );
    private readonly canPublish = this.permissionActions.can(
        '/content-management/privacy-policy',
        'edit'
    );
    private readonly canUnpublish = this.permissionActions.can(
        '/content-management/privacy-policy',
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
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.NO_PERMISSION_EXPORT'
            );
        }
        if (noData) {
            return this.t(
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.NO_EXPORT'
            );
        }
        return this.t(
            'CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.EXPORT'
        ).replace('{nb}', String(this.itemsVM().length));
    });
    private readonly createTooltip = computed(() => {
        if (!this.canCreate()) {
            return this.t(
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t('CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.CREATE');
    });
    private readonly editTooltip = computed(() => {
        if (!this.canEdit()) {
            return this.t(
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.NO_PERMISSION_EDIT'
            );
        }
        return this.t('CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.NOT_EDIT');
    });
    private readonly deleteTooltip = computed(() => {
        if (!this.canDelete()) {
            return this.t(
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.NO_PERMISSION_DELETE'
            );
        }
        return this.t('CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.NOT_DELETE');
    });
    private readonly publishTooltip = computed(() => {
        if (!this.canPublish()) {
            return this.t(
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.NO_PERMISSION_PUBLISH'
            );
        }
        return this.t('CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.NOT_PUBLISH');
    });
    private readonly unpublishTooltip = computed(() => {
        if (!this.canUnpublish()) {
            return this.t(
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.NO_PERMISSION_UNPUBLISH'
            );
        }
        return this.t(
            'CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.NOT_UNPUBLISH'
        );
    });
    private readonly chooseTooltip = computed(() => {
        if (!this.canChoose()) {
            return this.t(
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.NO_PERMISSION_CHOOSE'
            );
        }
        return this.t('CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.NOT_CHOOSE');
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
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.TOOLTIP.REFRESH'
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

    public readonly tableConfig = PRIVACY_POLICY_TABLE;
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
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    protected readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        const statusOpts = this.statusOptions();

        return [
            {
                type: 'text',
                name: FILTER_KEYS.SEARCH,
                label: this.t(
                    'CONTENT_MANAGEMENT.PRIVACY_POLICY.FILTER.SEARCH'
                ),
                placeholder: this.t(
                    'CONTENT_MANAGEMENT.PRIVACY_POLICY.FILTER.SEARCH_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.FILTER.SEARCH',
                    placeholder:
                        'CONTENT_MANAGEMENT.PRIVACY_POLICY.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: FILTER_KEYS.STATUS,
                label: this.t(
                    'CONTENT_MANAGEMENT.PRIVACY_POLICY.FILTER.STATUS'
                ),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: statusOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.FILTER.STATUS',
                },
            },
            {
                type: 'date',
                name: FILTER_KEYS.START_DATE,
                label: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.FILTER.DATE.FROM',
                placeholder:
                    'CONTENT_MANAGEMENT.PRIVACY_POLICY.FILTER.DATE.PLACEHOLDER',
            },
            {
                type: 'date',
                name: FILTER_KEYS.END_DATE,
                label: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.FILTER.DATE.TO',
                placeholder:
                    'CONTENT_MANAGEMENT.PRIVACY_POLICY.FILTER.DATE.PLACEHOLDER',
            },
        ];
    });
    private readonly presenter = new PrivacyPolicyPresenter(
        this.translate.instant.bind(this.translate)
    );
    protected readonly itemsVM = computed(() => {
        const canEdit = this.canEdit();
        const canDelete = this.canDelete();
        const canPublish = this.canPublish();
        const canUnpublish = this.canUnpublish();
        const canChoose = this.canChoose();
        const authorization = {
            canEdit: canEdit,
            canDelete: canDelete,
            canPublish: canPublish,
            canUnpublish: canUnpublish,
            canChoose: canChoose,
        };
        const editTooltip = this.editTooltip();
        const deleteTooltip = this.deleteTooltip();
        const publishTooltip = this.publishTooltip();
        const unpublishTooltip = this.unpublishTooltip();
        const chooseTooltip = this.chooseTooltip();
        const tooltip = {
            edit: editTooltip,
            delete: deleteTooltip,
            publish: publishTooltip,
            unpublish: unpublishTooltip,
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
        this.facade.readAll(this.currentFilter() as PrivacyPolicyFilterDto);
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });
        effect(() => {
            this.pageTitle();
            this.filterFields();
            this.statusOptions();
        });
    }
    private pageTitle(): void {
        this.currentLang();
        this.title.setTitle(this.t('CONTENT_MANAGEMENT.PRIVACY_POLICY.TITLE'));
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
        (item: PrivacyPolicyVmProps) => void
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

        publish: (item) => {
            if (!this.canPublish()) {
                this.toast.error(this.publishTooltip());
                return;
            }

            this.onPublishClicked(item);
        },

        unpublish: (item) => {
            if (!this.canUnpublish()) {
                this.toast.error(this.unpublishTooltip());
                return;
            }

            this.onUnpublishClicked(item);
        },
    };
    private onNavigateToForm(event: {
        item?: PrivacyPolicyVmProps;
        ref: 'create' | 'edit';
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate(['../', PRIVACY_POLICY_FORM_ROUTE], {
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
        item: PrivacyPolicyVmProps;
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
    protected async onDelete(item: PrivacyPolicyVmProps): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey:
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.TITLE.DELETE',
            messageKey:
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.MESSAGE.DELETE',
            messageParams: {
                uniqId: item.actionsRef,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.delete({ uniqId });
    }

    protected async onPublishClicked(
        item: PrivacyPolicyVmProps
    ): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey:
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.TITLE.PUBLISH',
            messageKey:
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.MESSAGE.PUBLISH',
            messageParams: {
                uniqId: item.actionsRef,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.publish({ uniqId });
    }
    protected async onUnpublishClicked(
        item: PrivacyPolicyVmProps
    ): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey:
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.TITLE.UNPUBLISH',
            messageKey:
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.MESSAGE.UNPUBLISH',
            messageParams: {
                uniqId: item.actionsRef,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.unpublish({ uniqId });
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

        const fileName = `${this.exportFilePrefix}-privacy-pilicy`;

        const exportColumns: ExportColumn[] = PRIVACY_POLICY_TABLE.cols
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
                    'CONTENT_MANAGEMENT.PRIVACY_POLICY.TITLE'
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

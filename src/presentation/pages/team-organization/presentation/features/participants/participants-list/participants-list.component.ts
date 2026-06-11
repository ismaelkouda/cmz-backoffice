import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    signal,
    Signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ParticipantsFacade } from '@pages/team-organization/application/services/participants/participants.facade';
import { Status } from '@pages/team-organization/domain/enums/participants/participants-status.enum';
import { ParticipantsFilterDto } from '@presentation/pages/team-organization/application/dto/participants/participants-filter.dto';
import { PARTICIPANTS_TABLE } from '@presentation/pages/team-organization/presentation/adapters/participants/participants-table.constant';
import { ParticipantsVmProps } from '@presentation/pages/team-organization/presentation/adapters/participants/participants-vm-props.interface';
import { ParticipantsPresenter } from '@presentation/pages/team-organization/presentation/adapters/participants/participants-vm.presenter';
import { PARTICIPANTS_FORM } from '@presentation/pages/team-organization/presentation/features/participants/participants-paths.constants';
import { ParticipantsFilterStore } from '@presentation/pages/team-organization/presentation/store/participants/participants-filter.store';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptions,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { Roles } from '@shared/domain/enums/roles.enum';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { ToastrService } from 'ngx-toastr';
type TTableActions = 'edit' | 'delete' | 'enable' | 'disable';
@Component({
    selector: 'app-participants-list',
    standalone: true,
    imports: [
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    providers: [ParticipantsFilterStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './participants-list.component.html',
    styleUrls: ['./participants-list.component.scss'],
})
export class ParticipantsListComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly title = inject(Title);
    private readonly sweetAlert = inject(SweetAlertService);
    protected readonly facade = inject(ParticipantsFacade);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);

    private readonly formStore = inject(ParticipantsFilterStore);
    // private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly canExport = this.permissionActions.can(
        '/organization/participant',
        'export'
    );
    private readonly canCreate = this.permissionActions.can(
        '/organization/participant',
        'create'
    );
    private readonly canEdit = this.permissionActions.can(
        '/organization/participant',
        'edit'
    );
    private readonly canDelete = this.permissionActions.can(
        '/organization/participant',
        'delete'
    );
    private readonly canEnable = this.permissionActions.can(
        '/organization/participant',
        'edit'
    );
    private readonly canDisable = this.permissionActions.can(
        '/organization/participant',
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
                'TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.NO_PERMISSION_EXPORT'
            );
        }
        if (noData) {
            return this.t('TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.NO_EXPORT');
        }
        return this.t('TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    private readonly createTooltip = computed(() => {
        if (!this.canCreate()) {
            return this.t(
                'TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t('TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.CREATE');
    });
    private readonly editTooltip = computed(() => {
        if (!this.canEdit()) {
            return this.t(
                'TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.NO_PERMISSION_EDIT'
            );
        }
        return this.t('TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.NOT_EDIT');
    });
    private readonly deleteTooltip = computed(() => {
        if (!this.canDelete()) {
            return this.t(
                'TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.NO_PERMISSION_DELETE'
            );
        }
        return this.t('TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.NOT_DELETE');
    });
    private readonly enableTooltip = computed(() => {
        if (!this.canEnable()) {
            return this.t(
                'TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.NO_PERMISSION_ACTIVE'
            );
        }
        return this.t('TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.NOT_ACTIVE');
    });
    private readonly disableTooltip = computed(() => {
        if (!this.canDisable()) {
            return this.t(
                'TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.NO_PERMISSION_DISABLE'
            );
        }
        return this.t('TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.NOT_DISABLE');
    });
    private readonly chooseTooltip = computed(() => {
        if (!this.canChoose()) {
            return this.t(
                'TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.NO_PERMISSION_CHOOSE'
            );
        }
        return this.t('TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.NOT_CHOOSE');
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
            tooltip: this.t('TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.REFRESH'),
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
    protected readonly tableConfig = PARTICIPANTS_TABLE;
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
        return enumToFilterOptions(Status, this.t.bind(this));
    });
    private readonly rolesOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(Roles, this.t.bind(this));
    });
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    protected readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        const statusOpts = this.statusOptions();
        const rolesOpts = this.rolesOptions();
        // const teamsOpts = this.teams();
        return [
            {
                type: 'text',
                name: 'search',
                label: this.t('TEAM_ORGANIZATION.PARTICIPANTS.FILTER.SEARCH'),
                placeholder: this.t(
                    'TEAM_ORGANIZATION.PARTICIPANTS.FILTER.SEARCH_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.PARTICIPANTS.FILTER.SEARCH',
                    placeholder:
                        'TEAM_ORGANIZATION.PARTICIPANTS.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'status',
                label: this.t('TEAM_ORGANIZATION.PARTICIPANTS.FILTER.STATUS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: statusOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.PARTICIPANTS.FILTER.STATUS',
                },
            },
            {
                type: 'select',
                name: 'role',
                label: this.t('TEAM_ORGANIZATION.PARTICIPANTS.FILTER.ROLES'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: rolesOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.PARTICIPANTS.FILTER.ROLES',
                },
            },
        ];
    });
    private readonly presenter = new ParticipantsPresenter(
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
        this.facade.readAll(this.currentFilter() as ParticipantsFilterDto);
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });
        effect(() => {
            this.pageTitle();
            this.filterFields();
            this.statusOptions();
            this.rolesOptions();
        });
    }
    private pageTitle(): void {
        this.currentLang();
        this.title.setTitle(this.t('TEAM_ORGANIZATION.PARTICIPANTS.TITLE'));
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
        //     `${this.normalizeExportPrefix}-participants`
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
        (item: ParticipantsVmProps) => void
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
        item?: ParticipantsVmProps;
        ref: 'create' | 'edit';
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate(['../', PARTICIPANTS_FORM], {
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
        item: ParticipantsVmProps;
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
    protected async onDelete(item: ParticipantsVmProps): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey: 'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.TITLE.DELETE',
            messageKey:
                'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.MESSAGE.DELETE',
            messageParams: {
                uniqId: item.actionsRef,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.delete({ uniqId });
    }
    protected async onEnableClicked(item: ParticipantsVmProps): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey: 'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.TITLE.ENABLE',
            messageKey:
                'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.MESSAGE.ENABLE',
            messageParams: {
                uniqId: item.actionsRef,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.enable({ uniqId });
    }
    protected async onDisableClicked(item: ParticipantsVmProps): Promise<void> {
        const uniqId = item.uniqId;
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey:
                'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.TITLE.DISABLE',
            messageKey:
                'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.MESSAGE.DISABLE',
            messageParams: {
                uniqId: item.actionsRef,
            },
        });
        if (!confirmed) {
            return;
        }
        this.facade.disable({ uniqId });
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
}

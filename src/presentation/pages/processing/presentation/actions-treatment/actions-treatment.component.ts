import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DetailsFacade } from '@pages/processing/application/services/details/details.facade';
import { TasksActionsTypeFacade } from '@pages/processing/application/services/tasks/tasks-actions-type.facade';
import { TasksActionsFacade } from '@pages/processing/application/services/tasks/tasks-actions.facade';
import { ActionsTreatmentFormStore } from '@pages/processing/application/store/actions-treatment-form.store';
import { TASKS_ROUTE } from '@pages/processing/processing.routes';
import { ActionsTreatmentPresenter } from '@presentation/pages/processing/presentation/adapters/tasks/actions-treatment/actions-treatment-vm.presenter';
import { TasksActionsVmProps } from '@presentation/pages/processing/presentation/adapters/tasks/actions-treatment/actions-treatments-vm-props.interface';
import { TASKS_ACTIONS_TABLE } from '@presentation/pages/processing/presentation/adapters/tasks/actions-treatment/tasks-actions-table.constant';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ManagementDialogComponent } from '@shared/components/management/presentation/management-dialog/management-dialog.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { TypeReport } from '@shared/domain/enums/type-report.enum';
import { formatDate } from '@shared/domain/functions/format-data.function';
import { operatorsTagStyle } from '@shared/domain/functions/operators-tag-style.function';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { SweetAlertService } from '@shared/domain/services/sweet-alert.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { PROCESSING_ROUTE } from '@shared/routes/routes';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import { map } from 'rxjs';

@Component({
    selector: 'app-actions-treatment',
    standalone: true,
    templateUrl: './actions-treatment.component.html',
    styleUrls: ['./actions-treatment.component.scss'],
    imports: [
        CommonModule,
        TranslateModule,
        PageTitleComponent,
        PaginationComponent,
        TableComponent,
        ButtonModule,
        BreadcrumbComponent,
        ManagementDialogComponent,
        TagModule,
        ReactiveFormsModule,
        DialogModule,
        SelectModule,
        InputGroupModule,
        InputTextModule,
        InputGroupAddonModule,
        TextareaModule,
        DatePickerModule,
        ToggleSwitchModule,
        SelectButtonModule,
        Tooltip,
    ],
    providers: [ActionsTreatmentFormStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsTreatmentComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly clipboardService = inject(ClipboardService);
    private readonly facade = inject(TasksActionsFacade);
    private readonly actionsTypeFacade = inject(TasksActionsTypeFacade);
    private readonly closureFacade = inject(DetailsFacade);
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly sweetAlert = inject(SweetAlertService);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appCustomization = inject(AppCustomizationService);
    protected readonly formStore = inject(ActionsTreatmentFormStore);
    protected readonly tableConfig = TASKS_ACTIONS_TABLE;
    private readonly presenter = new ActionsTreatmentPresenter(
        this.translate.instant.bind(this.translate)
    );
    protected readonly isReportDialogVisible = signal(false);
    protected readonly selectedManagementType = signal<TypeReport>(
        TypeReport.PROCESSING
    );
    private readonly canExport = this.permissionActions.can(
        '/reports-processing/tasks',
        'export'
    );
    protected readonly canTreat = this.permissionActions.can(
        '/reports-processing/tasks',
        'execute'
    );
    private readonly queryParams = toSignal(
        this.route.queryParams.pipe(map((params: Params) => params)),
        { initialValue: {} }
    );
    protected readonly uniqId = computed(() => this.getQueryParam('uniqId'));
    protected readonly reportType = computed(() =>
        this.getQueryParam('reportType')
    );
    protected readonly createdAt = computed(() =>
        this.getQueryParam('createdAt')
    );
    protected readonly source = computed(() => this.getQueryParam('source'));
    protected readonly initiatorPhone = computed(() =>
        this.getQueryParam('initiatorPhone')
    );
    protected readonly operators = computed(() => {
        const rawOperators = this.getQueryParamArray('operators');
        return rawOperators.map((op) => this.translate.instant(op));
    });
    protected readonly conformityOptions = [
        {
            label: this.translate.instant(
                'PROCESSING.TASKS.ACTIONS.DIALOG.FORM.CONFORMITY.CONFORM'
            ),
            value: true,

            icon: 'pi pi-check-circle text-green-500',
            description: 'Validation réussie',
        },
        {
            label: this.translate.instant(
                'PROCESSING.TASKS.ACTIONS.DIALOG.FORM.CONFORMITY.NO_CONFORM'
            ),
            value: false,
            icon: 'pi pi-times-circle text-red-500',
            description: 'Anomalie détectée',
        },
    ];
    protected readonly items = toSignal(this.facade.items$, {
        initialValue: [],
    });
    protected readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    protected readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    protected readonly actionsType = toSignal(this.actionsTypeFacade.items$, {
        initialValue: [],
    });
    protected readonly itemsVM = computed(() => {
        const canTreat = this.canTreat();
        const tooltip = {
            edit: this.editTooltip(),
            delete: this.deleteTooltip(),
        };
        return this.items().map((item) =>
            this.presenter.map(item, {
                canTreat,
                tooltip,
            })
        );
    });
    protected readonly canClosure = computed(
        () => !this.canTreat() || this.itemsVM().length < 1 || this.loading()
    );
    private readonly canExportData = computed(
        () => !this.canExport() || this.itemsVM().length < 1 || this.loading()
    );
    protected readonly closureTooltip = computed(() => {
        const permission = !this.canTreat();
        const noData = this.itemsVM().length < 1;
        if (permission) {
            return this.t(
                'PROCESSING.TASKS.ACTIONS.TOOLTIP.NO_PERMISSION_CLOSE'
            );
        }
        if (noData) {
            return this.t('PROCESSING.TASKS.ACTIONS.TOOLTIP.NO_CLOSE');
        }
        return this.t('PROCESSING.TASKS.ACTIONS.TOOLTIP.CLOSE').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    private readonly exportTooltip = computed(() => {
        const permission = !this.canExport();
        const noData = this.itemsVM().length < 1;
        if (permission) {
            return this.t(
                'PROCESSING.TASKS.ACTIONS.TOOLTIP.NO_PERMISSION_EXPORT'
            );
        }
        if (noData) {
            return this.t('PROCESSING.TASKS.ACTIONS.TOOLTIP.NO_EXPORT');
        }
        return this.t('PROCESSING.TASKS.ACTIONS.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    private readonly createTooltip = computed(() => {
        if (!this.canTreat()) {
            return this.t(
                'PROCESSING.TASKS.ACTIONS.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t('PROCESSING.TASKS.ACTIONS.TOOLTIP.CREATE');
    });
    private readonly editTooltip = computed(() => {
        if (!this.canTreat()) {
            return this.t(
                'PROCESSING.TASKS.ACTIONS.TOOLTIP.NO_PERMISSION_EDIT'
            );
        }
        return this.t('PROCESSING.TASKS.ACTIONS.TOOLTIP.NOT_EDIT');
    });
    private readonly deleteTooltip = computed(() => {
        if (!this.canTreat()) {
            return this.t(
                'PROCESSING.TASKS.ACTIONS.TOOLTIP.NO_PERMISSION_DELETE'
            );
        }
        return this.t('PROCESSING.TASKS.ACTIONS.TOOLTIP.NOT_DELETE');
    });
    protected readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.CREATE',
            actionId: 'create',
            icon: 'pi pi-user-plus',
            class: 'btn-primary',
            disabled: !this.canTreat(),
            tooltip: this.createTooltip(),
        },
        {
            label: 'COMMON.REFRESH',
            actionId: 'refresh',
            icon: 'pi pi-refresh',
            class: 'btn-dark',
            tooltip: this.t('PROCESSING.QUEUES.TOOLTIP.REFRESH'),
        },
        {
            label: 'COMMON.EXPORT',
            actionId: 'export',
            icon: 'pi pi-file',
            class: 'btn-success',
            disabled: this.canExportData(),
            tooltip: this.exportTooltip(),
        },
    ]);

    constructor() {
        this.initializePageTitleEffect();
        this.initializeLoadingEffect();
        this.initializeFetchEffect();
    }
    private initializePageTitleEffect(): void {
        effect(() => {
            this.title.setTitle(this.t('PROCESSING.TASKS.ACTIONS.PAGE_TITLE'));
            this.translate.onLangChange
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => {
                    this.title.setTitle(
                        this.t('PROCESSING.TASKS.ACTIONS.PAGE_TITLE')
                    );
                });
        });
    }
    private initializeFetchEffect(): void {
        effect(() => {
            const uniqId = this.uniqId();
            if (!uniqId) {
                return;
            }
            this.facade.reset();
            this.facade.readAll({ uniqId }, '1', true);
            this.actionsTypeFacade.readAll();
        });
    }
    private initializeLoadingEffect(): void {
        effect(() => {
            const isLoading = this.facade.actionState() === 'loading';
            if (isLoading) {
                this.formStore.form.disable({
                    emitEvent: false,
                });
                return;
            }
            this.formStore.form.enable({
                emitEvent: false,
            });
        });
    }
    protected onHeaderButtonClicked(actionId: string): void {
        const actions: Record<string, () => void> = {
            create: () => {
                if (!this.canTreat()) {
                    this.toast.error(this.createTooltip());
                    return;
                }
                this.openCreateDialog();
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
    private onRefreshData(): void {
        this.formStore.reset();
        this.facade.refresh();
    }
    protected onActionClicked(event: {
        item: TasksActionsVmProps;
        actionId: string;
    }): void {
        const actions: Record<string, () => void> = {
            edit: () => {
                if (!this.canTreat()) {
                    this.toast.error(this.editTooltip());
                    return;
                }
                if (event.item.shouldNotifyUser) {
                    this.toast.error(this.editTooltip());
                    return;
                }
                this.formStore.openEdit(event.item);
            },
            delete: () => {
                if (!this.canTreat()) {
                    this.toast.error(this.deleteTooltip());
                    return;
                }
                this.confirmDelete(event.item);
            },
        };
        actions[event.actionId]?.();
    }
    private openCreateDialog(): void {
        this.formStore.openCreate(this.availableOperators());
    }
    protected async onSubmit(): Promise<void> {
        if (!this.uniqId() || !this.formStore.isValid()) {
            return;
        }
        const confirmed = await this.confirmSaveAction();
        if (!confirmed) {
            return;
        }
        this.formStore.submit(this.uniqId());
    }
    protected async onClosureClicked(): Promise<void> {
        if (this.canClosure()) {
            this.toast.error(this.closureTooltip());
            return;
        }
        const uniqId = this.uniqId();
        if (!uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey:
                'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.TITLE_CLOSURE',
            messageKey:
                'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.MESSAGE_CLOSURE',
            messageParams: {
                uniqId,
            },
        });
        if (!confirmed) {
            return;
        }
        this.closureFacade.treat({
            uniqId,
        });
        this.facade.refreshWithLastFilterAndPage();
    }
    private async confirmDelete(item: TasksActionsVmProps): Promise<void> {
        if (!item.uniqId) {
            return;
        }
        const confirmed = await this.sweetAlert.confirm({
            titleKey:
                'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.TITLE_DELETE',
            messageKey:
                'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.MESSAGE_DELETE',
        });
        if (!confirmed) {
            return;
        }
        this.facade.delete({
            uniqId: item.uniqId,
        });
    }
    private async confirmSaveAction(): Promise<boolean> {
        const isEditMode = this.formStore.isEditMode();
        return this.sweetAlert.confirm({
            titleKey: isEditMode
                ? 'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.TITLE_EDIT'
                : 'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.TITLE_CREATE',
            messageKey: isEditMode
                ? 'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.MESSAGE_EDIT'
                : 'PROCESSING.TASKS.ACTIONS.DIALOG.SWEET_ALERT.MESSAGE_CREATE',
        });
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
        const appName = this.appCustomization.customization.app.name;
        const filePrefix = this.normalizePrefix(appName);
        this.exportService.exportAsExcelFile(
            items,
            this.tableConfig,
            `${filePrefix}-actions-treatment`
        );
    }
    protected onChangePageClicked(event: number): void {
        if (this.uniqId()) {
            this.facade.changePage(JSON.stringify(event + 1));
        }
    }
    protected onSeeClicked(): void {
        this.isReportDialogVisible.set(true);
    }
    protected copyToClipboardClicked(value: string): void {
        this.clipboardService.copyFromContent(value);

        this.toast.success(this.t('COMMON.COPIED_TO_CLIPBOARD'));
    }
    protected navigateBack(): void {
        this.router.navigate([PROCESSING_ROUTE, TASKS_ROUTE]);
    }
    protected getFormatDate(value: string): string {
        return formatDate(value);
    }
    protected getOperatorTagStyle(operator: string): Record<string, string> {
        return operatorsTagStyle(operator);
    }
    private availableOperators(): {
        value: any;
        label: string;
    }[] {
        return this.operators().map((op) => ({
            value: op,
            label: this.translate.instant(op),
        }));
    }
    private getQueryParam(key: string): string {
        const params = this.queryParams() as Record<string, string>;

        return params[key] ?? '';
    }
    private getQueryParamArray(key: string): string[] {
        const params = this.queryParams() as Record<any, string>;
        const value = params[key];
        if (Array.isArray(value)) {
            return [...new Set(value)];
        }
        return value ? [value] : [];
    }

    private normalizePrefix(value: string): string {
        return (
            value
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }

    private t(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }
}

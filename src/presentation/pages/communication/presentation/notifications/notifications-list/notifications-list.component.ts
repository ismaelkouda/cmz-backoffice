import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    Signal,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { NotificationsFacade } from '@pages/communication/application/services/notifications/notifications.facade';
import { NotificationsVmProps } from '@pages/communication/presentation/adapters/notifications/notifications-vm-props.interface';
import { NotificationsPresenter } from '@pages/communication/presentation/adapters/notifications/notifications-vm.presenter';
import { NotificationsFilterStore } from '@pages/communication/presentation/store/notifications/notifications-filter.store';
import { NotificationsFilterDto } from '@presentation/pages/communication/application/dto/notifications/notifications-filter.dto';
import { NOTIFICATIONS } from '@presentation/pages/communication/presentation/adapters/notifications/notifications-table.constant';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { ManagementDialogComponent } from '@shared/components/management/presentation/management-dialog/management-dialog.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { TypeReport } from '@shared/domain/enums/type-report.enum';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { ToastrService } from 'ngx-toastr';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-notifications',
    standalone: true,
    templateUrl: './notifications-list.component.html',
    styleUrls: ['./notifications-list.component.scss'],
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        BreadcrumbComponent,
        PageTitleComponent,
        ManagementDialogComponent,
        FilterComponent,
        TableComponent,
        PaginationComponent,
    ],
    providers: [NotificationsFilterStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsListComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    protected readonly facade = inject(NotificationsFacade);
    private readonly formStore = inject(NotificationsFilterStore);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    // private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    private readonly canExport = this.permissionActions.can(
        '/communication/notification',
        'export'
    );
    protected readonly tableConfig = NOTIFICATIONS;
    protected readonly form = this.formStore.form;
    protected selectedReportId: string | null = null;
    protected readonly isVisibleDialog = signal<boolean>(false);
    protected readonly selectedManagementType = signal<TypeReport | null>(null);
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
    protected readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();

        return [
            {
                type: 'text',
                name: 'search',
                label: this.t('COMMUNICATION.NOTIFICATIONS.FILTER.SEARCH'),
                placeholder: this.t(
                    'COMMUNICATION.NOTIFICATIONS.FILTER.SEARCH_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'COMMUNICATION.NOTIFICATIONS.FILTER.SEARCH',
                    placeholder:
                        'COMMUNICATION.NOTIFICATIONS.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'text',
                name: 'search',
                label: this.t('COMMUNICATION.NOTIFICATIONS.FILTER.TYPE'),
                placeholder: this.t(
                    'COMMUNICATION.NOTIFICATIONS.FILTER.TYPE_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'COMMUNICATION.NOTIFICATIONS.FILTER.TYPE',
                    placeholder:
                        'COMMUNICATION.NOTIFICATIONS.FILTER.TYPE_PLACEHOLDER',
                },
            },
            {
                type: 'date',
                name: 'startDate',
                label: 'COMMON.START_DATE',
                placeholder: 'COMMON.DATE_PLACEHOLDER',
            },
            {
                type: 'date',
                name: 'endDate',
                label: 'COMMON.END_DATE',
                placeholder: 'COMMON.DATE_PLACEHOLDER',
            },
        ];
    });
    protected readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.READ_ALL',
            actionId: 'read_all',
            class: 'btn-primary',
            icon: 'pi pi-check-square',
            translateKey: 'COMMON.READ_ALL',
            disabled: this.itemsVM().length === 0,
            tooltip:
                this.itemsVM().length === 0
                    ? this.t('COMMUNICATION.NOTIFICATIONS.TOOLTIP.NOT_READ_ALL')
                    : this.t('COMMUNICATION.NOTIFICATIONS.TOOLTIP.READ_ALL'),
        },
        {
            label: 'COMMON.REFRESH',
            actionId: 'refresh',
            icon: 'pi pi-refresh',
            class: 'btn-dark',
            tooltip: this.t('COMMUNICATION.NOTIFICATIONS.TOOLTIP.REFRESH'),
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
    private readonly presenter = new NotificationsPresenter(
        this.translate.instant.bind(this.translate)
    );
    protected readonly itemsVM = computed(() => {
        this.currentLang();
        return this.items().map((item) => this.presenter.map(item));
    });
    private readonly canExportData = computed(
        () => !this.canExport() || this.itemsVM().length < 1 || this.loading()
    );
    private readonly exportTooltip = computed(() => {
        const permission = !this.canExport();
        const noData = this.itemsVM().length < 1;
        if (permission) {
            return this.t(
                'COMMUNICATION.NOTIFICATIONS.TOOLTIP.NO_PERMISSION_EXPORT'
            );
        }
        if (noData) {
            return this.t('COMMUNICATION.NOTIFICATIONS.TOOLTIP.NO_EXPORT');
        }
        return this.t('COMMUNICATION.NOTIFICATIONS.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    constructor() {
        this.facade.execute(this.currentFilter() as NotificationsFilterDto);
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
        this.title.setTitle(this.t('COMMUNICATION.NOTIFICATIONS.PAGE_TITLE'));
    }
    protected onFilterClicked(): void {
        this.facade.execute(this.formStore.value, '1');
    }
    protected onChangePageClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }
    protected onActionClicked(event: {
        item: NotificationsVmProps;
        actionId?: string;
    }): void {
        const { item } = event;
        this.selectedManagementType.set(item.type);
        this.selectedReportId = item.uniqId;
        this.isVisibleDialog.set(true);
    }
    protected onVisibleDialogClicked(event: boolean): void {
        this.isVisibleDialog.set(event);
    }
    private readonly headerActions: Record<string, () => void> = {
        read_all: () => {
            this.onReadAll();
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
    protected onHeaderButtonClicked(actionId: string): void {
        const action = this.headerActions[actionId];
        if (!action) {
            console.warn('Unknown action:', actionId);
            return;
        }
        action();
    }
    private onRefreshData(): void {
        this.formStore.reset();
        this.facade.refresh();
    }

    public onReadAll(): void {
        if (this.items().length === 0) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'COMMUNICATION.NOTIFICATIONS.SWEET_ALERT.TITLE.READ_ALL'
            ),
            text: `${this.t('COMMUNICATION.NOTIFICATIONS.SWEET_ALERT.MESSAGE.READ_ALL')}`,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.readAll();
                this.facade.refreshWithLastFilterAndPage();
            }
        });
    }

    public onDelete(item: NotificationsVmProps): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'COMMUNICATION.NOTIFICATIONS.SWEET_ALERT.TITLE.DELETE'
            ),
            text: `${this.t('COMMUNICATION.NOTIFICATIONS.SWEET_ALERT.MESSAGE.DELETE')}`,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                // this.facade.delete({ uniqId: item.uniqId });
                // this.facade.refreshWithLastFilterAndPage();
            }
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
        // const appName = this.appConfig.customization.app.name;
        // const filePrefix = this.normalizePrefix(appName);
        // this.exportService.exportAsExcelFile(
        //     items,
        //     this.tableConfig,
        //     `${filePrefix}-actions-treatment`
        // );
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }

    private normalizePrefix(appName: string): string {
        return (
            appName
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }
}

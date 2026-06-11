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
import { MessagingFacade } from '@pages/communication/application/services/messaging/messaging.facade';
import { Target } from '@pages/communication/domain/enums/messaging/messaging-target.enum';
import { MessagingPresenter } from '@pages/communication/presentation/adapters/messaging/messaging-vm.presenter';
import { MESSAGING_FORM } from '@pages/communication/presentation/messaging/messaging-paths.constants';
import { MessagingFilterStore } from '@pages/communication/presentation/store/messaging/messaging-filter.store';
import { MessagingFilterDto } from '@presentation/pages/communication/application/dto/messaging/messaging-filter.dto';
import { Channels } from '@presentation/pages/communication/domain/enums/messaging/messaging-channels.enum';
import { MESSAGING_TABLE } from '@presentation/pages/communication/presentation/adapters/messaging/messaging-table.constant';
import { MessagingVmProps } from '@presentation/pages/communication/presentation/adapters/messaging/messaging-vm-props.interface';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptions,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';
import { PermissionActionsService } from '@shared/domain/services/permission-actions.service';
import { ToastrService } from 'ngx-toastr';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-messaging-list',
    standalone: true,
    imports: [
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    providers: [MessagingFilterStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './messaging-list.component.html',
    styleUrls: ['./messaging-list.component.scss'],
})
export class MessagingListComponent {
    private readonly permissionActions = inject(PermissionActionsService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly title = inject(Title);
    protected readonly facade = inject(MessagingFacade);
    private readonly formStore = inject(MessagingFilterStore);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    // private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    private readonly canExport = this.permissionActions.can(
        '/communication/messaging',
        'export'
    );
    protected readonly canCreate = this.permissionActions.can(
        '/communication/messaging',
        'create'
    );
    protected readonly tableConfig = MESSAGING_TABLE;
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
    private readonly targetOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(Target, this.t.bind(this));
    });
    private readonly channelsOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(Channels, this.t.bind(this));
    });
    private readonly createTooltip = computed(() => {
        if (!this.canCreate()) {
            return this.t(
                'COMMUNICATION.MESSAGING.TOOLTIP.NO_PERMISSION_CREATE'
            );
        }
        return this.t('COMMUNICATION.MESSAGING.TOOLTIP.CREATE');
    });
    protected readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        const targetOpts = this.targetOptions();
        const channelOpts = this.channelsOptions();

        return [
            {
                type: 'text',
                name: 'search',
                label: this.t('COMMUNICATION.MESSAGING.FILTER.SEARCH'),
                placeholder: this.t(
                    'COMMUNICATION.MESSAGING.FILTER.SEARCH_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'COMMUNICATION.MESSAGING.FILTER.SEARCH',
                    placeholder:
                        'COMMUNICATION.MESSAGING.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'targetType',
                label: this.t('COMMUNICATION.MESSAGING.FILTER.TARGET'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: targetOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                filter: false,
                translationKeys: {
                    label: 'COMMUNICATION.MESSAGING.FILTER.TARGET',
                },
            },
            {
                type: 'multi-select',
                name: 'channels',
                label: this.t('COMMUNICATION.MESSAGING.FILTER.CHANNELS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: channelOpts,
                optionLabel: 'label',
                optionValue: 'value',
                filter: false,
                showToggleAll: false,
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'COMMUNICATION.MESSAGING.FILTER.CHANNELS',
                },
                class: 'p-medium',
            },
        ];
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
            icon: 'pi pi-refresh',
            class: 'btn-dark',
            tooltip: this.t('COMMUNICATION.MESSAGING.TOOLTIP.REFRESH'),
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
    readonly presenter = new MessagingPresenter(
        this.translate.instant.bind(this.translate)
    );
    readonly itemsVM = computed(() => {
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
                'COMMUNICATION.MESSAGING.TOOLTIP.NO_PERMISSION_EXPORT'
            );
        }
        if (noData) {
            return this.t('COMMUNICATION.MESSAGING.TOOLTIP.NO_EXPORT');
        }
        return this.t('COMMUNICATION.MESSAGING.TOOLTIP.EXPORT').replace(
            '{nb}',
            String(this.itemsVM().length)
        );
    });
    constructor() {
        this.facade.readAll(this.currentFilter() as MessagingFilterDto);
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
        this.title.setTitle(this.t('COMMUNICATION.MESSAGING.PAGE_TITLE'));
    }

    protected onFilterClicked(): void {
        this.facade.readAll(this.formStore.value, '1');
    }

    protected onChangePageClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }
    protected onHeaderButtonClicked(actionId: string): void {
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
    private onRefreshData(): void {
        this.formStore.reset();
        this.facade.refresh();
    }
    protected onActionClicked(event: {
        item: MessagingVmProps;
        actionId?: string;
    }): void {
        const { item } = event;
        this.onNavigateToForm({
            item,
            ref: 'view',
        });
    }

    private onNavigateToForm(event: {
        item?: MessagingVmProps;
        ref: 'create' | 'view';
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate(['../', MESSAGING_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    private onDeleteClicked(item: MessagingVmProps): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('COMMUNICATION.MESSAGING.SWEET_ALERT.TITLE.DELETE'),
            text: `${this.t('COMMUNICATION.MESSAGING.SWEET_ALERT.MESSAGE.DELETE')}`,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.delete({ uniqId: item.uniqId });
                this.facade.refreshWithLastFilterAndPage();
            }
        });
    }

    private onEnableClicked(item: MessagingVmProps): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('COMMUNICATION.MESSAGING.SWEET_ALERT.TITLE.ENABLE'),
            text: `${this.t('COMMUNICATION.MESSAGING.SWEET_ALERT.MESSAGE.ENABLE')}`,
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.enable({ uniqId: item.uniqId });
                this.facade.refreshWithLastFilterAndPage();
            }
        });
    }

    private onDisableClicked(item: MessagingVmProps): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('COMMUNICATION.MESSAGING.SWEET_ALERT.TITLE.DISABLE'),
            text: `${this.t('COMMUNICATION.MESSAGING.SWEET_ALERT.MESSAGE.DISABLE')}`,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.disable({ uniqId: item.uniqId });
                this.facade.refreshWithLastFilterAndPage();
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
        //     `${filePrefix}-messaging`
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

    protected getCurrentLanguage(): string {
        return this.currentLang();
    }
}

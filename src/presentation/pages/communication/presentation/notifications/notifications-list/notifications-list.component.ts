import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    OnDestroy,
    OnInit,
    Signal,
    signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { Track } from '@shared/domain/functions/track.function';
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-notifications',
    standalone: true,
    templateUrl: './notifications-list.component.html',
    styleUrls: ['./notifications-list.component.scss'],
    imports: [
        CommonModule,
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
export class NotificationsListComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public readonly facade = inject(NotificationsFacade);
    public readonly formStore = inject(NotificationsFilterStore);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.config.app.name
    );
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    private readonly destroy$ = new Subject<void>();
    public readonly tableConfig = NOTIFICATIONS;
    readonly form = this.formStore.form;
    public selectedReportId: string | null = null;
    public readonly reportTreatmentVisible = signal<boolean>(false);
    public readonly selectedManagementType = signal<TypeReport | null>(null);
    readonly items = toSignal(this.facade.items$, {
        initialValue: [],
    });
    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    public readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.READ_ALL',
            actionId: CrudFormType.READ_ALL,
            class: 'btn-primary',
            icon: 'pi pi-check-square',
            translateKey: 'COMMON.READ_ALL',
            disabled: this.items().length === 0,
        },
    ]);
    readonly filterFields: Signal<FilterField[]> = computed(() => {
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
    readonly presenter = new NotificationsPresenter(
        this.translate.instant.bind(this.translate)
    );
    readonly itemsVM = computed(() => {
        this.currentLang();
        return this.items().map((item) => this.presenter.map(item));
    });
    constructor() {
        this.facade.execute(this.currentFilter() as NotificationsFilterDto);
        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((event) => {
                this.currentLang.set(event.lang);
                this.updateTitle();
            });
    }

    @Track('notifications', (ctx) => ({
        page: ctx.pagination()?.currentPage,
        filters: ctx.form.value,
    }))
    ngOnInit(): void {
        this.updateTitle();
    }

    private updateTitle(): void {
        this.title.setTitle(this.t('COMMUNICATION.NOTIFICATIONS.PAGE_TITLE'));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onFilterClicked(): void {
        this.facade.execute(this.formStore.value, '1', true);
    }

    public onRefreshClicked(): void {
        this.formStore.reset();
        this.facade.refresh();
    }

    public onPageChangeClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }

    public onHeaderButtonClicked(actionId: string): void {
        if (actionId === CrudFormType.READ_ALL) {
            this.onReadAllClicked();
        }
    }

    public onNavigateToForm(event: {
        item?: NotificationsVmProps;
        ref: CrudFormType;
    }): void {
        console.log(event);
        // const queryParams = event.item
        //     ? { uniqId: event.item.uniqId, ref: event.ref }
        //     : { ref: event.ref };
        // this.router.navigate([NOTIFICATIONS_FORM], {
        //     relativeTo: this.activatedRoute,
        //     queryParams,
        // });
    }

    public onReadAllClicked(): void {
        if (this.items().length === 0) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'COMMUNICATION.NOTIFICATIONS.SWEET_ALERT.TITLE_READ_ALL'
            ),
            text: `${this.t('COMMUNICATION.NOTIFICATIONS.SWEET_ALERT.MESSAGE_READ_ALL')}`,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.readAll();
                this.facade.refreshWithLastFilterAndPage();
            }
        });
    }

    public onDeleteClicked(item: NotificationsVmProps): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'COMMUNICATION.NOTIFICATIONS.SWEET_ALERT.TITLE_DELETE'
            ),
            text: `${this.t('COMMUNICATION.NOTIFICATIONS.SWEET_ALERT.MESSAGE_DELETE')}`,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                // this.facade.delete({ uniqId: item.uniqId });
                // this.facade.refreshWithLastFilterAndPage();
            }
        });
    }

    public onActionClicked(event: {
        item: NotificationsVmProps;
        actionId?: string;
    }): void {
        const { item } = event;
        this.selectedReportId = item.uniqId;
        this.selectedManagementType.set(item.type);
        this.reportTreatmentVisible.set(true);
        this.facade.readOne({ uniqId: item.uniqId });
    }

    public onVisibleChange(event: boolean): void {
        this.reportTreatmentVisible.set(event);
    }

    public onExportClicked(): void {
        const items = this.items();
        if (!items.length) {
            this.toast.error(this.t('EXPORT.NO_DATA'));
            return;
        }

        this.exportService.exportAsExcelFile(
            items,
            this.tableConfig,
            `${this.exportFilePrefix}-messaging`
        );
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }

    private normalizeExportPrefix(appName: string): string {
        return (
            appName
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }

    public getCurrentLanguage(): string {
        return this.currentLang();
    }
}

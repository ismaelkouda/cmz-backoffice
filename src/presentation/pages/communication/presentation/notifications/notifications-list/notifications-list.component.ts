import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    OnDestroy,
    OnInit,
    Signal,
    signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import SweetAlert from 'sweetalert2';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';

import { NotificationsFacade } from '@presentation/pages/communication/application/services/notifications/notifications.facade';
import { NOTIFICATIONS_TABLE } from '@presentation/pages/communication/domain/constants/notifications/notifications-table.constant';
import { NotificationsFilterControl } from '@presentation/pages/communication/domain/controls/notifications/notifications-filter.control';
import { NotificationsEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications.entity';

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
        FilterComponent,
        TableComponent,
        PaginationComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsListComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public readonly facade = inject(NotificationsFacade);
    private readonly fb = inject(FormBuilder);
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
    public readonly tableConfig = NOTIFICATIONS_TABLE;
    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
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
    readonly form = this.fb.group<NotificationsFilterControl>({
        search: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        type: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        startDate: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        endDate: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
    });
    constructor() {
        this.facade.read();
        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });

        effect(() => {
            this.filterFields();
        });
    }

    ngOnInit(): void {
        this.title.setTitle(this.t('COMMUNICATION.NOTIFICATIONS.PAGE_TITLE'));

        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.title.setTitle(
                    this.t('COMMUNICATION.NOTIFICATIONS.PAGE_TITLE')
                );
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onFilterClicked(filterValues: any): void {
        this.facade.read(filterValues, '1', true);
    }

    public onRefreshClicked(): void {
        this.form.reset();
        this.facade.refresh();
    }

    public onPageChangeClicked(event: number): void {
        this.facade.changePage(JSON.stringify(event + 1));
    }

    public onHeaderButtonClicked(actionId: string): void {
        if (actionId === CrudFormType.CREATE) {
            this.onNavigateToForm({
                item: undefined,
                ref: CrudFormType.CREATE,
            });
        }
    }

    public onNavigateToForm(event: {
        item?: NotificationsEntity;
        ref: CrudFormType;
    }): void {
        console.log(event);
        // const queryParams = event.item
        //     ? { uniqId: event.item.uniqId, ref: event.ref }
        //     : { ref: event.ref };
        // this.router.navigate([MESSAGING_FORM], {
        //     relativeTo: this.activatedRoute,
        //     queryParams,
        // });
    }

    public onDeleteClicked(item: NotificationsEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('COMMUNICATION.MESSAGING.SWEET_ALERT.TITLE_DELETE'),
            text: `${this.t('COMMUNICATION.MESSAGING.SWEET_ALERT.MESSAGE_DELETE')}`,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                // this.facade.delete({ uniqId: item.uniqId });
                // this.facade.refreshWithLastFilterAndPage();
            }
        });
    }

    public onExportExcel(): void {
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

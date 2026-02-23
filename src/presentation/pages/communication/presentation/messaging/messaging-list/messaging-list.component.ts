import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    OnDestroy,
    OnInit,
    signal,
    Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import SweetAlert from 'sweetalert2';

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
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';

import { MessagingFacade } from '@presentation/pages/communication/application/services/messaging/messaging.facade';
import { MESSAGING_TABLE } from '@presentation/pages/communication/domain/constants/messaging/messaging-table.constant';
import { MessagingFilterControl } from '@presentation/pages/communication/domain/controls/messaging/messaging-filter.control';
import { MessagingEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging.entity';
import { Target } from '@presentation/pages/communication/domain/enums/messaging/messaging-target.enum';
import { MESSAGING_FORM } from '@presentation/pages/communication/presentation/messaging/messaging.routes';

@Component({
    selector: 'app-messaging-list',
    standalone: true,
    imports: [
        CommonModule,
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './messaging-list.component.html',
    styleUrls: ['./messaging-list.component.scss'],
})
export class MessagingListComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public readonly facade = inject(MessagingFacade);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
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
    public readonly tableConfig = MESSAGING_TABLE;
    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    readonly targetOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(Target, this.t.bind(this));
    });
    public readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.CREATE',
            actionId: CrudFormType.CREATE,
            class: 'btn-primary',
            icon: 'pi pi-plus',
            translateKey: 'COMMON.CREATE',
        },
    ]);
    readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        const targetOpts = this.targetOptions();

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
                name: 'target',
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
        ];
    });
    readonly form = this.fb.group<MessagingFilterControl>({
        search: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        reportId: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        targetType: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
    });
    constructor() {
        this.facade.readAll();
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
        this.title.setTitle(this.t('COMMUNICATION.MESSAGING.PAGE_TITLE'));

        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.title.setTitle(
                    this.t('COMMUNICATION.MESSAGING.PAGE_TITLE')
                );
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onFilterClicked(filterValues: any): void {
        this.facade.readAll(filterValues, '1', true);
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
        item?: MessagingEntity;
        ref: CrudFormType;
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        console.log('queryParams: ', queryParams);
        this.router.navigate([MESSAGING_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    public onDeleteClicked(item: MessagingEntity): void {
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
                this.facade.delete({ uniqId: item.uniqId });
                this.facade.refreshWithLastFilterAndPage();
            }
        });
    }

    public onEnableClicked(item: MessagingEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('COMMUNICATION.MESSAGING.SWEET_ALERT.TITLE_ENABLE'),
            text: `${this.t('COMMUNICATION.MESSAGING.SWEET_ALERT.MESSAGE_ENABLE')}`,
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

    public onDisableClicked(item: MessagingEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('COMMUNICATION.MESSAGING.SWEET_ALERT.TITLE_DISABLE'),
            text: `${this.t('COMMUNICATION.MESSAGING.SWEET_ALERT.MESSAGE_DISABLE')}`,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.disable({ uniqId: item.uniqId });
                this.facade.refreshWithLastFilterAndPage();
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

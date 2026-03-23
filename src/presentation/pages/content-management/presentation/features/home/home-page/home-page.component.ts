import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    Signal,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { HomeFacade } from '@pages/content-management/application/services/home/home.facade';
import { FILTER_KEYS } from '@pages/content-management/domain/constants/home/home-filter-keys.constants';
import { HOME_TABLE } from '@pages/content-management/domain/constants/home/home-table.constants';
import { HomeFilterControl } from '@pages/content-management/domain/controls/home/home-filter.control';
import { HomeEntity } from '@pages/content-management/domain/entities/home/home.entity';
import { Status } from '@pages/content-management/domain/enums/home/home-status.enum';
import { HOME_FORM } from '@pages/content-management/presentation/features/home/home.routes';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptions,
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/sweet-alert-params.constant';
import { Platform } from '@shared/domain/enums/platform.enum';
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';
import { ToastrService } from 'ngx-toastr';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        PageTitleComponent,
        FilterComponent,
        TableComponent,
        PaginationComponent,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
    private readonly title = inject(Title);
    public readonly facade = inject(HomeFacade);
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
    private readonly destroyRef = inject(DestroyRef);
    public readonly tableConfig = HOME_TABLE;
    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    readonly statusOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(Status, this.t.bind(this));
    });
    readonly platformOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(Platform, this.t.bind(this));
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
        const statusOpts = this.statusOptions();
        const platformOpts = this.platformOptions();

        return [
            {
                type: 'text',
                name: FILTER_KEYS.SEARCH,
                label: this.t('CONTENT_MANAGEMENT.HOME.FILTER.SEARCH'),
                placeholder: this.t(
                    'CONTENT_MANAGEMENT.HOME.FILTER.SEARCH_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'CONTENT_MANAGEMENT.HOME.FILTER.SEARCH',
                    placeholder:
                        'CONTENT_MANAGEMENT.HOME.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: FILTER_KEYS.STATUS,
                label: this.t('CONTENT_MANAGEMENT.HOME.FILTER.STATUS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: statusOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'CONTENT_MANAGEMENT.HOME.FILTER.STATUS',
                },
            },
            {
                type: 'multi-select',
                name: FILTER_KEYS.PLATFORMS,
                label: this.t('CONTENT_MANAGEMENT.HOME.FILTER.PLATFORMS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: platformOpts,
                optionLabel: 'label',
                optionValue: 'value',
                filter: false,
                showToggleAll: false,
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'CONTENT_MANAGEMENT.HOME.FILTER.PLATFORMS',
                },
                class: 'p-medium',
            },
            {
                type: 'date',
                name: FILTER_KEYS.START_DATE,
                label: 'CONTENT_MANAGEMENT.HOME.FILTER.DATE.FROM',
                placeholder: 'CONTENT_MANAGEMENT.HOME.FILTER.DATE.PLACEHOLDER',
            },
            {
                type: 'date',
                name: FILTER_KEYS.END_DATE,
                label: 'CONTENT_MANAGEMENT.HOME.FILTER.DATE.TO',
                placeholder: 'CONTENT_MANAGEMENT.HOME.FILTER.DATE.PLACEHOLDER',
            },
        ];
    });
    readonly form = this.fb.group<HomeFilterControl>({
        search: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        platforms: new FormControl<string[] | undefined>(undefined, {
            nonNullable: true,
        }),
        status: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        startDate: new FormControl<Date | undefined>(undefined, {
            nonNullable: true,
        }),
        endDate: new FormControl<Date | undefined>(undefined, {
            nonNullable: true,
        }),
    });
    constructor() {
        this.facade.readAll();
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: LangChangeEvent) => {
                this.currentLang.set(event.lang);
            });

        effect(() => {
            this.filterFields();
            this.statusOptions();
            this.platformOptions();
        });
    }

    ngOnInit(): void {
        this.title.setTitle(this.t('CONTENT_MANAGEMENT.HOME.PAGE_TITLE'));
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.title.setTitle(
                    this.t('CONTENT_MANAGEMENT.HOME.PAGE_TITLE')
                );
            });
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
        item?: HomeEntity;
        ref: CrudFormType;
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate([HOME_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    public onDeleteClicked(item: HomeEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('CONTENT_MANAGEMENT.HOME.SWEET_ALERT.TITLE_DELETE'),
            text: `${this.t('CONTENT_MANAGEMENT.HOME.SWEET_ALERT.MESSAGE_DELETE')}`,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.delete({ uniqId: item.uniqId });
            }
        });
    }

    public onEnableClicked(item: HomeEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('CONTENT_MANAGEMENT.HOME.SWEET_ALERT.TITLE_ENABLE'),
            text: `${this.t('CONTENT_MANAGEMENT.HOME.SWEET_ALERT.MESSAGE_ENABLE')}`,
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.enable({ uniqId: item.uniqId });
            }
        });
    }

    public onDisableClicked(item: HomeEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('CONTENT_MANAGEMENT.HOME.SWEET_ALERT.TITLE_DISABLE'),
            text: `${this.t('CONTENT_MANAGEMENT.HOME.SWEET_ALERT.MESSAGE_DISABLE')}`,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.disable({ uniqId: item.uniqId });
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
            `${this.exportFilePrefix}-home`
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

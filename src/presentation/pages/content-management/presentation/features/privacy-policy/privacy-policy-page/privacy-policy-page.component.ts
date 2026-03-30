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
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { PrivacyPolicyFacade } from '@pages/content-management/application/services/privacy-policy/privacy-policy.facade';
import { PrivacyPolicyFilterControl } from '@pages/content-management/domain/controls/privacy-policy/privacy-policy-filter.control';
import { PrivacyPolicyEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy.entity';
import { Status } from '@pages/content-management/domain/enums/privacy-policy/privacy-policy-status.enum';
import { PRIVACY_POLICY_FORM } from '@pages/content-management/presentation/features/privacy-policy/privacy-policy.routes';
import { FILTER_KEYS } from '@presentation/pages/content-management/presentation/adapters/privacy-policy/privacy-policy-filter-keys.constants';
import { PRIVACY_POLICY_TABLE } from '@presentation/pages/content-management/presentation/adapters/privacy-policy/privacy-policy-table.constants';
import { PrivacyPolicyPresenter } from '@presentation/pages/content-management/presentation/adapters/privacy-policy/privacy-policy-vm.presenter';
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
import { semanticVersionValidator } from '@shared/domain/functions/semantic-version-validator';
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';
import { ToastrService } from 'ngx-toastr';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-privacy-policy-page',
    standalone: true,
    templateUrl: './privacy-policy-page.component.html',
    styleUrls: ['./privacy-policy-page.component.scss'],
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
export class PrivacyPolicyPageComponent implements OnInit {
    private readonly title = inject(Title);
    public readonly facade = inject(PrivacyPolicyFacade);
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
    public readonly tableConfig = PRIVACY_POLICY_TABLE;
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
                type: 'text',
                name: FILTER_KEYS.VERSION,
                label: this.t(
                    'CONTENT_MANAGEMENT.PRIVACY_POLICY.FILTER.VERSION'
                ),
                placeholder: this.t(
                    'CONTENT_MANAGEMENT.PRIVACY_POLICY.FILTER.VERSION_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.FILTER.VERSION',
                    placeholder:
                        'CONTENT_MANAGEMENT.PRIVACY_POLICY.FILTER.VERSION_PLACEHOLDER',
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
    readonly form = this.fb.group<PrivacyPolicyFilterControl>({
        search: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        version: new FormControl<string | undefined>(undefined, {
            validators: [
                semanticVersionValidator(),
                Validators.pattern(/^\d+(\.\d+){0,2}$/),
            ],
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
    readonly presenter = new PrivacyPolicyPresenter(
        this.translate.instant.bind(this.translate)
    );
    readonly itemsVM = computed(() => {
        this.currentLang();
        return this.items().map((item) => this.presenter.map(item));
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
        });
    }

    ngOnInit(): void {
        this.title.setTitle(
            this.t('CONTENT_MANAGEMENT.PRIVACY_POLICY.PAGE_TITLE')
        );

        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.title.setTitle(
                    this.t('CONTENT_MANAGEMENT.PRIVACY_POLICY.PAGE_TITLE')
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
        item?: PrivacyPolicyEntity;
        ref: CrudFormType;
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate([PRIVACY_POLICY_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    public onDeleteClicked(item: PrivacyPolicyEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.TITLE_DELETE'
            ),
            text: `${this.t('CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.MESSAGE_DELETE')}`,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.delete({ uniqId: item.uniqId });
            }
        });
    }

    public onEnableClicked(item: PrivacyPolicyEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.TITLE_ENABLE'
            ),
            text: `${this.t('CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.MESSAGE_ENABLE')}`,
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.publish({ uniqId: item.uniqId });
            }
        });
    }

    public onDisableClicked(item: PrivacyPolicyEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.TITLE_DISABLE'
            ),
            text: `${this.t('CONTENT_MANAGEMENT.PRIVACY_POLICY.SWEET_ALERT.MESSAGE_DISABLE')}`,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.unpublish({ uniqId: item.uniqId });
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
            `${this.exportFilePrefix}-participants`
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

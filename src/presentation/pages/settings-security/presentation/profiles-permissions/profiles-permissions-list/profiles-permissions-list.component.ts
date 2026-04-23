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
import { ProfilesPermissionsFacade } from '@pages/settings-security/application/services/profiles-permissions/profiles-permissions.facade';
import { ProfilesPermissionsFilterControl } from '@pages/settings-security/domain/controls/profiles-permissions/profiles-permissions-filter.control';
import { ProfilesPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';
import { Status } from '@pages/settings-security/domain/enums/profiles-permissions/profiles-permissions-status.enum';
import {
    PROFILES_PERMISSIONS_FORM,
    PROFILES_PERMISSIONS_USERS,
} from '@pages/settings-security/presentation/profiles-permissions/profiles-permissions-paths.constant';
import { PROFILES_PERMISSIONS_TABLE } from '@presentation/pages/settings-security/presentation/adapters/profiles-permissions/profiles-permissions-table.constant';
import { ProfilesPermissionsPresenter } from '@presentation/pages/settings-security/presentation/adapters/profiles-permissions/profiles-permissions-vm.presenter';
import { FilterComponent } from '@shared/components/filter/filter.component';
import {
    enumToFilterOptionsWithValue,
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
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-profiles-permissions-list',
    standalone: true,
    imports: [
        CommonModule,
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './profiles-permissions-list.component.html',
    styleUrls: ['./profiles-permissions-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilesPermissionsListComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public readonly facade = inject(ProfilesPermissionsFacade);
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
    readonly tableConfig = PROFILES_PERMISSIONS_TABLE;
    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    readonly statusOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptionsWithValue(Status, this.t.bind(this));
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
                name: 'search',
                label: this.t(
                    'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FILTER.SEARCH'
                ),
                placeholder: this.t(
                    'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FILTER.SEARCH_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FILTER.SEARCH',
                    placeholder:
                        'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'status',
                label: this.t(
                    'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FILTER.STATUS'
                ),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: statusOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FILTER.STATUS',
                },
            },
            {
                type: 'text',
                name: 'user',
                label: this.t(
                    'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FILTER.USER'
                ),
                placeholder: this.t(
                    'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FILTER.USER_PLACEHOLDER'
                ),
                icon: 'pi pi-user',
                translationKeys: {
                    label: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FILTER.USER',
                    placeholder:
                        'SETTINGS_SECURITY.PROFILES_PERMISSIONS.FILTER.USER_PLACEHOLDER',
                },
            },
        ];
    });
    readonly presenter = new ProfilesPermissionsPresenter(
        this.translate.instant.bind(this.translate)
    );
    readonly itemsVM = computed(() => {
        this.currentLang();
        return this.items().map((item) => this.presenter.map(item));
    });
    readonly form = this.fb.group<ProfilesPermissionsFilterControl>({
        search: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        user: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        status: new FormControl<Status | undefined>(undefined, {
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
            this.statusOptions();
        });
    }

    ngOnInit(): void {
        this.title.setTitle(
            this.t('SETTINGS_SECURITY.PROFILES_PERMISSIONS.PAGE_TITLE')
        );

        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.title.setTitle(
                    this.t('SETTINGS_SECURITY.PROFILES_PERMISSIONS.PAGE_TITLE')
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

    public onPageChangeClicked(page: number): void {
        this.facade.changePage(JSON.stringify(page + 1));
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
        item?: ProfilesPermissionsEntity;
        ref: CrudFormType;
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate(['../', PROFILES_PERMISSIONS_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    public onDeleteClicked(item: ProfilesPermissionsEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'SETTINGS_SECURITY.PROFILES_PERMISSIONS.SWEET_ALERT.TITLE_DELETE'
            ),
            text: this.t(
                'SETTINGS_SECURITY.PROFILES_PERMISSIONS.SWEET_ALERT.MESSAGE_DELETE'
            ),
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((res) => {
            if (res.isConfirmed) {
                this.facade.delete({ uniqId: item.uniqId });
                this.facade.refreshWithLastFilterAndPage();
            }
        });
    }

    public onEnableClicked(item: ProfilesPermissionsEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'SETTINGS_SECURITY.PROFILES_PERMISSIONS.SWEET_ALERT.TITLE_ENABLE'
            ),
            text: `${this.t('SETTINGS_SECURITY.PROFILES_PERMISSIONS.SWEET_ALERT.MESSAGE_ENABLE')}`,
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

    public onDisableClicked(item: ProfilesPermissionsEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'SETTINGS_SECURITY.PROFILES_PERMISSIONS.SWEET_ALERT.TITLE_DISABLE'
            ),
            text: `${this.t('SETTINGS_SECURITY.PROFILES_PERMISSIONS.SWEET_ALERT.MESSAGE_DISABLE')}`,
            backdrop: false,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.disable({ uniqId: item.uniqId });
                this.facade.refreshWithLastFilterAndPage();
            }
        });
    }

    public onBadgeClicked(event: {
        item: ProfilesPermissionsEntity;
        col: HTMLTableCellElement;
    }): void {
        this.router.navigate(['../', PROFILES_PERMISSIONS_USERS], {
            relativeTo: this.activatedRoute,
            queryParams: { uniqId: event.item.uniqId, name: event.item.name },
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
            `${this.exportFilePrefix}-profiles-permissions`
        );
    }

    private t(key: string): string {
        return this.translate.instant(key);
    }

    private normalizeExportPrefix(name: string): string {
        return (
            name
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }

    public getCurrentLanguage(): string {
        return this.currentLang();
    }
}

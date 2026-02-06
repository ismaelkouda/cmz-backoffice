import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
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
    FilterField,
    FilterOption,
} from '@shared/components/filter/filter.types';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';

import { ProfilsHabilitationsFacade } from '@presentation/pages/settings-security/core/application/services/profils-habilitations/profils-habilitations.facade';
import { PROFILES_HABILITATIONS_TABLE_CONSTANT } from '@presentation/pages/settings-security/core/domain/constants/profils-habilitations/profils-habilitations-table.constant';
import { ProfilsHabilitationsFilterControl } from '@presentation/pages/settings-security/core/domain/controls/profils-habilitations/profils-habilitations-filter.control';
import { ProfilsHabilitationsEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations.entity';
import {
    PROFILES_HABILITATIONS_FORM,
    PROFILES_HABILITATIONS_USERS_ROUTE,
} from '@presentation/pages/settings-security/presentation/profils-habilitations/profils-habilitations.routes';

@Component({
    selector: 'app-profils-habilitations-list',
    standalone: true,
    imports: [
        CommonModule,
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './profils-habilitations-list.component.html',
    styleUrls: ['./profils-habilitations-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilsHabilitationsListComponent {
    private readonly title = inject(Title);
    public readonly facade = inject(ProfilsHabilitationsFacade);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly toastr = inject(ToastrService);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly currentLang = signal<string>(this.translate.getCurrentLang());
    private readonly destroy$ = new Subject<void>();
    readonly tableConfig = PROFILES_HABILITATIONS_TABLE_CONSTANT;
    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.config.app.name
    );
    readonly statusOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return [
            {
                label: this.t('COMMON.ACTIVATED'),
                value: true,
                translationKey: 'COMMON.ACTIVATED',
            },
            {
                label: this.t('COMMON.DEACTIVATED'),
                value: false,
                translationKey: 'COMMON.DEACTIVATED',
            },
        ];
    });
    readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();
        const statusOpts = this.statusOptions();

        return [
            {
                type: 'text',
                name: 'search',
                label: this.t(
                    'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FILTER.SEARCH'
                ),
                placeholder: this.t(
                    'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FILTER.SEARCH_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FILTER.SEARCH',
                    placeholder:
                        'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'isActive',
                label: this.t(
                    'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FILTER.STATUS'
                ),
                options: statusOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FILTER.STATUS',
                },
            },
            {
                type: 'text',
                name: 'user',
                label: this.t(
                    'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FILTER.USER'
                ),
                placeholder: this.t(
                    'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FILTER.USER_PLACEHOLDER'
                ),
                icon: 'pi pi-user',
                translationKeys: {
                    label: 'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FILTER.USER',
                    placeholder:
                        'SETTINGS_SECURITY.PROFILES_HABILITATIONS.FILTER.USER_PLACEHOLDER',
                },
            },
        ];
    });
    readonly form = this.fb.group<ProfilsHabilitationsFilterControl>({
        search: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        user: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        isActive: new FormControl<boolean | undefined>(undefined, {
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
            this.t('SETTINGS_SECURITY.PROFILES_HABILITATIONS.PAGE_TITLE')
        );

        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.title.setTitle(
                    this.t(
                        'SETTINGS_SECURITY.PROFILES_HABILITATIONS.PAGE_TITLE'
                    )
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
        this.facade.changePage(page + 1);
    }

    public onNavigateToForm(event: {
        item?: ProfilsHabilitationsEntity;
        ref: CrudFormType;
    }) {
        const queryParams: any = event.item
            ? { code: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate([PROFILES_HABILITATIONS_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    public onDeleteClicked(item: ProfilsHabilitationsEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'SETTINGS_SECURITY.PROFILES_HABILITATIONS.SWEET_ALERT.TITLE_DELETE'
            ),
            text: this.t(
                'SETTINGS_SECURITY.PROFILES_HABILITATIONS.SWEET_ALERT.MESSAGE_DELETE'
            ),
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((res) => {
            if (res.isConfirmed) {
                this.facade
                    .delete(item.uniqId)
                    .subscribe(() =>
                        this.facade.refreshWithLastFilterAndPage()
                    );
            }
        });
    }

    public onBadgeClicked(event: {
        item: ProfilsHabilitationsEntity;
        col: HTMLTableCellElement;
    }) {
        this.router.navigate([PROFILES_HABILITATIONS_USERS_ROUTE], {
            relativeTo: this.activatedRoute,
            queryParams: { code: event.item.uniqId, name: event.item.name },
        });
    }

    public onExportExcel(): void {
        const items = this.items();
        if (!items.length) {
            this.toastr.error(this.t('EXPORT.NO_DATA'));
            return;
        }

        this.exportService.exportAsExcelFile(
            items,
            this.tableConfig,
            `${this.exportFilePrefix}-profils-habilitations`
        );
    }

    private t(key: string) {
        return this.translate.instant(key);
    }

    private normalizeExportPrefix(name: string): string {
        return (
            name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '') || 'cmz'
        );
    }

    public getCurrentLanguage(): string {
        return this.currentLang();
    }
}

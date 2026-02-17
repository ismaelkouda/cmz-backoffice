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
import { Roles } from '@shared/domain/enums/roles.enum';
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/domain/services/table-export-excel-file.service';
import { CrudFormType } from '@shared/domain/utils/crud-form-utils';

import { ParticipantsFacade } from '@presentation/pages/team-organization/application/services/participants/participants.facade';
import { RolesSelectFacade } from '@presentation/pages/team-organization/application/services/participants/roles-select.facade';
import { TeamsSelectFacade } from '@presentation/pages/team-organization/application/services/teams/teams-select.facade';
import { PARTICIPANTS_TABLE_CONSTANT } from '@presentation/pages/team-organization/domain/constants/participants/participants-table.constant';
import { ParticipantsFilterControl } from '@presentation/pages/team-organization/domain/controls/participants/participants-filter.control';
import { ParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants.entity';
import { PARTICIPANTS_STATUS } from '@presentation/pages/team-organization/domain/enums/participants/participants-status.enum';
import { PARTICIPANTS_FORM } from '@presentation/pages/team-organization/presentation/participants/participants.routes';

@Component({
    selector: 'app-participants-list',
    standalone: true,
    imports: [
        CommonModule,
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './participants-list.component.html',
    styleUrls: ['./participants-list.component.scss'],
})
export class ParticipantsListComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public readonly facade = inject(ParticipantsFacade);
    public readonly teamsFacade = inject(TeamsSelectFacade);
    public readonly rolesFacade = inject(RolesSelectFacade);
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
    public readonly tableConfig = PARTICIPANTS_TABLE_CONSTANT;
    readonly items = toSignal(this.facade.items$, { initialValue: [] });
    readonly teams = toSignal(this.teamsFacade.items$, { initialValue: [] });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });

    readonly statusOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(PARTICIPANTS_STATUS, this.t.bind(this));
    });
    readonly rolesOptions: Signal<FilterOption[]> = computed(() => {
        this.currentLang();
        return enumToFilterOptions(Roles, this.t.bind(this));
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
        const rolesOpts = this.rolesOptions();
        const teamsOpts = this.teams();

        return [
            {
                type: 'text',
                name: 'search',
                label: this.t('TEAM_ORGANIZATION.PARTICIPANTS.FILTER.SEARCH'),
                placeholder: this.t(
                    'TEAM_ORGANIZATION.PARTICIPANTS.FILTER.SEARCH_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.PARTICIPANTS.FILTER.SEARCH',
                    placeholder:
                        'TEAM_ORGANIZATION.PARTICIPANTS.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'isActive',
                label: this.t('TEAM_ORGANIZATION.PARTICIPANTS.FILTER.STATUS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: statusOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.PARTICIPANTS.FILTER.STATUS',
                },
            },
            {
                type: 'select',
                name: 'role',
                label: this.t('TEAM_ORGANIZATION.PARTICIPANTS.FILTER.ROLES'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: rolesOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.PARTICIPANTS.FILTER.ROLES',
                },
            },
            {
                type: 'select',
                name: 'team',
                label: this.t('TEAM_ORGANIZATION.PARTICIPANTS.FILTER.TEAMS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: teamsOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.PARTICIPANTS.FILTER.TEAMS',
                },
            },
        ];
    });
    readonly form = this.fb.group<ParticipantsFilterControl>({
        search: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        isActive: new FormControl<boolean | undefined>(undefined, {
            nonNullable: true,
        }),
        role: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        team: new FormControl<string | undefined>(undefined, {
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
            this.rolesOptions();
        });
    }

    ngOnInit(): void {
        this.title.setTitle(
            this.t('TEAM_ORGANIZATION.PARTICIPANTS.PAGE_TITLE')
        );

        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.title.setTitle(
                    this.t('TEAM_ORGANIZATION.PARTICIPANTS.PAGE_TITLE')
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
        item?: ParticipantsEntity;
        ref: CrudFormType;
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate([PARTICIPANTS_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    public onDeleteClicked(item: ParticipantsEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.TITLE_DELETE'
            ),
            text: `${this.t('TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.MESSAGE_DELETE')}`,
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.delete({ uniqId: item.uniqId });
                this.facade.refreshWithLastFilterAndPage();
            }
        });
    }

    public onEnableClicked(item: ParticipantsEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.TITLE_ENABLE'
            ),
            text: `${this.t('TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.MESSAGE_ENABLE')}`,
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

    public onDisableClicked(item: ParticipantsEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t(
                'TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.TITLE_DISABLE'
            ),
            text: `${this.t('TEAM_ORGANIZATION.PARTICIPANTS.SWEET_ALERT.MESSAGE_DISABLE')}`,
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

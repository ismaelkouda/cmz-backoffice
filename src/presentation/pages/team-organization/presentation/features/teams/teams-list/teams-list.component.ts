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
import { TeamsFacade } from '@pages/team-organization/application/services/teams/teams.facade';
import { TeamsFilterControl } from '@pages/team-organization/domain/controls/teams/teams-filter.control';
import { TeamsEntity } from '@pages/team-organization/domain/entities/teams/teams.entity';
import { Status } from '@pages/team-organization/domain/enums/teams/teams-status.enum';
import { TEAMS_TABLE_CONSTANT } from '@presentation/pages/team-organization/presentation/adapters/teams/teams-table.constant';
import { TeamsPresenter } from '@presentation/pages/team-organization/presentation/adapters/teams/teams-vm.presenter';
import {
    TEAMS_FORM,
    TEAMS_USERS,
} from '@presentation/pages/team-organization/presentation/features/teams/teams.routes';
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
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import SweetAlert from 'sweetalert2';

@Component({
    selector: 'app-teams-list',
    standalone: true,
    imports: [
        CommonModule,
        FilterComponent,
        TableComponent,
        PaginationComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './teams-list.component.html',
    styleUrls: ['./teams-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsListComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    public readonly facade = inject(TeamsFacade);
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
    readonly tableConfig = TEAMS_TABLE_CONSTANT;
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
                name: 'search',
                label: this.t('TEAM_ORGANIZATION.TEAMS.FILTER.SEARCH'),
                placeholder: this.t(
                    'TEAM_ORGANIZATION.TEAMS.FILTER.SEARCH_PLACEHOLDER'
                ),
                icon: 'pi pi-search',
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.TEAMS.FILTER.SEARCH',
                    placeholder:
                        'TEAM_ORGANIZATION.TEAMS.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'select',
                name: 'isActive',
                label: this.t('TEAM_ORGANIZATION.TEAMS.FILTER.STATUS'),
                placeholder: this.t('COMMON.SELECT_PLACEHOLDER'),
                options: statusOpts,
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true,
                icon: 'pi pi-filter',
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.TEAMS.FILTER.STATUS',
                },
            },
            {
                type: 'text',
                name: 'member',
                label: this.t('TEAM_ORGANIZATION.TEAMS.FILTER.PARTICIPANT'),
                placeholder: this.t(
                    'TEAM_ORGANIZATION.TEAMS.FILTER.PARTICIPANT_PLACEHOLDER'
                ),
                icon: 'pi pi-user',
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.TEAMS.FILTER.PARTICIPANT',
                    placeholder:
                        'TEAM_ORGANIZATION.TEAMS.FILTER.PARTICIPANT_PLACEHOLDER',
                },
            },
        ];
    });
    readonly presenter = new TeamsPresenter(
        this.translate.instant.bind(this.translate)
    );
    readonly itemsVM = computed(() => {
        this.currentLang();
        return this.items().map((item) => this.presenter.map(item));
    });
    readonly form = this.fb.group<TeamsFilterControl>({
        search: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        member: new FormControl<string | undefined>(undefined, {
            nonNullable: true,
        }),
        isActive: new FormControl<string | undefined>(undefined, {
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
        this.title.setTitle(this.t('TEAM_ORGANIZATION.TEAMS.PAGE_TITLE'));

        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.title.setTitle(
                    this.t('TEAM_ORGANIZATION.TEAMS.PAGE_TITLE')
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

    public onBadgeClicked(event: {
        item: TeamsEntity;
        col: HTMLTableCellElement;
    }): void {
        this.router.navigate([TEAMS_USERS], {
            relativeTo: this.activatedRoute,
            queryParams: { uniqId: event.item.uniqId, name: event.item.name },
        });
    }

    public onNavigateToForm(event: {
        item?: TeamsEntity;
        ref: CrudFormType;
    }): void {
        const queryParams = event.item
            ? { uniqId: event.item.uniqId, ref: event.ref }
            : { ref: event.ref };
        this.router.navigate([TEAMS_FORM], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }

    public onDeleteClicked(item: TeamsEntity): void {
        if (!item.uniqId) {
            return;
        }
        const title: string = this.t(
            'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.TITLE_DELETE'
        );
        const text: string = this.t(
            'TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.MESSAGE_DELETE'
        );
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: title,
            html: text.replaceAll('{{teamCode}}', item.code),
            confirmButtonText: this.t('COMMON.CONFIRM'),
            cancelButtonText: this.t('COMMON.CANCEL'),
        }).then((res) => {
            if (res.isConfirmed) {
                this.facade.delete({ uniqId: item.uniqId });
                this.facade.refreshWithLastFilterAndPage();
            }
        });
    }

    public onEnableClicked(item: TeamsEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.TITLE_ENABLE'),
            text: `${this.t('TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.MESSAGE_ENABLE')}`,
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

    public onDisableClicked(item: TeamsEntity): void {
        if (!item.uniqId) {
            return;
        }
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.t('TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.TITLE_DISABLE'),
            text: `${this.t('TEAM_ORGANIZATION.TEAMS.SWEET_ALERT.MESSAGE_DISABLE')}`,
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

    public onExportExcel(): void {
        const items = this.items();
        if (!items.length) {
            this.toast.error(this.t('EXPORT.NO_DATA'));
            return;
        }

        this.exportService.exportAsExcelFile(
            items,
            this.tableConfig,
            `${this.exportFilePrefix}-teams`
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

import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    signal,
    Signal,
    OnInit,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { map, tap } from 'rxjs';
import SweetAlert from 'sweetalert2';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { FilterField } from '@shared/components/filter/filter.types';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableHeaderButton } from '@shared/components/table-button-header/table-button-header.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { Roles } from '@shared/domain/enums/roles.enum';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';

import { ParticipantsSelectFacade } from '@presentation/pages/team-organization/application/services/participants/participants-select.facade';
import { TeamsParticipantsFacade } from '@presentation/pages/team-organization/application/services/teams/teams-participants.facade';
import { TeamsSelectFacade } from '@presentation/pages/team-organization/application/services/teams/teams-select.facade';
import { TEAMS_PARTICIPANTS_TABLE_CONSTANT } from '@presentation/pages/team-organization/domain/constants/teams/teams-participants-table.constant';
import { TeamsParticipantsFilterControl } from '@presentation/pages/team-organization/domain/controls/teams/teams-participants-filter.control';
import { TeamsParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants.entity';
import { TeamsParticipantsFormHelperService } from '@presentation/pages/team-organization/presentation/teams/teams-participants/teams-participants-helper.service';

@Component({
    selector: 'app-teams-participants',
    standalone: true,
    templateUrl: './teams-participants.component.html',
    styleUrls: ['./teams-participants.component.scss'],
    imports: [
        CommonModule,
        PageTitleComponent,
        BreadcrumbComponent,
        FilterComponent,
        TableComponent,
        PaginationComponent,
        TranslateModule,
        ButtonModule,
        TagModule,
        SelectModule,
        ReactiveFormsModule,
        DialogModule,
        MultiSelectModule,
    ],
    providers: [TeamsParticipantsFormHelperService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsParticipantsComponent implements OnInit {
    private readonly title = inject(Title);
    public readonly facade = inject(TeamsParticipantsFacade);
    public readonly teamsSelectFacade = inject(TeamsSelectFacade);
    public readonly participantsSelectFacade = inject(ParticipantsSelectFacade);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);
    private readonly translate = inject(TranslateService);
    private readonly toast = inject(ToastrService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly exportService = inject(TableExportExcelFileService);
    private readonly appConfig = inject(AppCustomizationService);
    private readonly helperService = inject(TeamsParticipantsFormHelperService);
    private readonly currentLang = signal<string>(
        this.translate.getCurrentLang()
    );
    public readonly tableConfig = TEAMS_PARTICIPANTS_TABLE_CONSTANT;

    readonly items = toSignal(this.facade.items$, {
        initialValue: [],
    });
    readonly loading = toSignal(this.facade.isLoading$, {
        initialValue: false,
    });
    readonly pagination = toSignal(this.facade.pagination$, {
        initialValue: null,
    });
    readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });
    readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appConfig.config.app.name
    );

    readonly teams = toSignal(this.teamsSelectFacade.items$, {
        initialValue: [],
    });
    readonly loadingTeams = toSignal(this.teamsSelectFacade.isLoading$, {
        initialValue: false,
    });
    readonly participants = toSignal(this.participantsSelectFacade.items$, {
        initialValue: [],
    });
    readonly loadingParticipants = toSignal(
        this.participantsSelectFacade.isLoading$,
        {
            initialValue: false,
        }
    );

    public readonly displayReassignModal = signal<boolean>(false);
    private readonly openReassignRequested = signal(false);

    public readonly displayAssignModal = signal<boolean>(false);
    private readonly openAssignRequested = signal(false);

    private readonly formStateEffect = effect(() => {
        const state = this.facade.actionState();

        switch (state) {
            case 'loading':
                this.reassignForm.disable({ emitEvent: false });
                this.assignForm.disable({ emitEvent: false });
                break;

            case 'error':
            case 'idle':
                this.reassignForm.enable({ emitEvent: false });
                this.assignForm.enable({ emitEvent: false });
                break;

            case 'success':
                this.reassignForm.enable({ emitEvent: false });
                this.assignForm.enable({ emitEvent: false });
                this.closeReassignModal();
                this.closeAssignModal();
                break;
        }
    });

    private readonly reassignModalEffect = effect(() => {
        if (!this.openReassignRequested()) {
            return;
        }
        this.reassignForm.reset();
        this.displayReassignModal.set(true);
        this.openReassignRequested.set(false);
    });

    private readonly assignModalEffect = effect(() => {
        if (!this.openAssignRequested()) {
            return;
        }
        this.assignForm.reset();
        this.displayAssignModal.set(true);
        this.openAssignRequested.set(false);
    });

    private readonly langChange = toSignal(
        this.translate.onLangChange.pipe(map((e) => e.lang)),
        { initialValue: this.translate.getCurrentLang() }
    );

    private readonly pageTitleEffect = effect(() => {
        this.langChange();
        this.title.setTitle(
            this.t('TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.PAGE_TITLE')
        );
    });

    public reassignForm: FormGroup = this.fb.group({
        team: [null, [Validators.required]],
    });

    public assignForm: FormGroup = this.fb.group({
        participants: [null, [Validators.required]],
    });

    public readonly participantsSelectedInTable = signal<
        TeamsParticipantsEntity[]
    >([]);

    public readonly headerButtons = computed<TableHeaderButton[]>(() => [
        {
            label: 'COMMON.ASSIGN',
            actionId: 'assign',
            type: 'splitbutton',
            class: 'btn-primary',
            icon: 'pi pi-user-plus',
            translateKey: 'COMMON.ASSIGN',
            items: this.buildAssignMenuItems(),
        },
        {
            label: 'COMMON.REASSIGN',
            actionId: 'reassign',
            class: 'btn-warning',
            icon: 'pi pi-user-edit',
            translateKey: 'COMMON.REASSIGN',
            disabled: this.participantsSelectedInTable().length === 0,
        },
        {
            label: 'COMMON.REMOVE',
            actionId: 'remove',
            class: 'btn-danger',
            icon: 'pi pi-trash',
            translateKey: 'COMMON.REMOVE',
            disabled: this.participantsSelectedInTable().length === 0,
        },
    ]);

    private buildAssignMenuItems(): MenuItem[] {
        return Object.entries(Roles).map(([key, translationKey]) => ({
            label: this.t(translationKey),
            command: () => this.onAssignRoleSelected(key.toLowerCase()),
        }));
    }

    private onAssignRoleSelected(role: string): void {
        this.openAssignRequested.set(true);
        this.participantsSelectFacade.readAll(role);
    }

    private readonly paramsUniqId: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((params: Params) => params['uniqId'])
        ),
        { initialValue: '' }
    );

    public readonly paramsName: Signal<string> = toSignal(
        this.activatedRoute.queryParams.pipe(
            map((params: Params) => params['name'])
        ),
        { initialValue: '' }
    );

    readonly filterFields: Signal<FilterField[]> = computed(() => {
        this.currentLang();

        return [
            {
                type: 'text',
                name: 'search',
                label: this.t(
                    'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.SEARCH'
                ),
                placeholder: this.t(
                    'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.SEARCH_PLACEHOLDER'
                ),
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.SEARCH',
                    placeholder:
                        'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.SEARCH_PLACEHOLDER',
                },
            },
            {
                type: 'text',
                name: 'participantEmail',
                label: this.t(
                    'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.EMAIL'
                ),
                placeholder: this.t(
                    'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.EMAIL_PLACEHOLDER'
                ),
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.EMAIL',
                    placeholder:
                        'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.EMAIL_PLACEHOLDER',
                },
            },
            {
                type: 'text',
                name: 'phone',
                label: this.t(
                    'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.PHONE'
                ),
                placeholder: this.t(
                    'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.PHONE_PLACEHOLDER'
                ),
                translationKeys: {
                    label: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.PHONE',
                    placeholder:
                        'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.FILTER.PHONE_PLACEHOLDER',
                },
            },
        ];
    });

    public form: FormGroup<TeamsParticipantsFilterControl> =
        this.fb.group<TeamsParticipantsFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            participantEmail: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            phone: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
        });

    ngOnInit(): void {
        this.activatedRoute.queryParams
            .pipe(
                map((p) => (p['uniqId'] as string) || ''),
                tap((uniqId) => {
                    this.facade.reset();
                    if (uniqId) {
                        this.facade.readAll({ uniqId }, '1', true);
                    } else {
                        this.form.reset();
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    public onFilter(filterValue: any): void {
        if (!this.paramsUniqId()) {
            return;
        }
        const filter = {
            ...filterValue,
            uniqId: this.paramsUniqId(),
        };
        this.facade.readAll(filter, '1', true);
    }

    public onPageChange(event: number): void {
        if (this.paramsUniqId()) {
            this.facade.changePage(event + 1);
        }
    }

    public onRefresh(): void {
        this.form.reset();
        this.facade.refresh();
        this.participantsSelectedInTable.set([]);
        this.assignForm.reset();
        this.reassignForm.reset();
    }

    public onPageChanged(page: number): void {
        this.facade.changePage(page + 1);
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
            `${this.exportFilePrefix}-teams-participants`
        );
    }

    public onHeaderButtonClicked(actionId: string): void {
        if (actionId === 'reassign') {
            this.openReassignModal();
        } else if (actionId === 'remove') {
            this.onRemoveParticipants();
        }
    }

    public onSelectionChange(
        selection: TeamsParticipantsEntity | TeamsParticipantsEntity[]
    ): void {
        const participants = Array.isArray(selection) ? selection : [selection];
        this.participantsSelectedInTable.set(participants.filter((u) => !!u));
    }

    private openReassignModal(): void {
        this.openReassignRequested.set(true);
        this.teamsSelectFacade.readAll();
    }

    public closeReassignModal(): void {
        this.displayReassignModal.set(false);
        this.reassignForm.reset();
    }

    public closeAssignModal(): void {
        this.displayAssignModal.set(false);
        this.assignForm.reset();
    }

    public onSubmitReassign(): void {
        if (this.reassignForm.invalid || !this.paramsUniqId()) {
            return;
        }
        const { team } = this.reassignForm.getRawValue();
        this.facade.reassign(team, this.participantsSelectedInTable());
    }

    public onSubmitAssign(): void {
        if (this.assignForm.invalid || !this.paramsUniqId()) {
            return;
        }
        const { participants } = this.assignForm.getRawValue();
        this.facade.assign(this.paramsUniqId(), ...participants);
    }

    private onRemoveParticipants(): void {
        if (
            !this.paramsUniqId() ||
            this.participantsSelectedInTable().length === 0
        ) {
            return;
        }

        const title = this.helperService.getSweetAlertTitle();
        const message = this.helperService.getSweetAlertMessage();

        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(title),
            text: this.translate.instant(message),
            backdrop: false,
            confirmButtonText: this.translate.instant('COMMON.CONFIRM'),
            cancelButtonText: this.translate.instant('COMMON.CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.facade.remove(
                    this.paramsUniqId(),
                    this.participantsSelectedInTable()
                );
            }
        });
    }

    private t(key: string, params?: object) {
        return this.translate.instant(key, params);
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

    onCancel(): void {
        this.helperService.navigateToTeamsList();
    }
}

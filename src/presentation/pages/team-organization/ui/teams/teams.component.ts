import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TeamFacade } from '@presentation/pages/team-organization/application/team.facade';
import { Team } from '@presentation/pages/team-organization/domain/entities/team.entity';
import {
    TeamFilter,
    TeamFilterInterface,
} from '@presentation/pages/team-organization/domain/value-objects/team-filter.vo';
import { FilterTeamComponent } from '@presentation/pages/team-organization/feature/teams/filter-team/filter-team.component';
import { TableTeamComponent } from '@presentation/pages/team-organization/feature/teams/table-team/table-team.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SWEET_ALERT_PARAMS } from '@shared/constants/swalWithBootstrapButtonsParams.constant';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import SweetAlert from 'sweetalert2';
import {
    FORM_ROUTE,
    MANAGEMENT_AFFECTED_ROUTE,
} from '../../team-organization.routes';

@Component({
    selector: 'app-teams',
    standalone: true,
    templateUrl: './teams.component.html',
    styleUrls: ['./teams.component.scss'],
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterTeamComponent,
        TableTeamComponent,
        PageTitleComponent,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly translate = inject(TranslateService);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    public module!: string;
    public subModule!: string;
    public teams$!: Observable<Team[]>;
    public teamsCount$!: Observable<number>;
    public spinner$!: Observable<boolean>;
    public filterData: TeamFilterInterface =
        TeamFilter.create().toDto() as TeamFilterInterface;
    private readonly destroy$ = new Subject<void>();

    constructor(private readonly teamFacade: TeamFacade) {}

    ngOnInit(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'TEAM_ORGANIZATION.TEAM.TITLE'
                );
                this.module = data['module'] ?? 'TEAM_ORGANIZATION.LABEL';
                this.subModule =
                    data['subModule'] ?? 'TEAM_ORGANIZATION.TEAM.LABEL';
            });

        this.teams$ = this.teamFacade.teams$;
        this.spinner$ = this.teamFacade.isLoading$;
        this.teamsCount$ = this.teams$.pipe(map((teams) => teams?.length ?? 0));

        this.teamFacade.currentFilter$
            .pipe(takeUntil(this.destroy$))
            .subscribe((lastFilter) => {
                if (lastFilter) {
                    this.filterData = lastFilter.toDto() as TeamFilterInterface;
                    const filter = TeamFilter.create(this.filterData);
                    //this.teamFacade.fetchTeams(filter);
                }
            });

        //const defaultFilter = TeamFilter.create();
        //this.teamFacade.fetchTeams(defaultFilter);
    }

    public filter(filterData: TeamFilterInterface): void {
        this.filterData = { ...filterData };
        const filter = TeamFilter.create(this.filterData);
        this.teamFacade.fetchTeams(filter);
    }

    public refreshTeams(): void {
        this.teamFacade.refresh();
    }

    public handleAddTeam(): void {
        this.router.navigate([FORM_ROUTE], {
            relativeTo: this.activatedRoute,
        });
    }

    public handleTeam(event: {
        team?: Team;
        action:
            | 'view'
            | 'edit'
            | 'delete'
            | 'enable'
            | 'disable'
            | 'tenants'
            | 'participants';
    }): void {
        const { team, action } = event;

        if (!team) {
            this.navigateToForm(null, 'add');
            return;
        }

        switch (action) {
            case 'view':
                this.navigateToForm(team.id, action);
                break;
            case 'edit':
                this.navigateToForm(team.id, action);
                break;
            case 'tenants':
                this.navigateToManagement(team.id, action);
                break;
            case 'participants':
                this.navigateToManagement(team.id, action);
                break;
            case 'enable':
                this.confirmEnableTeam(team);
                break;
            case 'disable':
                this.confirmDisableTeam(team);
                break;
            case 'delete':
                this.confirmDeleteTeam(team);
                break;
        }
    }

    private navigateToForm(
        id: string | null,
        ref: 'add' | 'edit' | 'view'
    ): void {
        if (ref === 'add') {
            this.router.navigate([FORM_ROUTE], {
                relativeTo: this.activatedRoute,
            });
            return;
        }
        this.router.navigate([FORM_ROUTE], {
            relativeTo: this.activatedRoute,
            queryParams: { id, ref },
        });
    }

    private navigateToManagement(
        id: string,
        ref: 'tenants' | 'participants'
    ): void {
        this.router.navigate([id, MANAGEMENT_AFFECTED_ROUTE], {
            relativeTo: this.activatedRoute,
            queryParams: {
                ref,
            },
        });
    }

    private confirmEnableTeam(team: Team): void {
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'TEAM_ORGANIZATION.TEAM.CONFIRM.ENABLE_TITLE'
            ),
            text: this.translate.instant(
                'TEAM_ORGANIZATION.TEAM.CONFIRM.ENABLE_MESSAGE',
                { name: team.nom }
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('ENABLE'),
            cancelButtonText: this.translate.instant('CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.teamFacade
                    .enableTeam(team.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        error: () => {
                            // handled in facade
                        },
                    });
            }
        });
    }

    private confirmDisableTeam(team: Team): void {
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'TEAM_ORGANIZATION.TEAM.CONFIRM.DISABLE_TITLE'
            ),
            text: this.translate.instant(
                'TEAM_ORGANIZATION.TEAM.CONFIRM.DISABLE_MESSAGE',
                { name: team.nom }
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant(
                'TEAM_ORGANIZATION.TEAM.ACTIONS.DISABLE'
            ),
            cancelButtonText: this.translate.instant('CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.teamFacade
                    .disableTeam(team.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        error: () => {
                            // handled in facade
                        },
                    });
            }
        });
    }

    private confirmDeleteTeam(team: Team): void {
        SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: this.translate.instant(
                'TEAM_ORGANIZATION.TEAM.CONFIRM.DELETE_TITLE'
            ),
            text: this.translate.instant(
                'TEAM_ORGANIZATION.TEAM.CONFIRM.DELETE_MESSAGE',
                { name: team.nom }
            ),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('DELETE'),
            cancelButtonText: this.translate.instant('CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.teamFacade
                    .deleteTeam(team.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        error: () => {
                            // handled in facade
                        },
                    });
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

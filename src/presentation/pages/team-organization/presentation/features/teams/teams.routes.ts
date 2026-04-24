import { Routes } from '@angular/router';
import { TeamsFormComponent } from '@presentation/pages/team-organization/presentation/features/teams/teams-form/teams-form.component';
import { TeamsListComponent } from '@presentation/pages/team-organization/presentation/features/teams/teams-list/teams-list.component';
import { TeamsPageComponent } from '@presentation/pages/team-organization/presentation/features/teams/teams-page/teams-page.component';
import { TeamsParticipantsComponent } from '@presentation/pages/team-organization/presentation/features/teams/teams-participants/teams-participants.component';
import {
    TEAMS_HISTORY,
    TEAMS_FORM,
    TEAMS_USERS,
    TEAMS_LIST,
} from '@presentation/pages/team-organization/presentation/features/teams/teams-paths.constant';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

export const TEAMS_ROUTES: Routes = [
    {
        path: '',
        component: TeamsPageComponent,
        data: {
            icon: 'TEAM_ORGANIZATION.TEAMS.TITLE',
            breadcrumb: 'TEAM_ORGANIZATION.TEAMS.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: TEAMS_LIST,
            },
            {
                path: TEAMS_LIST,
                component: TeamsListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: TEAMS_HISTORY,
                component: HistoryPageComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${TEAMS_FORM}`,
        data: {
            icon: 'TEAM_ORGANIZATION.TEAMS.TITLE',
            breadcrumb: 'TEAM_ORGANIZATION.TEAMS.TITLE',
        },
        children: [
            {
                path: '',
                component: TeamsFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${TEAMS_USERS}`,
        data: {
            icon: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.TITLE',
            breadcrumb: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.TITLE',
        },
        children: [
            {
                path: '',
                component: TeamsParticipantsComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];

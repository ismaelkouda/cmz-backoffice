import { Routes } from '@angular/router';
import { TeamsFormComponent } from '@presentation/pages/team-organization/presentation/features/teams/teams-form/teams-form.component';
import { TeamsListComponent } from '@presentation/pages/team-organization/presentation/features/teams/teams-list/teams-list.component';
import { TeamsPageComponent } from '@presentation/pages/team-organization/presentation/features/teams/teams-page/teams-page.component';
import { HistoryComponent } from '@shared/components/history/history.component';

import { TeamsParticipantsComponent } from './teams-participants/teams-participants.component';

export const TEAMS_LIST = 'list';
export const TEAMS_FORM = 'form';
export const TEAMS_HISTORY = 'history';
export const TEAMS_USERS = 'teams-users';

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
                component: TeamsListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: TEAMS_HISTORY,
                component: HistoryComponent,
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

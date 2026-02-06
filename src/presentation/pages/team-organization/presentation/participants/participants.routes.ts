import { Routes } from '@angular/router';

import { HistoryComponent } from '@shared/components/history/history.component';

import { ParticipantsFormComponent } from '@presentation/pages/team-organization/presentation/participants/participants-form/participants-form.component';
import { ParticipantsListComponent } from '@presentation/pages/team-organization/presentation/participants/participants-list/participants-list.component';
import { ParticipantsPageComponent } from '@presentation/pages/team-organization/presentation/participants/participants-page/participants-page.component';

export const PARTICIPANTS_LIST = 'list';
export const PARTICIPANTS_FORM = 'form';
export const PARTICIPANTS_HISTORY = 'history';

export const PARTICIPANTS_ROUTES: Routes = [
    {
        path: '',
        component: ParticipantsPageComponent,
        data: {
            title: 'TEAM_ORGANIZATION.PARTICIPANTS.TITLE',
            breadcrumb: 'TEAM_ORGANIZATION.PARTICIPANTS.TITLE',
        },
        children: [
            {
                path: '',
                component: ParticipantsListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: PARTICIPANTS_HISTORY,
                component: HistoryComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${PARTICIPANTS_FORM}`,
        data: {
            title: 'TEAM_ORGANIZATION.PARTICIPANTS.FORM.TITLE',
            breadcrumb: 'TEAM_ORGANIZATION.PARTICIPANTS.FORM.TITLE',
        },
        children: [
            {
                path: '',
                component: ParticipantsFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];

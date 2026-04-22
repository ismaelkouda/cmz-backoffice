import { Routes } from '@angular/router';
import { ParticipantsFormComponent } from '@presentation/pages/team-organization/presentation/features/participants/participants-form/participants-form.component';
import { ParticipantsListComponent } from '@presentation/pages/team-organization/presentation/features/participants/participants-list/participants-list.component';
import { ParticipantsPageComponent } from '@presentation/pages/team-organization/presentation/features/participants/participants-page/participants-page.component';
import {
    PARTICIPANTS_FORM,
    PARTICIPANTS_HISTORY,
    PARTICIPANTS_LIST,
} from '@presentation/pages/team-organization/presentation/features/participants/participants-paths.constants';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

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
                pathMatch: 'full',
                redirectTo: PARTICIPANTS_LIST,
            },
            {
                path: PARTICIPANTS_LIST,
                component: ParticipantsListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: PARTICIPANTS_HISTORY,
                component: HistoryPageComponent,
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

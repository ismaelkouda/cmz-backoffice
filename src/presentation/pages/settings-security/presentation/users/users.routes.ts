import { Routes } from '@angular/router';
import { UsersFormComponent } from '@pages/settings-security/presentation/users/users-form/users-form.component';
import { UsersListComponent } from '@pages/settings-security/presentation/users/users-list/users-list.component';
import { UsersPageComponent } from '@pages/settings-security/presentation/users/users-page/users-page.component';
import {
    USERS_FORM,
    USERS_LIST,
    USERS_HISTORY,
} from '@pages/settings-security/presentation/users/users-paths.constants';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

export const USERS_ROUTES: Routes = [
    {
        path: '',
        component: UsersPageComponent,
        data: {
            title: 'CONTENT_MANAGEMENT.USERS.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.USERS.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: USERS_LIST,
            },
            {
                path: USERS_LIST,
                component: UsersListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: USERS_HISTORY,
                component: HistoryPageComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: USERS_FORM,
        component: UsersFormComponent,
        data: {
            title: 'CONTENT_MANAGEMENT.USERS.FORM.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.USERS.FORM.TITLE',
        },
    },
];

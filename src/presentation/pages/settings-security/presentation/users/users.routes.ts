import { Routes } from '@angular/router';

import { UsersFormComponent } from '@presentation/pages/settings-security/presentation/users/users-form/users-form.component';
import { UsersListComponent } from '@presentation/pages/settings-security/presentation/users/users-list/users-list.component';
import { UsersPageComponent } from '@presentation/pages/settings-security/presentation/users/users-page/users-page.component';

export const USERS_FORM = 'form';
export const USERS_LIST = 'list';
export const USERS_HISTORY = 'history?ref=users';

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
                component: UsersListComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    // {
    //     path: `${USERS_HISTORY}`,
    //     data: {
    //         title: 'CONTENT_MANAGEMENT.USERS.HISTORY.TITLE',
    //         breadcrumb: 'CONTENT_MANAGEMENT.USERS.HISTORY.TITLE',
    //     },
    //     children: [
    //         {
    //             path: '',
    //             component: HistoryComponent,
    //             data: { breadcrumb: { hide: true } },
    //         },
    //     ],
    // },
    {
        path: `${USERS_FORM}`,
        data: {
            title: 'CONTENT_MANAGEMENT.USERS.FORM.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.USERS.FORM.TITLE',
        },
        children: [
            {
                path: '',
                component: UsersFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];

import { Routes } from '@angular/router';

import { HistoryComponent } from '@shared/components/history/history.component';

import { ProfilesPermissionsFormComponent } from '@presentation/pages/settings-security/presentation/profiles-permissions/profiles-permissions-form/profiles-permissions-form.component';
import { ProfilesPermissionsListComponent } from '@presentation/pages/settings-security/presentation/profiles-permissions/profiles-permissions-list/profiles-permissions-list.component';
import { ProfilesPermissionsPageComponent } from '@presentation/pages/settings-security/presentation/profiles-permissions/profiles-permissions-page/profiles-permissions-page.component';
import { ProfilesPermissionsUsersComponent } from '@presentation/pages/settings-security/presentation/profiles-permissions/profiles-permissions-users/profiles-permissions-users.component';

export const PROFILES_PERMISSIONS_LIST = 'list';
export const PROFILES_PERMISSIONS_FORM = 'form';
export const PROFILES_PERMISSIONS_HISTORY = 'history';
export const PROFILES_PERMISSIONS_USERS = 'users';

export const PROFILES_PERMISSIONS_ROUTES: Routes = [
    {
        path: '',
        component: ProfilesPermissionsPageComponent,
        data: {
            icon: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TITLE',
            breadcrumb: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TITLE',
        },
        children: [
            {
                path: '',
                component: ProfilesPermissionsListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: PROFILES_PERMISSIONS_HISTORY,
                component: HistoryComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${PROFILES_PERMISSIONS_FORM}`,
        data: {
            icon: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TITLE',
            breadcrumb: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TITLE',
        },
        children: [
            {
                path: '',
                component: ProfilesPermissionsFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${PROFILES_PERMISSIONS_USERS}`,
        data: {
            icon: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.USERS.TITLE',
            breadcrumb: 'SETTINGS_SECURITY.PROFILES_PERMISSIONS.USERS.TITLE',
        },
        children: [
            {
                path: '',
                component: ProfilesPermissionsUsersComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];

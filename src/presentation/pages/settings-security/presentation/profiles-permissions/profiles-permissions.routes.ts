import { Routes } from '@angular/router';
import { ProfilesPermissionsFormComponent } from '@pages/settings-security/presentation/profiles-permissions/profiles-permissions-form/profiles-permissions-form.component';
import { ProfilesPermissionsListComponent } from '@pages/settings-security/presentation/profiles-permissions/profiles-permissions-list/profiles-permissions-list.component';
import { ProfilesPermissionsPageComponent } from '@pages/settings-security/presentation/profiles-permissions/profiles-permissions-page/profiles-permissions-page.component';
import {
    PROFILES_PERMISSIONS_FORM,
    PROFILES_PERMISSIONS_LIST,
    PROFILES_PERMISSIONS_HISTORY,
    PROFILES_PERMISSIONS_USERS,
} from '@pages/settings-security/presentation/profiles-permissions/profiles-permissions-paths.constant';
import { ProfilesPermissionsUsersComponent } from '@pages/settings-security/presentation/profiles-permissions/profiles-permissions-users/profiles-permissions-users.component';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

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
                pathMatch: 'full',
                redirectTo: PROFILES_PERMISSIONS_LIST,
            },
            {
                path: PROFILES_PERMISSIONS_LIST,
                component: ProfilesPermissionsListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: PROFILES_PERMISSIONS_HISTORY,
                component: HistoryPageComponent,
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

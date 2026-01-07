/* import { Routes } from '@angular/router';
import { FormProfileHabilitationComponent } from './feature/profile-habilitation/form-profile-habilitation/form-profile-habilitation.component';
import { FormUserComponent } from './feature/user/form-user/form-user.component';
import { AccessLogsComponent } from './ui/access-logs/access-logs.component';
import { ProfileHabilitationComponent } from './ui/profile-habilitation/profile-habilitation.component';
import { ProfileUsersAssignComponent } from './ui/profile-users-assign/profile-users-assign.component';
import { ProfileUsersComponent } from './ui/profile-users/profile-users.component';
import { UsersComponent } from './ui/users/users.component';

export const PROFILE_HABILITATION_ROUTE = 'permission-profiles';
export const USER_ROUTE = 'users';
export const ACCESS_LOGS_ROUTE = 'access-logs';
export const USER_FORM_ROUTE = 'form';
export const PROFILE_FORM_ROUTE = 'form';
export const PROFILE_USERS_ROUTE = 'users';
export const PROFILE_USERS_ASSIGN_ROUTE = 'assign';

export const routes: Routes = [
    {
        path: PROFILE_HABILITATION_ROUTE,
        children: [
            {
                path: '',
                component: ProfileHabilitationComponent,
                data: {
                    title: 'SETTINGS_SECURITY.PROFILE_HABILITATION.TITLE',
                    module: 'SETTINGS_SECURITY.LABEL',
                    subModule: 'SETTINGS_SECURITY.PROFILE_HABILITATION.LABEL',
                },
            },
            {
                path: PROFILE_FORM_ROUTE,
                component: FormProfileHabilitationComponent,
                data: {
                    title: 'SETTINGS_SECURITY.PROFILE_HABILITATION.FORM.CREATE_TITLE',
                    module: 'SETTINGS_SECURITY.LABEL',
                    subModule: 'SETTINGS_SECURITY.PROFILE_HABILITATION.LABEL',
                },
            },
            {
                path: `${PROFILE_FORM_ROUTE}/:id`,
                component: FormProfileHabilitationComponent,
                data: {
                    title: 'SETTINGS_SECURITY.PROFILE_HABILITATION.FORM.EDIT_TITLE',
                    module: 'SETTINGS_SECURITY.LABEL',
                    subModule: 'SETTINGS_SECURITY.PROFILE_HABILITATION.LABEL',
                },
            },
            {
                path: `:id/${PROFILE_USERS_ROUTE}`,
                component: ProfileUsersComponent,
                data: {
                    title: 'SETTINGS_SECURITY.PROFILE_HABILITATION.USERS.TITLE',
                    module: 'SETTINGS_SECURITY.LABEL',
                    subModule: 'SETTINGS_SECURITY.PROFILE_HABILITATION.LABEL',
                },
            },
            {
                path: `:id/${PROFILE_USERS_ROUTE}/${PROFILE_USERS_ASSIGN_ROUTE}`,
                component: ProfileUsersAssignComponent,
                data: {
                    title: 'SETTINGS_SECURITY.PROFILE_HABILITATION.ASSIGN.TITLE',
                    module: 'SETTINGS_SECURITY.LABEL',
                    subModule: 'SETTINGS_SECURITY.PROFILE_HABILITATION.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: USER_ROUTE,
        children: [
            {
                path: '',
                component: UsersComponent,
                data: {
                    title: 'SETTINGS_SECURITY.TITLE',
                    module: 'SETTINGS_SECURITY.LABEL',
                    subModule: 'SETTINGS_SECURITY.USER.LABEL',
                },
            },
            {
                path: USER_FORM_ROUTE,
                component: FormUserComponent,
                data: {
                    title: 'SETTINGS_SECURITY.USER.FORM.CREATE_TITLE',
                    module: 'SETTINGS_SECURITY.LABEL',
                    subModule: 'SETTINGS_SECURITY.USER.LABEL',
                },
            },
            {
                path: `${USER_FORM_ROUTE}/:id`,
                component: FormUserComponent,
                data: {
                    title: 'SETTINGS_SECURITY.USER.FORM.EDIT_TITLE',
                    module: 'SETTINGS_SECURITY.LABEL',
                    subModule: 'SETTINGS_SECURITY.USER.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: ACCESS_LOGS_ROUTE,
        component: AccessLogsComponent,
        data: {
            title: 'SETTINGS_SECURITY.ACCESS_LOGS.TITLE',
            module: 'SETTINGS_SECURITY.LABEL',
            subModule: 'SETTINGS_SECURITY.ACCESS_LOGS.LABEL',
        },
    },
    {
        path: '',
        redirectTo: PROFILE_HABILITATION_ROUTE,
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: PROFILE_HABILITATION_ROUTE,
    },
];
 */

import { Routes } from '@angular/router';

import { HistoryComponent } from '@shared/components/history/history.component';

import { ProfilsHabilitationsListComponent } from '@presentation/pages/settings-security/presentation/profils-habilitations/profils-habilitations-list/profils-habilitations-list.component';
import { ProfilsHabilitationsPageComponent } from '@presentation/pages/settings-security/presentation/profils-habilitations/profils-habilitations-page/profils-habilitations-page.component';

import { ProfilsHabilitationsFormComponent } from './profils-habilitations-form/profils-habilitations-form.component';

export const PROFILES_HABILITATIONS_LIST = 'list';
export const PROFILES_HABILITATIONS_FORM = 'form';
export const PROFILES_HABILITATIONS_HISTORY = 'history';
export const PROFILES_HABILITATIONS_USERS_ROUTE = 'profils-habilitations-users';

export const PROFILES_HABILITATIONS_ROUTES: Routes = [
    {
        path: '',
        component: ProfilsHabilitationsPageComponent,
        data: {
            icon: 'CONTENT_MANAGEMENT.PROFILES_HABILITATIONS.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.PROFILES_HABILITATIONS.TITLE',
        },
        children: [
            {
                path: '',
                redirectTo: PROFILES_HABILITATIONS_LIST,
                pathMatch: 'full',
            },
            {
                path: PROFILES_HABILITATIONS_LIST,
                component: ProfilsHabilitationsListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: PROFILES_HABILITATIONS_HISTORY,
                component: HistoryComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${PROFILES_HABILITATIONS_FORM}`,
        data: {
            icon: 'CONTENT_MANAGEMENT.PROFILES_HABILITATIONS.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.PROFILES_HABILITATIONS.TITLE',
        },
        children: [
            {
                path: '',
                component: ProfilsHabilitationsFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];

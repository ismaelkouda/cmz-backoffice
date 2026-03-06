import { Routes } from '@angular/router';

import { HomeFormComponent } from '@presentation/pages/content-management/presentation/features/home/home-form/home-form.component';
import { HomePageComponent } from '@presentation/pages/content-management/presentation/features/home/home-page/home-page.component';

export const HOME_FORM = 'form';

export const HOME_ROUTES: Routes = [
    {
        path: '',
        data: {
            title: 'CONTENT_MANAGEMENT.HOME.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.HOME.TITLE',
        },
        children: [
            {
                path: '',
                component: HomePageComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${HOME_FORM}`,
        data: {
            title: 'CONTENT_MANAGEMENT.HOME.FORM.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.HOME.FORM.TITLE',
        },
        children: [
            {
                path: '',
                component: HomeFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];

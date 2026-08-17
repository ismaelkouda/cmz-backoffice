import { Routes } from '@angular/router';

import {
    SITE_GROUP_FORM,
    SITE_GROUP_LIST,
    SITE_GROUP_HISTORY,
} from '@pages/coverage-areas/presentation/features/site-group/site-group-paths.constants';

export const SITE_GROUP_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@pages/coverage-areas/presentation/features/site-group/site-group-page/site-group-page.component').then(
                (m) => m.SiteGroupPageComponent
            ),
        data: {
            title: 'COVERAGE_AREAS.SITE_GROUP.TITLE',
            breadcrumb: 'COVERAGE_AREAS.SITE_GROUP.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: SITE_GROUP_LIST,
            },
            {
                path: SITE_GROUP_LIST,
                loadComponent: () =>
                    import('@pages/coverage-areas/presentation/features/site-group/site-group-list/site-group-list.component').then(
                        (m) => m.SiteGroupListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: SITE_GROUP_HISTORY,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: SITE_GROUP_FORM,
        loadComponent: () =>
            import('@pages/coverage-areas/presentation/features/site-group/site-group-form/site-group-form.component').then(
                (m) => m.SiteGroupFormComponent
            ),
        data: {
            title: 'COVERAGE_AREAS.SITE_GROUP.FORM.TITLE',
            breadcrumb: 'COVERAGE_AREAS.SITE_GROUP.FORM.TITLE',
        },
    },
];

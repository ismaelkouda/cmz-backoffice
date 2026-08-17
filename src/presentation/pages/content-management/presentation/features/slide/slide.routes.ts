import { Routes } from '@angular/router';

import {
    SLIDE_LIST_ROUTE,
    SLIDE_HISTORY_ROUTE,
    SLIDE_FORM_ROUTE,
} from '@pages/content-management/presentation/features/slide/slide-paths.constants';

export const SLIDE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@presentation/pages/content-management/presentation/features/slide/slide-page/slide-page.component').then(
                (m) => m.SlidePageComponent
            ),
        data: {
            title: 'CONTENT_MANAGEMENT.SLIDE.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.SLIDE.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: SLIDE_LIST_ROUTE,
            },
            {
                path: SLIDE_LIST_ROUTE,
                loadComponent: () =>
                    import('@presentation/pages/content-management/presentation/features/slide/slide-list/slide-list.component').then(
                        (m) => m.SlideListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: SLIDE_HISTORY_ROUTE,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${SLIDE_FORM_ROUTE}`,
        data: {
            title: 'CONTENT_MANAGEMENT.SLIDE.FORM.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.SLIDE.FORM.TITLE',
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@pages/content-management/presentation/features/slide/slide-form/slide-form.component').then(
                        (m) => m.SlideFormComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];

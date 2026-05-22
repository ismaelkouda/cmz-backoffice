import { Routes } from '@angular/router';
import { SlideFormComponent } from '@pages/content-management/presentation/features/slide/slide-form/slide-form.component';
import {
    SLIDE_LIST_ROUTE,
    SLIDE_HISTORY_ROUTE,
    SLIDE_FORM_ROUTE,
} from '@pages/content-management/presentation/features/slide/slide-paths.constants';
import { SlideListComponent } from '@presentation/pages/content-management/presentation/features/slide/slide-list/slide-list.component';
import { SlidePageComponent } from '@presentation/pages/content-management/presentation/features/slide/slide-page/slide-page.component';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

export const SLIDE_ROUTES: Routes = [
    {
        path: '',
        component: SlidePageComponent,
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
                component: SlideListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: SLIDE_HISTORY_ROUTE,
                component: HistoryPageComponent,
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
                component: SlideFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];

import { Routes } from '@angular/router';
import { SlideFormComponent } from '@pages/content-management/presentation/features/slide/slide-form/slide-form.component';
import { SlidePageComponent } from '@pages/content-management/presentation/features/slide/slide-page/slide-page.component';

export const SLIDE_FORM = 'form';

export const SLIDE_ROUTES: Routes = [
    {
        path: '',
        data: {
            title: 'CONTENT_MANAGEMENT.SLIDE.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.SLIDE.TITLE',
        },
        children: [
            {
                path: '',
                component: SlidePageComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${SLIDE_FORM}`,
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

import { Routes } from '@angular/router';
import { FormSlideComponent } from './form-slide/form-slide.component';
import { SlideComponent } from './pages/slide.component';

export const SLIDE_CREATE_ROUTE = 'create';
export const SLIDE_EDIT_ROUTE = ':id/edit';
export const SLIDE_VIEW_ROUTE = ':id/view';

export const SLIDE_ROUTES: Routes = [
    {
        path: '',
        component: SlideComponent,
        data: {
            title: 'CONTENT_MANAGEMENT.SLIDE.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.SLIDE.TITLE',
        },
    },
    {
        path: SLIDE_CREATE_ROUTE,
        component: FormSlideComponent,
        data: {
            title: 'CONTENT_MANAGEMENT.SLIDE.CREATE.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.SLIDE.CREATE.TITLE',
        },
    },
    {
        path: SLIDE_EDIT_ROUTE,
        component: FormSlideComponent,
        data: {
            title: 'CONTENT_MANAGEMENT.SLIDE.EDIT.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.SLIDE.EDIT.TITLE',
        },
    },
    /* {
        path: SLIDE_VIEW_ROUTE,
        component: ViewSlideComponent,
        data: {
            title: 'CONTENT_MANAGEMENT.SLIDE.VIEW.TITLE',
            breadcrumb: 'CONTENT_MANAGEMENT.SLIDE.VIEW.TITLE',
        },
    } */
];

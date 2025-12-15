import { Routes } from '@angular/router';


export const CREATE_ROUTE = 'create';
export const EDIT_ROUTE = 'edit';
export const VIEW_ROUTE = 'view';

export const LEGAL_NOTICE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/legal-notice.component').then(m => m.LegalNoticeComponent),
    },
    {
        path: CREATE_ROUTE,
        loadComponent: () => import('./form-legal-notice/form-legal-notice.component').then(m => m.FormLegalNoticeComponent),
    },
    {
        path: `:id/${EDIT_ROUTE}`,
        loadComponent: () => import('./form-legal-notice/form-legal-notice.component').then(m => m.FormLegalNoticeComponent),
    }
];

import { Routes } from '@angular/router';

export const CREATE_ROUTE = 'create';
export const EDIT_ROUTE = 'edit';
export const VIEW_ROUTE = 'view';

export const TERMS_USE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/terms-use.component').then(m => m.TermsUseComponent),
    },
    {
        path: CREATE_ROUTE,
        loadComponent: () => import('./form-terms-use/form-terms-use.component').then(m => m.FormTermsUseComponent),
    },
    {
        path: `:id/${EDIT_ROUTE}`,
        loadComponent: () => import('./form-terms-use/form-terms-use.component').then(m => m.FormTermsUseComponent),
    }
];

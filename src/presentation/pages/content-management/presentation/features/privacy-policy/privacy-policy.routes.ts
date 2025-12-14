import { Routes } from '@angular/router';


export const CREATE_ROUTE = 'create';
export const EDIT_ROUTE = 'edit';
export const VIEW_ROUTE = 'view';

export const PRIVACY_POLICY_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
    },
    {
        path: CREATE_ROUTE,
        loadComponent: () => import('./form-privacy-policy/form-privacy-policy.component').then(m => m.FormPrivacyPolicyComponent),
    },
    {
        path: `:id/${EDIT_ROUTE}`,
        loadComponent: () => import('./form-privacy-policy/form-privacy-policy.component').then(m => m.FormPrivacyPolicyComponent),
    }
];

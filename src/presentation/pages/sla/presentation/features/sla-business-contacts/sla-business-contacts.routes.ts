import { Routes } from '@angular/router';
import { SLA_BUSINESS_CONTACTS_MANAGEMENT_ROUTE } from './sla-business-contacts-paths.constants';

export const SLA_BUSINESS_CONTACTS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./sla-business-contacts-page.component').then(
                (m) => m.SlaBusinessContactsPageComponent
            ),
        data: {
            title: 'SLA.BUSINESS_CONTACTS.TITLE',
            breadcrumb: 'SLA.BUSINESS_CONTACTS.TITLE',
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./sla-business-contacts-list.component').then(
                        (m) => m.SlaBusinessContactsListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: SLA_BUSINESS_CONTACTS_MANAGEMENT_ROUTE,
                loadComponent: () =>
                    import('./sla-business-contacts-management.component').then(
                        (m) => m.SlaBusinessContactsManagementComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];

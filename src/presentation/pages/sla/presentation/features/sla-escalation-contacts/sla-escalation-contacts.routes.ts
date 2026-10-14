import { Routes } from '@angular/router';
import {
    SLA_ESCALATION_CONTACT_FORM_ROUTE,
    SLA_ESCALATION_CONTACT_HISTORY_ROUTE,
    SLA_ESCALATION_CONTACT_LIST_ROUTE,
} from './sla-escalation-contacts-paths.constants';

export const SLA_ESCALATION_CONTACT_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./sla-escalation-contacts-page.component').then(
                (m) => m.SlaEscalationContactsPageComponent
            ),
        data: { title: 'SLA.ESCALATION_CONTACTS.TITLE' },
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: SLA_ESCALATION_CONTACT_LIST_ROUTE,
            },
            {
                path: SLA_ESCALATION_CONTACT_LIST_ROUTE,
                loadComponent: () =>
                    import('./sla-escalation-contacts-list.component').then(
                        (m) => m.SlaEscalationContactsListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: SLA_ESCALATION_CONTACT_HISTORY_ROUTE,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: SLA_ESCALATION_CONTACT_FORM_ROUTE,
        loadComponent: () =>
            import('./sla-escalation-contact-form.component').then(
                (m) => m.SlaEscalationContactFormComponent
            ),
        data: { title: 'SLA.ESCALATION_CONTACTS.FORM.TITLE' },
    },
    {
        path: '**',
        redirectTo: SLA_ESCALATION_CONTACT_LIST_ROUTE,
    },
];

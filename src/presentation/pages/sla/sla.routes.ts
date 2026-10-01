import { Routes } from '@angular/router';

import { SLA_LIST_ROUTE } from '@presentation/pages/sla/presentation/features/sla-list/sla-list-paths.constants';
import { SLA_THRESHOLDS_ROUTE } from '@presentation/pages/sla/presentation/features/sla-thresholds/sla-thresholds-paths.constants';
import { SLA_BUSINESS_CONTACTS_ROUTE } from '@presentation/pages/sla/presentation/features/sla-business-contacts/sla-business-contacts-paths.constants';
import { SLA_ESCALATION_CONTACT_ROUTE } from '@presentation/pages/sla/presentation/features/sla-escalation-contacts/sla-escalation-contacts-paths.constants';

export const routes: Routes = [
    {
        path: SLA_LIST_ROUTE,
        data: {
            breadcrumb: {
                label: 'SLA.SLA_LIST.BREADCRUMB.LABEL',
                icon: 'SLA.SLA_LIST.BREADCRUMB.ICONS',
            },
        },
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('@presentation/pages/sla/presentation/features/sla-list/sla-list.routes').then(
                        (m) => m.SLA_LIST_ROUTES
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: SLA_THRESHOLDS_ROUTE,
        data: {
            breadcrumb: {
                label: 'SLA.THRESHOLDS.BREADCRUMB.LABEL',
                icon: 'SLA.THRESHOLDS.BREADCRUMB.ICONS',
            },
        },
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('@presentation/pages/sla/presentation/features/sla-thresholds/sla-thresholds.routes').then(
                        (m) => m.SLA_THRESHOLDS_ROUTES
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: SLA_BUSINESS_CONTACTS_ROUTE,
        data: {
            breadcrumb: {
                label: 'SLA.BUSINESS_CONTACTS.BREADCRUMB.LABEL',
                icon: 'SLA.BUSINESS_CONTACTS.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('@presentation/pages/sla/presentation/features/sla-business-contacts/sla-business-contacts.routes').then(
                        (m) => m.SLA_BUSINESS_CONTACTS_ROUTES
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
    {
        path: SLA_ESCALATION_CONTACT_ROUTE,
        data: {
            breadcrumb: {
                label: 'SLA.ESCALATION_CONTACTS.BREADCRUMB.LABEL',
                icon: 'SLA.ESCALATION_CONTACTS.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('@presentation/pages/sla/presentation/features/sla-escalation-contacts/sla-escalation-contacts.routes').then(
                        (m) => m.SLA_ESCALATION_CONTACT_ROUTES
                    ),
                data: { breadcrumb: { hide: true } },
            },
            { path: '**', redirectTo: '' },
        ],
    },
];

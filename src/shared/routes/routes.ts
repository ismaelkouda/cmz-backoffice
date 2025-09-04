import { ParameterSecurityModule } from './../../presentation/pages/parameter-security/parameter-security.module';
import { PagesGuard } from './../../core/guard/PagesGuard';
import { Routes } from '@angular/router';
export const SEARCH = 'search';

export const DASHBOARD = 'dashboard';
export const MANAGED_CUSTOMERS = 'managed-customers';
export const REQUESTS_SERVICE = 'requests-services';
export const SUPERVISORY_REPOSITORY = 'sla-reference';
export const PARAMETRE_SECURITE = 'parametre-securite';
export const ACCOUNTING = 'accounting';
export const OVERSEEING_OPERATIONS = 'overseeing-operations';
export const PARAMETER_SECURITY = 'parameter-security';

export const content: Routes = [
    {
        path: DASHBOARD,
        loadChildren: () =>
            import('../../presentation/pages/dashboard/dashboard.module').then(
                (m) => m.DashboardModule
            ),
        data: {
            title: 'Tableau de bord',
        },
    },
    {
        path: MANAGED_CUSTOMERS,
        loadChildren: () =>
            import(
                '../../presentation/pages/managed-customers/managed-customers.module'
            ).then((m) => m.ManagedCustomersModule),
        data: {
            module: 'MANAGED_CUSTOMERS',
            subModule: [
                'COMMERCIAL_ENTERPRISES',
                'PUBLIC_ENTERPRISES',
                'ASSOCIATION_ENTERPRISES',
                'INDIVIDUALS',
            ],
        },
    },
    {
        path: SUPERVISORY_REPOSITORY,
        loadChildren: () =>
            import(
                '../../presentation/pages/supervisory-repository/supervisory-repository.module'
            ).then((m) => m.SupervisoryRepositoryModule),
        data: {
            module: 'SUPERVISORY_REPOSITORY',
            subModule: ['SLA_AGREEMENTS', 'SLA_MANAGEMENT_CONTRACT'],
        },
    },
    {
        path: REQUESTS_SERVICE,
        loadChildren: () =>
            import(
                '../../presentation/pages/requests-service/requests-service.module'
            ).then((m) => m.RequestsServiceModule),
        data: {
            module: 'REQUESTS_SERVICE',
            subModule: ['CUSTOMERS_ACTIVATE'],
        },
    },
    {
        path: OVERSEEING_OPERATIONS,

        loadChildren: () =>
            import(
                '../../presentation/pages/overseeing-operations/overseeing-operations.module'
            ).then((m) => m.OverseeingOperationsModule),
        data: {
            module: 'OVERSEEING_OPERATIONS',
            subModule: [
                'WAITING_QUEUE',
                'TREATMENT_MONITORING',
                'CLAIMS',
                'MY_NOTIFICATIONS',
                'MY_INBOX',
            ],
        },
    },
    {
        path: ACCOUNTING,
        loadChildren: () =>
            import(
                '../../presentation/pages/accounting/accounting.module'
            ).then((m) => m.AccountingModule),
        data: {
            module: 'ACCOUNTING',
            subModule: [
                'MY_ACCOUNT_CREDITS',
                'MY_INVOICES',
                'MY_PAYMENTS',
                'MY_ACCOUNT_STATEMENT',
            ],
        },
    },

    {
        path: PARAMETRE_SECURITE,
        loadChildren: () =>
            import(
                '../../presentation/pages/parameter-security/parameter-security.module'
            ).then((m) => m.ParameterSecurityModule),
        data: {
            module: PARAMETER_SECURITY,
            subModule: ['PROFILES_AUTHORIZATIONS'],
        },
    },

    // {
    //     path: PARAMETRE_SECURITE,
    //     loadChildren: () =>
    //         import(
    //             '../../presentation/pages/parametre-securite/parametre-securite.module'
    //         ).then((m) => m.ParametreSecuriteModule),
    //     data: { title: PARAMETRE_SECURITE },
    // },
    {
        path: '',
        redirectTo: DASHBOARD,
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: DASHBOARD,
    },
];

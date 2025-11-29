import { Routes } from '@angular/router';
export const SEARCH = 'search';

export const DASHBOARD = 'dashboard';
export const REPORTS_PROCESSING_ROUTE = 'reports-processing';
export const REPORT_FINALIZATION_ROUTE = 'reports-finalization';
export const REPORTING_ROUTE = 'reporting';
export const REPORT_REQUESTS_ROUTE = 'requests';
export const CUSTOMERS_MANAGED = 'managed-customers';
export const REQUESTS_SERVICE = 'requests-services';
export const SUPERVISORY_REPOSITORY = 'sla-reference';
export const SETTINGS_SECURITY_ROUTE = 'security-settings';
export const TEAM_ORGANIZATION = 'organization';
export const ACCOUNTING = 'accounting';

export const content: Routes = [
    {
        path: DASHBOARD,
        loadChildren: () =>
            import('../../presentation/pages/dashboard/dashboard.routes').then(
                (m) => m.routes
            ),
        data: {
            module: 'TEAM_ORGANIZATION',
            subModule: [
                'TEAM_ORGANIZATION.PARTICIPANT.LABEL',
                'TEAM_ORGANIZATION.TEAM.LABEL',
                'TEAM_ORGANIZATION.AGENT_IA.LABEL',
            ],
        },
    },
    {
        path: TEAM_ORGANIZATION,
        loadChildren: () =>
            import(
                '../../presentation/pages/team-organization/team-organization.routes'
            ).then((m) => m.routes),
        data: {
            module: 'TEAM_ORGANIZATION',
            subModule: [
                'TEAM_ORGANIZATION.PARTICIPANT.LABEL',
                'TEAM_ORGANIZATION.TEAM.LABEL',
                'TEAM_ORGANIZATION.AGENT_IA.LABEL',
            ],
        },
    },
    {
        path: REPORT_REQUESTS_ROUTE,
        loadChildren: () =>
            import(
                '../../presentation/pages/report-requests/report-requests.routes'
            ).then((m) => m.routes),
    },
    {
        path: REPORTS_PROCESSING_ROUTE,
        loadChildren: () =>
            import(
                '../../presentation/pages/reports-processing/reports-processing.routes'
            ).then((m) => m.routes),
        data: {
            module: 'REPORT_ROUTE',
            subModule: [
                'REPORTS_PROCESSING.QUEUES.LABEL',
                'REPORTS_PROCESSING.TASKS.LABEL',
                'REPORTS_PROCESSING.ALL.LABEL',
            ],
        },
    },
    {
        path: REPORT_FINALIZATION_ROUTE,
        loadChildren: () =>
            import(
                '../../presentation/pages/finalization/finalization.routes'
            ).then((m) => m.routes),
        data: {
            module: 'REPORT_ROUTE',
            subModule: [
                'FINALIZATION.QUEUES.LABEL',
                'FINALIZATION.TASKS.LABEL',
                'FINALIZATION.ALL.LABEL',
            ],
        },
    },
    {
        path: REPORTING_ROUTE,
        loadChildren: () =>
            import('../../presentation/pages/reporting/reporting.route').then(
                (m) => m.routes
            ),
        data: {
            module: 'REPORT_ROUTE',
            subModule: ['REPORTING.REPORT.LABEL'],
        },
    },
    /*     {
        path: 'communication',
        loadChildren: () =>
            import('../../presentation/pages/communication/communication.routes').then(
                (m) => m.routes
            ),
        data: {
            module: 'COMMUNICATION',
            subModule: ['COMMUNICATION.MESSAGES.LABEL', 'COMMUNICATION.NOTIFICATIONS.LABEL'],
        },
    }, */
    {
        path: SETTINGS_SECURITY_ROUTE,
        loadChildren: () =>
            import(
                '../../presentation/pages/settings-security/settings-security.routes'
            ).then((m) => m.routes),
        data: {
            module: 'SETTINGS_SECURITY',
            subModule: [
                'SETTINGS_SECURITY.USER.LABEL',
                'SETTINGS_SECURITY.PROFILE_HABILITATION.LABEL',
            ],
        },
    },
    /*     {
        path: CUSTOMERS_MANAGED,
        loadChildren: () =>
            import(
                '../../presentation/pages/managed-customers/managed-customers.module'
            ).then((m) => m.ManagedCustomersModule),
        data: {
            module: 'CUSTOMERS_MANAGED',
            subModule: [
                'COMMERCIAL_ENTERPRISE',
                'PUBLIC_ENTERPRISES',
                'ASSOCIATION_ENTERPRISES',
                'INDIVIDUALS',
                'CUSTOMERS',
            ],
        },
    }, */
    /*     {
        path: SUPERVISORY_REPOSITORY,
        loadChildren: () =>
            import(
                '../../presentation/pages/supervisory-repository/supervisory-repository.module'
            ).then((m) => m.SupervisoryRepositoryModule),
        data: {
            module: 'SUPERVISORY_REPOSITORY',
            subModule: ['SLA_AGREEMENTS', 'SLA_MANAGEMENT_CONTRACT'],
        },
    }, */
    /*     {
        path: REQUESTS_SERVICE,
        loadChildren: () =>
            import(
                '../../presentation/pages/requests-service/requests-service-routing.module'
            ).then((m) => m.routes),
        data: {
            module: 'REQUESTS_SERVICE',
            subModule: ['CUSTOMERS_ACTIVATE'],
        },
    }, */
    {
        path: '',
        redirectTo: DASHBOARD,
        pathMatch: 'full' as const,
    },
];

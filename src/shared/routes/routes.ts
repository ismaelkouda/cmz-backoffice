import { Routes } from '@angular/router';
export const SEARCH = 'search';

export const DASHBOARD = 'dashboard';
export const PROCESSING_ROUTE = 'reports-processing';
export const FINALIZATION_ROUTE = 'reports-finalization';
export const REPORT_STATES_ROUTE = 'report-status';
export const REPORTING_ROUTE = 'reporting';
export const MONITORING_ROUTE = 'system-supervision';
export const REQUESTS_ROUTE = 'requests';
export const CUSTOMERS_MANAGED = 'managed-customers';
export const REQUESTS_SERVICE = 'requests-services';
export const SUPERVISORY_REPOSITORY = 'sla-reference';
export const SETTINGS_SECURITY_ROUTE = 'security-settings';
export const TEAM_ORGANIZATION_ROUTE = 'organization';
export const ACCOUNTING = 'accounting';
export const COMMUNICATION_ROUTE = 'communication';
export const CONTENT_MANAGEMENT_ROUTE = 'content-management';
export const ADMINISTRATIVE_BOUNDARY_ROUTE = 'territorial-structure';

export const content: Routes = [
    {
        path: DASHBOARD,
        loadChildren: () =>
            import('@pages/dashboard/dashboard.routes').then((m) => m.routes),
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
        path: TEAM_ORGANIZATION_ROUTE,
        data: {
            breadcrumb: {
                label: 'TEAM_ORGANIZATION.BREADCRUMB.LABEL',
                icon: 'TEAM_ORGANIZATION.BREADCRUMB.ICON',
            },
        },
        loadChildren: () =>
            import('@pages/team-organization/team-organization.routes').then(
                (m) => m.routes
            ),
    },
    {
        path: REQUESTS_ROUTE,
        data: {
            breadcrumb: {
                label: 'REQUESTS.BREADCRUMB.LABEL',
                icon: 'REQUESTS.BREADCRUMB.ICON',
            },
        },
        loadChildren: () =>
            import('@pages/requests/requests.routes').then((m) => m.routes),
    },
    {
        path: PROCESSING_ROUTE,
        data: {
            breadcrumb: {
                label: 'PROCESSING.BREADCRUMB.LABEL',
                icon: 'PROCESSING.BREADCRUMB.ICON',
            },
        },
        loadChildren: () =>
            import('@pages/processing/processing.routes').then((m) => m.routes),
    },
    // {
    //     path: FINALIZATION_ROUTE,
    //     data: {
    //         breadcrumb: {
    //             label: 'FINALIZATION.BREADCRUMB.LABEL',
    //             icon: 'FINALIZATION.BREADCRUMB.ICON',
    //         },
    //     },
    //     loadChildren: () =>
    //         import('@pages/finalization/finalization.routes').then(
    //             (m) => m.routes
    //         ),
    // },
    {
        path: REPORT_STATES_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORT_STATES.BREADCRUMB.LABEL',
                icon: 'REPORT_STATES.BREADCRUMB.ICON',
            },
        },
        loadChildren: () =>
            import('@pages/report-states/report-states.routes').then(
                (m) => m.routes
            ),
    },
    {
        path: REPORTING_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORTING.BREADCRUMB.LABEL',
                icon: 'REPORTING.BREADCRUMB.ICON',
            },
        },
        loadChildren: () =>
            import('@pages/reporting/reporting.route').then((m) => m.routes),
    },
    {
        path: COMMUNICATION_ROUTE,
        data: {
            breadcrumb: {
                label: 'COMMUNICATION.BREADCRUMB.LABEL',
                icon: 'COMMUNICATION.BREADCRUMB.ICON',
            },
        },
        loadChildren: () =>
            import('@pages/communication/communication.routes').then(
                (m) => m.routes
            ),
    },
    {
        path: CONTENT_MANAGEMENT_ROUTE,
        loadChildren: () =>
            import('@pages/content-management/content-management.routes').then(
                (m) => m.routes
            ),
        data: {
            breadcrumb: {
                label: 'CONTENT_MANAGEMENT.LABEL',
                icon: 'pi-folder',
            },
        },
    },
    {
        path: ADMINISTRATIVE_BOUNDARY_ROUTE,
        loadChildren: () =>
            import('@pages/administrative-boundary/administrative-boundary.routes').then(
                (m) => m.routes
            ),
        data: {
            breadcrumb: {
                label: 'ADMINISTRATIVE_BOUNDARY.LABEL',
                icon: 'pi-sitemap',
            },
        },
    },
    {
        path: SETTINGS_SECURITY_ROUTE,
        loadChildren: () =>
            import('@pages/settings-security/settings-security.routes').then(
                (m) => m.routes
            ),
        data: {
            breadcrumb: {
                label: 'SETTINGS_SECURITY.LABEL',
                icon: 'pi-cog',
            },
        },
    },
    {
        path: MONITORING_ROUTE,
        data: {
            breadcrumb: {
                label: 'MONITORING.BREADCRUMB.LABEL',
                icon: 'MONITORING.BREADCRUMB.ICON',
            },
        },
        loadChildren: () =>
            import('@pages/monitoring/monitoring.routes').then((m) => m.routes),
    },
    {
        path: '',
        redirectTo: DASHBOARD,
        pathMatch: 'full' as const,
    },
];

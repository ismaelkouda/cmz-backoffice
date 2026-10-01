import { Routes } from '@angular/router';

export const REPORT_ROUTE = 'reports';
export const REQUESTS_ROUTE = 'requests';
export const REPORT_BY_CHANNEL_ROUTE = 'report-by-channel';
export const REPORT_BY_OPERATOR_ROUTE = 'report-by-operator';
export const REPORT_BY_EQUIPMENTS_ROUTE = 'impacts-on-equipments';
export const REPORT_BY_POPULATIONS_ROUTE = 'impacts-on-populations';
export const TEAM_COMPLIANCES_ROUTE = 'sla-performance';
export const REPORT_COMPLIANCES_ROUTE = 'report-compliances';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: REPORT_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'REPORTING.REPORT.BREADCRUMB.LABEL',
                        icon: 'REPORTING.REPORT.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./presentation/features/report/pages/report-page/report-page.component').then(
                                (m) => m.ReportPageComponent
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
                path: REQUESTS_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'REPORTING.REQUESTS.BREADCRUMB.LABEL',
                        icon: 'REPORTING.REQUESTS.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./presentation/features/requests/pages/requests-page/requests-page.component').then(
                                (m) => m.RequestsPageComponent
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
                path: REPORT_BY_CHANNEL_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'REPORTING.REPORT_BY_CHANNEL.BREADCRUMB.LABEL',
                        icon: 'REPORTING.REPORT_BY_CHANNEL.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./presentation/features/report-by-channel/pages/report-by-channel-page/report-by-channel-page.component').then(
                                (m) => m.ReportByChannelPageComponent
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
                path: REPORT_BY_OPERATOR_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'REPORTING.REPORT_BY_OPERATOR.BREADCRUMB.LABEL',
                        icon: 'REPORTING.REPORT_BY_OPERATOR.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./presentation/features/report-by-operator/pages/report-by-operator-page/report-by-operator-page.component').then(
                                (m) => m.ReportByOperatorPageComponent
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
                path: REPORT_BY_EQUIPMENTS_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'REPORTING.REPORT_BY_EQUIPMENTS.BREADCRUMB.LABEL',
                        icon: 'REPORTING.REPORT_BY_EQUIPMENTS.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./presentation/features/report-by-equipments/pages/report-by-equipments-page/report-by-equipments-page.component').then(
                                (m) => m.ReportByEquipmentsPageComponent
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
                path: REPORT_BY_POPULATIONS_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'REPORTING.REPORT_BY_POPULATIONS.BREADCRUMB.LABEL',
                        icon: 'REPORTING.REPORT_BY_POPULATIONS.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./presentation/features/report-by-populations/pages/report-by-populations-page/report-by-populations-page.component').then(
                                (m) => m.ReportByPopulationsPageComponent
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
                path: TEAM_COMPLIANCES_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'REPORTING.TEAM_COMPLIANCES.BREADCRUMB.LABEL',
                        icon: 'REPORTING.TEAM_COMPLIANCES.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./presentation/features/team-compliances/pages/team-compliances-page/team-compliances-page.component').then(
                                (m) => m.TeamCompliancesPageComponent
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
                path: REPORT_COMPLIANCES_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'REPORTING.REPORT_COMPLIANCES.BREADCRUMB.LABEL',
                        icon: 'REPORTING.REPORT_COMPLIANCES.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./presentation/features/report-compliances/pages/report-compliances-page/report-compliances-page.component').then(
                                (m) => m.ReportCompliancesPageComponent
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
                path: '**',
                redirectTo: REPORT_ROUTE,
            },
        ],
    },
];

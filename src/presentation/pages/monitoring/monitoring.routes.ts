import { Routes } from '@angular/router';

export const NODE_ROUTE = 'processing-status';
export const SERVICES_ROUTE = 'services-states';
export const RESOURCES_ROUTE = 'resources-states';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: NODE_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'MONITORING.NODE.BREADCRUMB.LABEL',
                        icon: 'MONITORING.NODE.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./presentation/features/node/pages/node-page/node-page.component').then(
                                (m) => m.NodePageComponent
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
                path: SERVICES_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'MONITORING.SERVICES.BREADCRUMB.LABEL',
                        icon: 'MONITORING.SERVICES.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./presentation/features/services/pages/services-page/services-page.component').then(
                                (m) => m.ServicesPageComponent
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
                path: RESOURCES_ROUTE,
                data: {
                    breadcrumb: {
                        label: 'MONITORING.RESOURCES.BREADCRUMB.LABEL',
                        icon: 'MONITORING.RESOURCES.BREADCRUMB.ICON',
                    },
                },
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('./presentation/features/resources/pages/resources-page/resources-page.component').then(
                                (m) => m.ResourcesPageComponent
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
                redirectTo: NODE_ROUTE,
            },
        ],
    },
];

import { Routes } from '@angular/router';

export const APPROVE_ROUTE = 'approved';
export const EVALUATE_ROUTE = 'evaluated';
export const CLOSE_ROUTE = 'closed';
export const REJECT_ROUTE = 'rejected';
export const DOWNLOAD_ROUTE = 'downloads';

export const routes: Routes = [
    {
        path: APPROVE_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORT_STATES.APPROVE.BREADCRUMB.LABEL',
                icon: 'REPORT_STATES.APPROVE.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@presentation/pages/report-states/presentation/features/approve/approve.component').then(
                        (m) => m.ApproveComponent
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
        path: EVALUATE_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORT_STATES.EVALUATE.BREADCRUMB.LABEL',
                icon: 'REPORT_STATES.EVALUATE.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@presentation/pages/report-states/presentation/features/evaluate/evaluate.component').then(
                        (m) => m.EvaluateComponent
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
        path: CLOSE_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORT_STATES.CLOSE.BREADCRUMB.LABEL',
                icon: 'REPORT_STATES.CLOSE.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@presentation/pages/report-states/presentation/features/close/close.component').then(
                        (m) => m.CloseComponent
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
        path: REJECT_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORT_STATES.REJECT.BREADCRUMB.LABEL',
                icon: 'REPORT_STATES.REJECT.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@presentation/pages/report-states/presentation/features/reject/reject.component').then(
                        (m) => m.RejectComponent
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
        path: DOWNLOAD_ROUTE,
        data: {
            breadcrumb: {
                label: 'REPORT_STATES.DOWNLOAD.BREADCRUMB.LABEL',
                icon: 'REPORT_STATES.DOWNLOAD.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@presentation/pages/report-states/presentation/features/download/download.component').then(
                        (m) => m.DownloadComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
    },
];

import { Routes } from '@angular/router';

export const MESSAGING_ROUTE = 'messaging';
export const NOTIFICATIONS_ROUTE = 'notification';
export const ALERT_ROUTE = 'alerte';

export const routes: Routes = [
    {
        path: NOTIFICATIONS_ROUTE,
        data: {
            breadcrumb: {
                label: 'COMMUNICATION.NOTIFICATIONS.BREADCRUMB.LABEL',
                icon: 'COMMUNICATION.NOTIFICATIONS.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('@pages/communication/presentation/notifications/notifications-list/notifications-list.component').then(
                        (m) => m.NotificationsListComponent
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
        path: MESSAGING_ROUTE,
        data: {
            breadcrumb: {
                label: 'COMMUNICATION.MESSAGING.BREADCRUMB.LABEL',
                icon: 'COMMUNICATION.MESSAGING.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./presentation/messaging/messaging.routes').then(
                        (m) => m.MESSAGING_ROUTES
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
        path: ALERT_ROUTE,
        data: {
            breadcrumb: {
                label: 'COMMUNICATION.ALERT.BREADCRUMB.LABEL',
                icon: 'COMMUNICATION.ALERT.BREADCRUMB.ICON',
            },
        },
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./presentation/alert/alert-page/alert-page.component').then(
                        (m) => m.AlertPageComponent
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

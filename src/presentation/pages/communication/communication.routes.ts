import { Routes } from '@angular/router';

import { NotificationsListComponent } from '@presentation/pages/communication/presentation/notifications/notifications-list/notifications-list.component';

export const MESSAGING_ROUTE = 'messaging';
export const NOTIFICATIONS_ROUTE = 'notification';

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
                component: NotificationsListComponent,
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
];

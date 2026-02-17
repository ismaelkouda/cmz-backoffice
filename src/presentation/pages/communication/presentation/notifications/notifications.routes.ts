import { Routes } from '@angular/router';

import { NotificationsListComponent } from '@presentation/pages/communication/presentation/notifications/notifications-list/notifications-list.component';

export const NOTIFICATIONS_ROUTES: Routes = [
    {
        path: '',
        component: NotificationsListComponent,
        data: {
            icon: 'COMMUNICATION.NOTIFICATIONS.TITLE',
            breadcrumb: 'COMMUNICATION.NOTIFICATIONS.TITLE',
        },
        children: [
            {
                path: '',
                component: NotificationsListComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];

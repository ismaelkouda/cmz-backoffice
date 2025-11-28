/* import { Routes } from '@angular/router';
import { MessagingComponent } from './ui/messaging/messaging.component';
import { NotificationsComponent } from './ui/notifications/notifications.component';

export const MESSAGING_ROUTE = 'messaging';
export const NOTIFICATIONS_ROUTE = 'notifications';

export const routes: Routes = [
    {
        path: MESSAGING_ROUTE,
        children: [
            {
                path: '',
                redirectTo: MESSAGING_ROUTE,
                pathMatch: 'full',
            },
            {
                path: MESSAGING_ROUTE,
                component: MessagingComponent,
                data: {
                    title: 'COMMUNICATION.MESSAGING.TITLE',
                    module: 'COMMUNICATION.LABEL',
                    subModule: 'COMMUNICATION.MESSAGING.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: MESSAGING_ROUTE,
            },
        ],
    },
    {
        path: NOTIFICATIONS_ROUTE,
        children: [
            {
                path: '',
                redirectTo: NOTIFICATIONS_ROUTE,
                pathMatch: 'full',
            },
            {
                path: NOTIFICATIONS_ROUTE,
                component: NotificationsComponent,
                data: {
                    title: 'COMMUNICATION.NOTIFICATIONS.TITLE',
                    module: 'COMMUNICATION.LABEL',
                    subModule: 'COMMUNICATION.NOTIFICATIONS.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: NOTIFICATIONS_ROUTE,
            },
        ],
    },
];
 */
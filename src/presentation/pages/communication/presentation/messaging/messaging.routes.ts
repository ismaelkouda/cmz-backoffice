import { Routes } from '@angular/router';

import { HistoryComponent } from '@shared/components/history/history.component';

import { MessagingFormComponent } from '@presentation/pages/communication/presentation/messaging/messaging-form/messaging-form.component';
import { MessagingListComponent } from '@presentation/pages/communication/presentation/messaging/messaging-list/messaging-list.component';
import { MessagingPageComponent } from '@presentation/pages/communication/presentation/messaging/messaging-page/messaging-page.component';

export const MESSAGING_LIST = 'list';
export const MESSAGING_FORM = 'form';
export const MESSAGING_HISTORY = 'history';

export const MESSAGING_ROUTES: Routes = [
    {
        path: '',
        component: MessagingPageComponent,
        data: {
            title: 'COMMUNICATION.MESSAGING.TITLE',
            breadcrumb: 'COMMUNICATION.MESSAGING.TITLE',
        },
        children: [
            {
                path: '',
                component: MessagingListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: MESSAGING_HISTORY,
                component: HistoryComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
    {
        path: `${MESSAGING_FORM}`,
        data: {
            title: 'COMMUNICATION.MESSAGING.FORM.TITLE',
            breadcrumb: 'COMMUNICATION.MESSAGING.FORM.TITLE',
        },
        children: [
            {
                path: '',
                component: MessagingFormComponent,
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];

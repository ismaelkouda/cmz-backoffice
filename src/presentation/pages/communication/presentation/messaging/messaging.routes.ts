import { Routes } from '@angular/router';
import { MessagingFormComponent } from '@pages/communication/presentation/messaging/messaging-form/messaging-form.component';
import { MessagingListComponent } from '@pages/communication/presentation/messaging/messaging-list/messaging-list.component';
import { MessagingPageComponent } from '@pages/communication/presentation/messaging/messaging-page/messaging-page.component';
import {
    MESSAGING_FORM,
    MESSAGING_HISTORY,
    MESSAGING_LIST,
} from '@pages/communication/presentation/messaging/messaging-paths.constants';
import { HistoryPageComponent } from '@shared/components/history/presentation/features/history-page/history-page.component';

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
                pathMatch: 'full',
                redirectTo: MESSAGING_LIST,
            },
            {
                path: MESSAGING_LIST,
                component: MessagingListComponent,
                data: { breadcrumb: { hide: true } },
            },
            {
                path: MESSAGING_HISTORY,
                component: HistoryPageComponent,
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

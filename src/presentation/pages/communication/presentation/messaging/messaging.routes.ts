import { Routes } from '@angular/router';

import {
    MESSAGING_FORM,
    MESSAGING_HISTORY,
    MESSAGING_LIST,
} from '@pages/communication/presentation/messaging/messaging-paths.constants';

export const MESSAGING_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@pages/communication/presentation/messaging/messaging-page/messaging-page.component').then(
                (m) => m.MessagingPageComponent
            ),
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
                loadComponent: () =>
                    import('@pages/communication/presentation/messaging/messaging-list/messaging-list.component').then(
                        (m) => m.MessagingListComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
            {
                path: MESSAGING_HISTORY,
                loadComponent: () =>
                    import('@shared/components/history/presentation/features/history-page/history-page.component').then(
                        (m) => m.HistoryPageComponent
                    ),
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
                loadComponent: () =>
                    import('@pages/communication/presentation/messaging/messaging-form/messaging-form.component').then(
                        (m) => m.MessagingFormComponent
                    ),
                data: { breadcrumb: { hide: true } },
            },
        ],
    },
];

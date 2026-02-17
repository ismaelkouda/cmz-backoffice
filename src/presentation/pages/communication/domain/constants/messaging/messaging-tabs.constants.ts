import { COMMUNICATION_ROUTE } from '@shared/routes/routes';

import {
    MESSAGING_HISTORY,
    MESSAGING_LIST,
} from '@presentation/pages/communication/presentation/messaging/messaging.routes';

export const MESSAGING_TABS = [
    {
        value: '0',
        route: `${COMMUNICATION_ROUTE}/${MESSAGING_LIST}`,
        label: 'COMMUNICATION.MESSAGING.TABS.MESSAGING.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `${COMMUNICATION_ROUTE}/${MESSAGING_HISTORY}`,
        label: 'COMMUNICATION.MESSAGING.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { participant: 'test' },
    },
];

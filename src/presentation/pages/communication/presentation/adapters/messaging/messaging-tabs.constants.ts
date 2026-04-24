import {
    MESSAGING_HISTORY,
    MESSAGING_LIST,
} from '@pages/communication/presentation/messaging/messaging-paths.constants';
import { MESSAGING_ROUTE } from '@presentation/pages/communication/communication.routes';
import { COMMUNICATION_ROUTE } from '@shared/routes/routes';

export const MESSAGING_TABS = [
    {
        value: '0',
        route: `/${COMMUNICATION_ROUTE}/${MESSAGING_ROUTE}/${MESSAGING_LIST}`,
        label: 'COMMUNICATION.MESSAGING.TABS.MESSAGING.LABEL',
        icon: 'pi pi-list',
    },
    {
        value: '1',
        route: `/${COMMUNICATION_ROUTE}/${MESSAGING_ROUTE}/${MESSAGING_HISTORY}`,
        label: 'COMMUNICATION.MESSAGING.TABS.HISTORY.LABEL',
        icon: 'pi pi-history',
        queryParams: { ref: 'message-diffusion' },
    },
];

import { Status } from '@pages/communication/domain/enums/notifications/notifications-status.enum';

export interface NotificationsProps {
    uniqId: string;
    reference: string;
    title: string;
    type: string;
    message: string;
    status: Status;
    sendAt: string;
}

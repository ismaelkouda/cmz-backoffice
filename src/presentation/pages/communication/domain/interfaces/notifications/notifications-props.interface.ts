import { Status } from '@pages/communication/domain/enums/notifications/notifications-status.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';

export interface NotificationsProps {
    uniqId: string;
    reference: string;
    title: string;
    type: TypeReport;
    message: string;
    status: Status;
    sendAt: string;
    updatedAt: string;
}

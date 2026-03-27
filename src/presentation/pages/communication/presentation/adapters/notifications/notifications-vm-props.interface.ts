import {
    Status,
    StatusStyle,
} from '@pages/communication/domain/enums/notifications/notifications-status.enum';
import { TypeReport } from '@shared/domain/enums/type-report.enum';

export interface NotificationsVmProps {
    uniqId: string;
    type: TypeReport;
    title: string;
    message: string;
    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;
    sendAt: string;
    actionsRef: string;
}

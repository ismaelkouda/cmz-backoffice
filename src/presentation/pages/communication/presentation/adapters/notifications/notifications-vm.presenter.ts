import { NotificationsEntity } from '@pages/communication/domain/entities/notifications/notifications.entity';
import { NotificationsVmProps } from '@pages/communication/presentation/adapters/notifications/notifications-vm-props.interface';

export class NotificationsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: NotificationsEntity): NotificationsVmProps {
        return {
            uniqId: item.uniqId,
            type: item.type,
            title: item.title,
            message: item.message,
            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),
            sendAt: item.sendAt,
            actionsRef: item.actionsRef,
            tooltipButtonCanNotRead: this.t(
                'COMMUNICATION.NOTIFICATIONS.TABLE.TOOLTIP_BUTTON_CAN_NOT_READ'
            ),
            tooltipButtonCanRead: this.t(
                'COMMUNICATION.NOTIFICATIONS.TABLE.TOOLTIP_BUTTON_CAN_READ'
            ),
            disableButtonRead: false,
        };
    }
}

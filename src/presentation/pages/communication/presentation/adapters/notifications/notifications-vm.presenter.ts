import { NotificationsEntity } from '@pages/communication/domain/entities/notifications/notifications.entity';
import { NotificationsVmProps } from '@pages/communication/presentation/adapters/notifications/notifications-vm-props.interface';
import { Status } from '@presentation/pages/communication/domain/enums/notifications/notifications-status.enum';

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
            tooltipButtonRead:
                item.status === Status.UNREAD
                    ? this.t('COMMUNICATION.NOTIFICATIONS.TOOLTIP.READ')
                    : this.t('COMMUNICATION.NOTIFICATIONS.TOOLTIP.SEE_MORE'),
            disableButtonRead: false,
        };
    }
}

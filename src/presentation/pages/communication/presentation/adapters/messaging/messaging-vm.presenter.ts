import { MessagingEntity } from '@pages/communication/domain/entities/messaging/messaging.entity';
import { MessagingVmProps } from '@pages/communication/presentation/adapters/messaging/messaging-vm-props.interface';
import { Channels } from '@presentation/pages/communication/domain/enums/messaging/messaging-channels.enum';

export class MessagingPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: MessagingEntity): MessagingVmProps {
        return {
            uniqId: item.uniqId,
            type: item.type,
            targetType: item.targetType,
            channels: item.channels,
            channelsStyle: (channel: Channels) => item.channelsStyle(channel),
            subject: item.subject,
            content: item.content,
            createdAt: item.createdAt,
            actionsRef: item.createdAt,
            tooltipButtonView: this.t(
                'COMMUNICATION.MESSAGING.TOOLTIP.SEE_MORE'
            ),
            disableButtonView: false,
        };
    }
}

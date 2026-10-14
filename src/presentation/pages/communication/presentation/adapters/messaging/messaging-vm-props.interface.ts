import {
    MessagingChannelsEnum,
    ChannelsStyle,
} from '@pages/communication/domain/enums/messaging/messaging-channels.enum';

export interface MessagingVmProps {
    uniqId: string;
    type: string;
    targetType: string;
    channels: MessagingChannelsEnum[];
    channelsLabel: string[];
    channelsStyle: (channel: MessagingChannelsEnum) => ChannelsStyle;
    subject: string;
    content: string;
    createdAt: string;
    actionsRef: string;
    tooltipButtonView: string;
    disableButtonView: boolean;
}

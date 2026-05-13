import {
    Channels,
    ChannelsStyle,
} from '@pages/communication/domain/enums/messaging/messaging-channels.enum';

export interface MessagingVmProps {
    uniqId: string;
    type: string;
    targetType: string;
    channels: Channels[];
    channelsStyle: (channel: Channels) => ChannelsStyle;
    subject: string;
    content: string;
    createdAt: string;
    actionsRef: string;
    tooltipButtonView: string;
    disableButtonView: boolean;
}

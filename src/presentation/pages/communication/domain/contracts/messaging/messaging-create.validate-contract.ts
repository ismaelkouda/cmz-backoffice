import { MessagingChannelsEnum } from '@pages/communication/domain/enums/messaging/messaging-channels.enum';
import { MessagingTargetEnum } from '@pages/communication/domain/enums/messaging/messaging-target.enum';
import { MessagingTypeEnum } from '@pages/communication/domain/enums/messaging/messaging-type.enum';

export interface MessagingCreateValidateContract {
    type: MessagingTypeEnum;
    targetType: MessagingTargetEnum;
    reportId?: string;
    region?: string;
    department?: string;
    municipality?: string;
    channels: MessagingChannelsEnum[];
    subject: string;
    content: string;
}

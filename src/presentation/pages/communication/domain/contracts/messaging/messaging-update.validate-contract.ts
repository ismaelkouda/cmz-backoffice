import { MessagingChannelsEnum } from '@pages/communication/domain/enums/messaging/messaging-channels.enum';
import { MessagingTargetEnum } from '@pages/communication/domain/enums/messaging/messaging-target.enum';
import { MessagingTypeEnum } from '@pages/communication/domain/enums/messaging/messaging-type.enum';

export interface MessagingUpdateValidateContract {
    uniqId: string;
    reportId: string;
    type: MessagingTypeEnum;
    targetType: MessagingTargetEnum;
    region: number;
    department: number;
    municipality: number;
    channels: MessagingChannelsEnum[];
    subject: string;
    content: string;
}

import { MessagingChannelsEnum } from '@pages/communication/domain/enums/messaging/messaging-channels.enum';
import { MessagingTypeEnum } from '@pages/communication/domain/enums/messaging/messaging-type.enum';
import { MessagingTargetEnum } from '@pages/communication/domain/enums/messaging/messaging-target.enum';

export interface MessagingFindOneProps {
    uniqId: string;
    reportId: string;
    type: MessagingTypeEnum;
    targetType: MessagingTargetEnum;
    region: string;
    department: string;
    municipality: string;
    channels: MessagingChannelsEnum[];
    subject: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

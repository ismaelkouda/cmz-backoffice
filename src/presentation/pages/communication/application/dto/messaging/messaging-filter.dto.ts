import { MessagingChannelsEnum } from '@pages/communication/domain/enums/messaging/messaging-channels.enum';
import { MessagingTargetEnum } from '@pages/communication/domain/enums/messaging/messaging-target.enum';

export interface MessagingFilterDto {
    reportId?: string;
    search?: string;
    targetType?: MessagingTargetEnum;
    region?: string;
    department?: string;
    municipality?: string;
    channels?: MessagingChannelsEnum[];
    startDate?: Date;
    endDate?: Date;
}

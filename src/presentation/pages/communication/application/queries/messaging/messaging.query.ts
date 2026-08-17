import { MessagingChannelsEnum } from '@pages/communication/domain/enums/messaging/messaging-channels.enum';
import { MessagingTargetEnum } from '@pages/communication/domain/enums/messaging/messaging-target.enum';

export class MessagingQuery {
    constructor(
        public readonly search?: string,
        public readonly reportId?: string,
        public readonly targetType?: MessagingTargetEnum,
        public readonly region?: string,
        public readonly department?: string,
        public readonly municipality?: string,
        public readonly channels?: MessagingChannelsEnum[],
        public readonly startDate?: Date,
        public readonly endDate?: Date
    ) {}
}

import { MessagingChannelsEnum } from '@pages/communication/domain/enums/messaging/messaging-channels.enum';
import { MessagingTargetEnum } from '@pages/communication/domain/enums/messaging/messaging-target.enum';
import { MessagingTypeEnum } from '@pages/communication/domain/enums/messaging/messaging-type.enum';

export class MessagingUpdateCommand {
    constructor(
        public readonly uniqId: string,
        public readonly reportId?: string,
        public readonly type?: MessagingTypeEnum,
        public readonly targetType?: MessagingTargetEnum,
        public readonly region?: string,
        public readonly department?: string,
        public readonly municipality?: string,
        public readonly channels?: MessagingChannelsEnum[],
        public readonly subject?: string,
        public readonly content?: string
    ) {}
}

import { MessagingFindOneProps } from '@pages/communication/domain/interfaces/messaging/messaging-find-one-props.interface';
import { MessagingChannelsEnum } from '@pages/communication/domain/enums/messaging/messaging-channels.enum';
import { MessagingTargetEnum } from '@pages/communication/domain/enums/messaging/messaging-target.enum';
import { MessagingTypeEnum } from '@pages/communication/domain/enums/messaging/messaging-type.enum';

export class MessagingFindOneEntity {
    constructor(private readonly props: MessagingFindOneProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get reportId(): string {
        return this.props.reportId;
    }

    get type(): MessagingTypeEnum {
        return this.props.type;
    }

    get targetType(): MessagingTargetEnum {
        return this.props.targetType;
    }

    get region(): string {
        return this.props.region;
    }

    get department(): string {
        return this.props.department;
    }

    get municipality(): string {
        return this.props.municipality;
    }

    get channels(): MessagingChannelsEnum[] {
        return this.props.channels;
    }

    get subject(): string {
        return this.props.subject;
    }

    get content(): string {
        return this.props.content;
    }

    get createdAt(): string {
        return this.props.createdAt;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: MessagingFindOneProps): MessagingFindOneEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new MessagingFindOneEntity(props);
    }
}

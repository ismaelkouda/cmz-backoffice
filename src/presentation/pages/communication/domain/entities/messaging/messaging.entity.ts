import {
    Channels,
    ChannelsStyle,
} from '@pages/communication/domain/enums/messaging/messaging-channels.enum';
import { MessagingProps } from '@pages/communication/domain/interfaces/messaging/messaging-props.interface';

export class MessagingEntity {
    constructor(private readonly props: MessagingProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get actionsRef(): string {
        return this.props.type;
    }

    get reportId(): string {
        return this.props.reportId;
    }

    get type(): string {
        return this.props.type;
    }

    get targetType(): string {
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

    get channels(): Channels[] {
        return this.props.channels;
    }
    channelsStyle(channels: Channels): ChannelsStyle {
        const methodMap: Record<Channels, ChannelsStyle> = {
            [Channels.PUSH]: ChannelsStyle.PUSH,
            [Channels.MAIL]: ChannelsStyle.MAIL,
            [Channels.SMS]: ChannelsStyle.SMS,
        };
        return methodMap[channels];
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

    public with(props: MessagingProps): MessagingEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new MessagingEntity(props);
    }
}

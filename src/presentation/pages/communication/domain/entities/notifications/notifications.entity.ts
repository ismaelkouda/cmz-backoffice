import {
    Status,
    StatusStyle,
} from '@pages/communication/domain/enums/notifications/notifications-status.enum';
import { NotificationsProps } from '@pages/communication/domain/interfaces/notifications/notifications-props.interface';
import { TypeReport } from '@shared/domain/enums/type-report.enum';

export class NotificationsEntity {
    constructor(private readonly props: NotificationsProps) {}

    get actionsRef(): string {
        return this.props.reference;
    }
    get uniqId(): string {
        return this.props.uniqId;
    }
    get reference(): string {
        return this.props.reference;
    }
    get title(): string {
        return this.props.title;
    }
    get type(): TypeReport {
        return this.props.type;
    }
    get message(): string {
        return this.props.message;
    }
    get status(): string {
        return this.props.status;
    }

    get sendAt(): string {
        return this.props.sendAt;
    }
    statusStyle(status: Status): StatusStyle {
        const methodMap: Record<Status, StatusStyle> = {
            [Status.READ]: StatusStyle.READ,
            [Status.UNREAD]: StatusStyle.UNREAD,
        };
        return methodMap[status];
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: NotificationsProps): NotificationsEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new NotificationsEntity(props);
    }
}

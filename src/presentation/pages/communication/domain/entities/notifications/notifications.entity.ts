import { Status } from '@presentation/pages/communication/domain/enums/notifications/notifications-status.enum';

export interface NotificationsProps {
    uniqId: string;
    reference: string;
    title: string;
    type: string;
    message: string;
    status: Status;
    sendAt: string;
}
export class NotificationsEntity {
    constructor(private readonly props: NotificationsProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get reference(): string {
        return this.props.reference;
    }
    get title(): string {
        return this.props.title;
    }
    get type(): string {
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

    public with(props: NotificationsProps): NotificationsEntity {
        if (this.sendAt === props.sendAt) {
            return this;
        }
        return new NotificationsEntity(props);
    }
}

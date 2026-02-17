export interface NotificationsProps {
    uniqId: string;
    reference: string;
    type: string;
    description: string;
    createdAt: string;
}
export class NotificationsEntity {
    constructor(private readonly props: NotificationsProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get reference(): string {
        return this.props.reference;
    }
    get type(): string {
        return this.props.type;
    }
    get description(): string {
        return this.props.description;
    }
    get createdAt(): string {
        return this.props.reference;
    }

    public with(props: NotificationsProps): NotificationsEntity {
        if (this.createdAt === props.createdAt) {
            return this;
        }
        return new NotificationsEntity(props);
    }
}

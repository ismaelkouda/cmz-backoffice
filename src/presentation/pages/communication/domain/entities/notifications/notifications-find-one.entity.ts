export interface NotificationsFindOneProps {
    uniqId: string;
    reportType: string;
    operators: string;
    source: string;
    initiatorPhoneNumber: string;
    createdAt: string;
    updatedAt: string;
}
export class NotificationsFindOneEntity {
    constructor(private readonly props: NotificationsFindOneProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get reportType(): string {
        return this.props.reportType;
    }
    get operators(): string {
        return this.props.operators;
    }
    get source(): string {
        return this.props.source;
    }
    get initiatorPhoneNumber(): string {
        return this.props.initiatorPhoneNumber;
    }
    get createdAt(): string {
        return this.props.createdAt;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: NotificationsFindOneProps): NotificationsFindOneEntity {
        if (
            this.uniqId === props.uniqId &&
            this.updatedAt === props.updatedAt
        ) {
            return this;
        }
        return new NotificationsFindOneEntity(props);
    }
}

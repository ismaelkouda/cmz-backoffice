export interface MessagingProps {
    uniqId: string;
    reportId: string;
    type: string;
    targetType: string;
    region: string;
    department: string;
    municipality: string;
    channels: string[];
    subject: string;
    content: string;
    createdAt: string;
}

export class MessagingEntity {
    constructor(private readonly props: MessagingProps) {}

    get uniqId(): string {
        return this.props.uniqId;
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

    get channels(): string[] {
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

    public with(props: MessagingProps): MessagingEntity {
        if (this.createdAt === props.createdAt) {
            return this;
        }
        return new MessagingEntity(props);
    }
}

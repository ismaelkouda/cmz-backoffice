import {
    Status,
    StatusStyle,
} from '@pages/content-management/domain/enums/privacy-policy/privacy-policy-status.enum';
import { PrivacyPolicyProps } from '@pages/content-management/domain/interfaces/privacy-policy/privacy-policy-props.interface';

export class PrivacyPolicyEntity {
    constructor(private readonly props: PrivacyPolicyProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get actionsRef(): string {
        return this.props.version;
    }
    get version(): string {
        return this.props.version;
    }
    get status(): Status {
        return this.props.status;
    }
    statusStyle(status: Status): StatusStyle {
        const methodMap: Record<Status, StatusStyle> = {
            [Status.PUBLISH]: StatusStyle.PUBLISH,
            [Status.UNPUBLISH]: StatusStyle.UNPUBLISH,
        };
        return methodMap[status];
    }
    get createdAt(): string {
        return this.props.createdAt;
    }
    get publishedAt(): string {
        return this.props.publishedAt;
    }
    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: PrivacyPolicyProps): PrivacyPolicyEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new PrivacyPolicyEntity(props);
    }

    toJSON(): PrivacyPolicyProps {
        return { ...this.props };
    }
}

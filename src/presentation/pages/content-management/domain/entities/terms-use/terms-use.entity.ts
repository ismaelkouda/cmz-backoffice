import {
    Status,
    StatusStyle,
} from '@pages/content-management/domain/enums/terms-use/terms-use-status.enum';
import { TermsUseProps } from '@pages/content-management/domain/interfaces/terms-use/terms-use-props.interface';

export class TermsUseEntity {
    constructor(private readonly props: TermsUseProps) {}

    get uniqId(): string {
        return this.props.uniqId;
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

    public with(props: TermsUseProps): TermsUseEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new TermsUseEntity(props);
    }

    toJSON(): TermsUseProps {
        return { ...this.props };
    }
}

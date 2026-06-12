import {
    Status,
    StatusStyle,
} from '@pages/content-management/domain/enums/legal-notice/legal-notice-status.enum';
import { LegalNoticeProps } from '@pages/content-management/domain/interfaces/legal-notice/legal-notice-props.interface';

export class LegalNoticeEntity implements LegalNoticeProps {
    constructor(private readonly props: LegalNoticeProps) {}

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

    public with(props: LegalNoticeProps): LegalNoticeEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new LegalNoticeEntity(props);
    }

    toJSON(): LegalNoticeProps {
        return { ...this.props };
    }
}

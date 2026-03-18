import { Status } from '@pages/content-management/domain/enums/legal-notice/legal-notice-status.enum';
import { LegalNoticeFindOneProps } from '@pages/content-management/domain/interfaces/legal-notice/legal-notice-find-one-props.interface';

export class LegalNoticeFindOneEntity {
    constructor(private readonly props: LegalNoticeFindOneProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get version(): string {
        return this.props.version;
    }
    get content(): string {
        return this.props.content;
    }
    get status(): Status {
        return this.props.status;
    }
    get createdAt(): string {
        return this.props.createdAt;
    }
    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: LegalNoticeFindOneProps): LegalNoticeFindOneEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new LegalNoticeFindOneEntity(props);
    }

    toJSON(): LegalNoticeFindOneProps {
        return { ...this.props };
    }
}

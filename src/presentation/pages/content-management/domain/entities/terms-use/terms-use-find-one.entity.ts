import { Status } from '@pages/content-management/domain/enums/terms-use/terms-use-status.enum';
import { TermsUseFindOneProps } from '@pages/content-management/domain/interfaces/terms-use/terms-use-find-one-props.interface';

export class TermsUseFindOneEntity {
    constructor(private readonly props: TermsUseFindOneProps) {}

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

    public with(props: TermsUseFindOneProps): TermsUseFindOneEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new TermsUseFindOneEntity(props);
    }

    toJSON(): TermsUseFindOneProps {
        return { ...this.props };
    }
}

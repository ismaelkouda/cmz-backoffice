import { Status } from '@pages/content-management/domain/enums/privacy-policy/privacy-policy-status.enum';
import { PrivacyPolicyFindOneProps } from '@pages/content-management/domain/interfaces/privacy-policy/privacy-policy-find-one-props.interface';

export class PrivacyPolicyFindOneEntity {
    constructor(private readonly props: PrivacyPolicyFindOneProps) {}

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

    public with(props: PrivacyPolicyFindOneProps): PrivacyPolicyFindOneEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new PrivacyPolicyFindOneEntity(props);
    }

    toJSON(): PrivacyPolicyFindOneProps {
        return { ...this.props };
    }
}

export interface PrivacyPolicyProps {
    uniqId: string;
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    role: string;
    roleStyle: string;
    status: string;
    updatedAt: string;
}

export class PrivacyPolicyEntity {
    constructor(private readonly props: PrivacyPolicyProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get lastName(): string {
        return this.props.lastName;
    }

    get firstName(): string {
        return this.props.firstName;
    }

    get email(): string {
        return this.props.email;
    }

    get phone(): string {
        return this.props.phone;
    }

    get role(): string {
        return this.props.role;
    }

    get roleStyle(): string {
        return this.props.roleStyle;
    }

    get status(): string {
        return this.props.status;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: PrivacyPolicyProps): PrivacyPolicyEntity {
        if (this.updatedAt === props.updatedAt) {
            return this;
        }
        return new PrivacyPolicyEntity(props);
    }
}

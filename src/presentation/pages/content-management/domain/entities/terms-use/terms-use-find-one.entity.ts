export interface TermsUseFindOneProps {
    uniqId: string;
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    role: string;
}
export class TermsUseFindOneEntity {
    constructor(private readonly props: TermsUseFindOneProps) {}

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

    public with(props: TermsUseFindOneProps): TermsUseFindOneEntity {
        if (this.uniqId === props.uniqId) {
            return this;
        }
        return new TermsUseFindOneEntity(props);
    }
}

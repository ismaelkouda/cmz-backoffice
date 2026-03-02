export interface HomeFindOneProps {
    uniqId: string;
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    role: string;
}
export class HomeFindOneEntity {
    constructor(private readonly props: HomeFindOneProps) {}

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

    public with(props: HomeFindOneProps): HomeFindOneEntity {
        if (this.uniqId === props.uniqId) {
            return this;
        }
        return new HomeFindOneEntity(props);
    }
}

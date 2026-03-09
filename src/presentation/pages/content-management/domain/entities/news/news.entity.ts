export interface NewsProps {
    uniqId: string;
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    updatedAt: string;
}

export class NewsEntity {
    constructor(private readonly props: NewsProps) {}

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

    get status(): string {
        return this.props.status;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: NewsProps): NewsEntity {
        if (this.updatedAt === props.updatedAt) {
            return this;
        }
        return new NewsEntity(props);
    }
}

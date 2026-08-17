import { Roles } from '@shared/domain/enums/roles.enum';

export interface ParticipantsFindOneProps {
    uniqId: string;
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    role: Roles | null;
    team: string | null;
    updatedAt: string;
}
export class ParticipantsFindOneEntity {
    constructor(private readonly props: ParticipantsFindOneProps) {}

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

    get role(): Roles | null {
        return this.props.role;
    }

    get team(): string | null {
        return this.props.team;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: ParticipantsFindOneProps): ParticipantsFindOneEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new ParticipantsFindOneEntity(props);
    }
}

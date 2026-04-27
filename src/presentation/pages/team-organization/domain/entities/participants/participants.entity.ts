import {
    Status,
    StatusStyle,
} from '@pages/team-organization/domain/enums/participants/participants-status.enum';
import { ParticipantsProps } from '@pages/team-organization/domain/interfaces/participants/participants-props.entity';
import { Roles, RolesStyle } from '@shared/domain/enums/roles.enum';

export class ParticipantsEntity {
    constructor(private readonly props: ParticipantsProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get actionsRef(): string {
        return this.props.lastName + '-' + this.props.firstName;
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
    roleStyle(role: Roles): RolesStyle {
        const methodMap: Record<Roles, RolesStyle> = {
            [Roles.SUPERVISOR]: RolesStyle.SUPERVISOR,
            [Roles['TEAM-LEADER']]: RolesStyle['TEAM-LEADER'],
            [Roles.AGENT]: RolesStyle.AGENT,
        };
        return methodMap[role];
    }

    get status(): Status {
        return this.props.status;
    }
    statusStyle(status: Status): StatusStyle {
        const methodMap: Record<Status, StatusStyle> = {
            [Status.ACTIVE]: StatusStyle.ACTIVE,
            [Status.INACTIVE]: StatusStyle.INACTIVE,
            [Status.BLOCKED]: StatusStyle.BLOCKED,
            [Status.PENDING]: StatusStyle.PENDING,
        };
        return methodMap[status];
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: ParticipantsProps): ParticipantsEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new ParticipantsEntity(props);
    }
}

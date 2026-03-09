import { Roles, RolesStyle } from '@shared/domain/enums/roles.enum';

import {
    Status,
    StatusStyle,
} from '@presentation/pages/team-organization/domain/enums/participants/participants-status.enum';
import { ParticipantsProps } from '@presentation/pages/team-organization/domain/interfaces/participants/participants-props.entity';

export class ParticipantsEntity {
    constructor(private readonly props: ParticipantsProps) {}

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

    get role(): Roles {
        return this.props.role;
    }
    roleStyle(role: Roles): RolesStyle {
        const methodMap: Record<Roles, RolesStyle> = {
            [Roles.SUPERVISOR]: RolesStyle.SUPERVISOR,
            [Roles.LEADER]: RolesStyle.LEADER,
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
        if (this.updatedAt === props.updatedAt) {
            return this;
        }
        return new ParticipantsEntity(props);
    }
}

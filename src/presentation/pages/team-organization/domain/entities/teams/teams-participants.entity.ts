import { TeamsParticipantsProps } from '@pages/team-organization/domain/interfaces/teams/teams-participants-props.entity';
import { Roles, RolesStyle } from '@shared/domain/enums/roles.enum';
export class TeamsParticipantsEntity {
    constructor(private readonly props: TeamsParticipantsProps) {}

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

    get role(): Roles {
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

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: TeamsParticipantsProps): TeamsParticipantsEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new TeamsParticipantsEntity(props);
    }
}

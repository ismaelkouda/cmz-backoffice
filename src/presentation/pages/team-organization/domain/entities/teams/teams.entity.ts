import {
    Status,
    StatusStyle,
} from '@pages/team-organization/domain/enums/teams/teams-status.enum';
import { TeamsProps } from '@pages/team-organization/domain/interfaces/teams/teams-props.interface';

export class TeamsEntity {
    constructor(private readonly props: TeamsProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get code(): string {
        return this.props.code;
    }
    get name(): string {
        return this.props.name;
    }
    get description(): string {
        return this.props.description;
    }
    get status(): Status {
        return this.props.status;
    }
    statusStyle(status: Status): StatusStyle {
        const methodMap: Record<Status, StatusStyle> = {
            [Status.ACTIVE]: StatusStyle.ACTIVE,
            [Status.INACTIVE]: StatusStyle.INACTIVE,
        };
        return methodMap[status];
    }
    get membersCount(): string {
        return this.props.membersCount;
    }
    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: TeamsProps): TeamsEntity {
        if (this.updatedAt === props.updatedAt) {
            return this;
        }
        return new TeamsEntity(props);
    }
}

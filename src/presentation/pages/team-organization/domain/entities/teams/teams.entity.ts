import { ActionDropdown } from '@shared/domain/enums/action-dropdown.enum';

export interface TeamsProps {
    uniqId: string;
    code: string;
    name: string;
    description: string;
    status: ActionDropdown;
    membersCount: string;
    updatedAt: string;
}

export class TeamsEntity implements TeamsProps {
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
    get status(): ActionDropdown {
        return this.props.status;
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

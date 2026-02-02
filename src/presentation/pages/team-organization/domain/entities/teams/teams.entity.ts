import { ActionDropdown } from "@shared/domain/enums/action-dropdown.enum";

export interface TeamsProps {
    uniqId: string;
    code: string;
    name: string;
    description: string;
    status: ActionDropdown;
    membersCount: string;
    updatedAt: string;
}

export class TeamsEntity {
    constructor(private readonly props: TeamsProps) {}

    get uniqId() { return this.props.uniqId; }
    get code() { return this.props.code; }
    get name() { return this.props.name; }
    get description() { return this.props.description; }
    get status() { return this.props.status; }
    get membersCount() { return this.props.membersCount; }
    get updatedAt() { return this.props.updatedAt; }

    public with(props: TeamsProps): TeamsEntity {
        if (this.updatedAt === props.updatedAt) return this;
        return new TeamsEntity(props);
    }
}

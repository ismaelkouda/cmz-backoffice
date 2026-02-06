import { TeamsTreeNodeEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-tree-node.entity';

export interface TeamsPermissionsProps {
    permissions: TeamsTreeNodeEntity[];
}

export class TeamsPermissionsEntity {
    constructor(public readonly props: TeamsPermissionsProps) {}

    public with(props: TeamsPermissionsProps): TeamsPermissionsEntity {
        if (this.props.permissions === props.permissions) {
            return this;
        }
        return new TeamsPermissionsEntity(props);
    }
}

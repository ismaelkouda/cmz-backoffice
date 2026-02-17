import { TreeNodeEntity } from '@shared/domain/entities/tree-node.entity';

export interface TeamsPermissionsProps {
    permissions: TreeNodeEntity[];
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

import { TreeNodeEntity } from '@shared/domain/entities/tree-node.entity';

export interface ProfilesPermissionsPermissionsProps {
    permissions: TreeNodeEntity[];
}

export class ProfilesPermissionsPermissionsEntity {
    constructor(public readonly props: ProfilesPermissionsPermissionsProps) {}

    public with(
        props: ProfilesPermissionsPermissionsProps
    ): ProfilesPermissionsPermissionsEntity {
        if (this.props.permissions === props.permissions) {
            return this;
        }
        return new ProfilesPermissionsPermissionsEntity(props);
    }
}

import { PermissionsProps } from '@shared/domain/interfaces/permissions-props.interface';

export class ProfilesPermissionsPermissionsEntity {
    constructor(public readonly props: PermissionsProps) {}

    public with(props: PermissionsProps): ProfilesPermissionsPermissionsEntity {
        if (this.props.permissions === props.permissions) {
            return this;
        }
        return new ProfilesPermissionsPermissionsEntity(props);
    }
}

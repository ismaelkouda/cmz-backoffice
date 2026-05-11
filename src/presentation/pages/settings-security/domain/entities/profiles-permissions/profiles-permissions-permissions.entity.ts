import { PermissionsProps } from '@presentation/pages/settings-security/presentation/adapters/profiles-permissions/permissions-props.interface';

export class ProfilesPermissionsPermissionsEntity {
    constructor(public readonly props: PermissionsProps) {}

    public with(props: PermissionsProps): ProfilesPermissionsPermissionsEntity {
        if (this.props.permissions === props.permissions) {
            return this;
        }
        return new ProfilesPermissionsPermissionsEntity(props);
    }
}

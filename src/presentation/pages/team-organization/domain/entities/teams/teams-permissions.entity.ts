import { PermissionsProps } from '@shared/domain/interfaces/permissions-props.interface';

export class TeamsPermissionsEntity {
    constructor(public readonly props: PermissionsProps) {}

    public with(props: PermissionsProps): TeamsPermissionsEntity {
        if (this.props.permissions === props.permissions) {
            return this;
        }
        return new TeamsPermissionsEntity(props);
    }
}

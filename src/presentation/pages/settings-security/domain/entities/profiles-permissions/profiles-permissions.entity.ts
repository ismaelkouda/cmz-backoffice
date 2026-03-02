import { Status } from '@presentation/pages/settings-security/domain/enums/profiles-permissions/profiles-permissions-status.enum';
import { ProfilesPermissionsProps } from '@presentation/pages/settings-security/domain/interfaces/profiles-permissions/profiles-permissions-props.interface';

export class ProfilesPermissionsEntity {
    constructor(private readonly props: ProfilesPermissionsProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get name(): string {
        return this.props.name;
    }
    get slug(): string {
        return this.props.slug;
    }
    get description(): string {
        return this.props.description;
    }
    get usersCount(): string {
        return this.props.usersCount;
    }
    get status(): Status {
        return this.props.status;
    }
    get createdAt(): string {
        return this.props.createdAt;
    }
    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: ProfilesPermissionsProps): ProfilesPermissionsEntity {
        if (this.updatedAt === props.updatedAt) {
            return this;
        }
        return new ProfilesPermissionsEntity(props);
    }
}

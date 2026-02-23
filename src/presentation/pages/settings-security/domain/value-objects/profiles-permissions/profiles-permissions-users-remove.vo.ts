import { ProfilesPermissionsUsersRemoveDto } from '@presentation/pages/settings-security/application/dto/profiles-permissions/profiles-permissions-users-remove.dto';

export class ProfilesPermissionsUsersRemoveVo {
    public readonly uniqId: string;
    public readonly users: string[];

    constructor(props: { uniqId: string; users: string[] }) {
        this.uniqId = props.uniqId;
        this.users = props.users;
    }

    static fromDto(
        dto: ProfilesPermissionsUsersRemoveDto
    ): ProfilesPermissionsUsersRemoveVo {
        const uniqId = dto?.uniqId;
        const users = dto?.users?.map((user) => user?.trim()) || [];

        if (!uniqId) {
            throw new Error(
                'uniqId is required to remove ProfilesPermissions Users'
            );
        }

        if (!users.length) {
            throw new Error(
                'users is required to remove ProfilesPermissions Users'
            );
        }

        return new ProfilesPermissionsUsersRemoveVo({
            uniqId,
            users,
        });
    }
}

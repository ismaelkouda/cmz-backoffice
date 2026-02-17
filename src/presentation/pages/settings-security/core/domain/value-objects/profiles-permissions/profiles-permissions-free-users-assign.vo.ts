import { ProfilesPermissionsFreeUsersAssignDto } from '@presentation/pages/settings-security/core/application/dto/profiles-permissions/profiles-permissions-free-users-assign.dto';

export class ProfilesPermissionsFreeUsersAssignVo {
    public readonly uniqId: string;
    public readonly users: string[];

    constructor(props: { uniqId: string; users: string[] }) {
        this.uniqId = props.uniqId;
        this.users = props.users;
    }

    static fromDto(
        dto: ProfilesPermissionsFreeUsersAssignDto
    ): ProfilesPermissionsFreeUsersAssignVo {
        const uniqId = dto?.uniqId;
        const users = dto?.users?.map((user) => user?.trim()) || [];

        if (!uniqId) {
            throw new Error(
                'uniqId is required to assign ProfilesPermissions Users'
            );
        }

        if (!users.length) {
            throw new Error(
                'users is required to assign ProfilesPermissions Users'
            );
        }

        return new ProfilesPermissionsFreeUsersAssignVo({
            uniqId,
            users,
        });
    }
}

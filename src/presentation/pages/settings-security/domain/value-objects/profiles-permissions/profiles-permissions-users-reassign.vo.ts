import { ProfilesPermissionsUsersReassignDto } from '@presentation/pages/settings-security/application/dto/profiles-permissions/profiles-permissions-users-reassign.dto';

export class ProfilesPermissionsUsersReassignVo {
    public readonly uniqId: string;
    public readonly users: string[];

    constructor(props: { uniqId: string; users: string[] }) {
        this.uniqId = props.uniqId;
        this.users = props.users;
    }

    static fromDto(
        dto: ProfilesPermissionsUsersReassignDto
    ): ProfilesPermissionsUsersReassignVo {
        const uniqId = dto?.uniqId;
        const users = dto?.users?.map((user) => user?.trim()) || [];

        if (!uniqId) {
            throw new Error(
                'uniqId is required to reassign ProfilesPermissions Users'
            );
        }

        if (!users.length) {
            throw new Error(
                'users is required to reassign ProfilesPermissions Users'
            );
        }

        return new ProfilesPermissionsUsersReassignVo({
            uniqId,
            users,
        });
    }
}

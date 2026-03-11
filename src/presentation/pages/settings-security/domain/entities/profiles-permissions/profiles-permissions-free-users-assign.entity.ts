import { ProfilesPermissionsFreeUsersAssignVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-free-users-assign.vo';

export class ProfilesPermissionsFreeUsersAssignEntity {
    constructor(
        public readonly uniqId: string,
        public readonly users: string[]
    ) {}

    static toEntity(
        vo: ProfilesPermissionsFreeUsersAssignVo
    ): ProfilesPermissionsFreeUsersAssignEntity {
        return new ProfilesPermissionsFreeUsersAssignEntity(
            vo.uniqId,
            vo.users
        );
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
            users: this.users,
        });
    }
}

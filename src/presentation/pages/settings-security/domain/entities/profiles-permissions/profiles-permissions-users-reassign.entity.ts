import { ProfilesPermissionsUsersReassignVo } from '@presentation/pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-users-reassign.vo';

export class ProfilesPermissionsUsersReassignEntity {
    constructor(
        public readonly uniqId: string,
        public readonly users: string[]
    ) {}

    static toEntity(
        vo: ProfilesPermissionsUsersReassignVo
    ): ProfilesPermissionsUsersReassignEntity {
        return new ProfilesPermissionsUsersReassignEntity(vo.uniqId, vo.users);
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
            users: this.users,
        });
    }
}

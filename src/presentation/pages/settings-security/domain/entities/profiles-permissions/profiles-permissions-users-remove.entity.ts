import { ProfilesPermissionsUsersRemoveVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-users-remove.vo';

export class ProfilesPermissionsUsersRemoveEntity {
    constructor(
        public readonly uniqId: string,
        public readonly users: string[]
    ) {}

    static toEntity(
        vo: ProfilesPermissionsUsersRemoveVo
    ): ProfilesPermissionsUsersRemoveEntity {
        return new ProfilesPermissionsUsersRemoveEntity(vo.uniqId, vo.users);
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
            users: this.users,
        });
    }
}

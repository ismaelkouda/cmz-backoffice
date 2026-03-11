import { ProfilesPermissionsUsersAssignVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-users-assign.vo';

export class ProfilesPermissionsUsersAssignEntity {
    constructor(
        public readonly uniqId: string,
        public readonly users: string[]
    ) {}

    static fromVo(
        vo: ProfilesPermissionsUsersAssignVo
    ): ProfilesPermissionsUsersAssignEntity {
        return new ProfilesPermissionsUsersAssignEntity(vo.uniqId, vo.users);
    }

    hasParticipant(id: string): boolean {
        return this.users.includes(id);
    }
}

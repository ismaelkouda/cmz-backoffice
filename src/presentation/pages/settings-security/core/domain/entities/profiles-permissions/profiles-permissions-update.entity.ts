import { ProfilesPermissionsUpdateVo } from '@presentation/pages/settings-security/core/domain/value-objects/profiles-permissions/profiles-permissions-update.vo';

export class ProfilesPermissionsUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly name: string,
        public readonly description: string,
        public readonly permissions: string[]
    ) {}

    static fromVo(
        vo: ProfilesPermissionsUpdateVo
    ): ProfilesPermissionsUpdateEntity {
        return new ProfilesPermissionsUpdateEntity(
            vo.uniqId,
            vo.name,
            vo.description,
            vo.permissions
        );
    }
}

import { ProfilesPermissionsCreateVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-create.vo';

export class ProfilesPermissionsCreateEntity {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly permissions: Record<string, string[]>
    ) {}

    static fromVo(
        vo: ProfilesPermissionsCreateVo
    ): ProfilesPermissionsCreateEntity {
        return new ProfilesPermissionsCreateEntity(
            vo.name,
            vo.description,
            vo.permissions
        );
    }
}

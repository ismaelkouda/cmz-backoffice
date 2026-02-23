import { ProfilesPermissionsFindOneFilterVo } from '@presentation/pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-find-one-filter.vo';

export class ProfilesPermissionsFindOneFilterEntity {
    constructor(public readonly uniqId?: string) {}

    static fromVo(
        vo?: ProfilesPermissionsFindOneFilterVo
    ): ProfilesPermissionsFindOneFilterEntity {
        return new ProfilesPermissionsFindOneFilterEntity(vo?.uniqId);
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
        });
    }
}

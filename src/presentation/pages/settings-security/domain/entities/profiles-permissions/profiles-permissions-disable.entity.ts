import { ProfilesPermissionsDisableVo } from '@presentation/pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-disable.vo';

export class ProfilesPermissionsDisableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(
        vo: ProfilesPermissionsDisableVo
    ): ProfilesPermissionsDisableEntity {
        return new ProfilesPermissionsDisableEntity(vo.uniqId);
    }

    appliesToAdminScope(): boolean {
        return this.uniqId === 'ADMIN_ACTION';
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
        });
    }
}

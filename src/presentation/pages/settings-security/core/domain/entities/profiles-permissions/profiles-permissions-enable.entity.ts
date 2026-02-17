import { ProfilesPermissionsEnableVo } from '@presentation/pages/settings-security/core/domain/value-objects/profiles-permissions/profiles-permissions-enable.vo';

export class ProfilesPermissionsEnableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(
        vo: ProfilesPermissionsEnableVo
    ): ProfilesPermissionsEnableEntity {
        return new ProfilesPermissionsEnableEntity(vo.uniqId);
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

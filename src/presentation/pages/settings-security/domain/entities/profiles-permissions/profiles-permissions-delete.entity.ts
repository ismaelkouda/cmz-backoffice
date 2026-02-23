import { ProfilesPermissionsDeleteVo } from '@presentation/pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-delete.vo';

export class ProfilesPermissionsDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(
        vo: ProfilesPermissionsDeleteVo
    ): ProfilesPermissionsDeleteEntity {
        return new ProfilesPermissionsDeleteEntity(vo.uniqId);
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

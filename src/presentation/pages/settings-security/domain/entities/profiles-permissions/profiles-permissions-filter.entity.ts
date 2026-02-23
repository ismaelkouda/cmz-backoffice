import { ProfilesPermissionsFilterVo } from '@presentation/pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-filter.vo';

export class ProfilesPermissionsFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly user?: string,
        public readonly isActive?: string
    ) {}

    static fromVo(
        vo: ProfilesPermissionsFilterVo
    ): ProfilesPermissionsFilterEntity {
        return new ProfilesPermissionsFilterEntity(
            vo.search,
            vo.user,
            vo.isActive
        );
    }

    appliesToAdminScope(): boolean {
        return this.user === 'ADMIN_ACTION';
    }

    describe(): string {
        return JSON.stringify({
            search: this.search,
            user: this.user,
            isActive: this.isActive,
        });
    }
}

import { Status } from '@pages/settings-security/domain/enums/profiles-permissions/profiles-permissions-status.enum';
import { ProfilesPermissionsFilterVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-filter.vo';
export class ProfilesPermissionsFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly user?: string,
        public readonly status?: Status
    ) {}

    static fromVo(
        vo: ProfilesPermissionsFilterVo
    ): ProfilesPermissionsFilterEntity {
        return new ProfilesPermissionsFilterEntity(
            vo.search,
            vo.user,
            vo.status
        );
    }

    appliesToAdminScope(): boolean {
        return this.user === 'ADMIN_ACTION';
    }

    describe(): string {
        return JSON.stringify({
            search: this.search,
            user: this.user,
            status: this.status,
        });
    }
}

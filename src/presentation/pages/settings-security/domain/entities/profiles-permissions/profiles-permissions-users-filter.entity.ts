import { ProfilesPermissionsUsersFilterVo } from '@pages/settings-security/domain/value-objects/profiles-permissions/profiles-permissions-users-filter.vo';

export class ProfilesPermissionsUsersFilterEntity {
    constructor(
        public readonly uniqId: string,
        public readonly search?: string,
        public readonly userEmail?: string,
        public readonly phone?: string
    ) {}

    static toEntity(
        vo: ProfilesPermissionsUsersFilterVo
    ): ProfilesPermissionsUsersFilterEntity {
        return new ProfilesPermissionsUsersFilterEntity(
            vo.uniqId,
            vo.search ?? undefined,
            vo.userEmail ?? undefined,
            vo.phone ?? undefined
        );
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
            search: this.search,
            userEmail: this.userEmail,
            phone: this.phone,
        });
    }
}

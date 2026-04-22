import { UsersFilterVo } from '@pages/settings-security/domain/value-objects/users/users-filter.vo';

export class UsersFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly profile?: string,
        public readonly role?: string,
        public readonly isActive?: string
    ) {}

    static fromVo(vo: UsersFilterVo): UsersFilterEntity {
        return new UsersFilterEntity(
            vo.search,
            vo.profile,
            vo.role,
            vo.isActive
        );
    }

    describe(): string {
        return JSON.stringify({
            search: this.search,
            profile: this.profile,
            role: this.role,
            isActive: this.isActive,
        });
    }
}

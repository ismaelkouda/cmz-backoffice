import { UsersFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/users/users-filter.vo';

export class UsersFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly profile?: string,
        public readonly responsibility?: string,
        public readonly isActive?: boolean
    ) {}

    static fromVo(vo: UsersFilterVo): UsersFilterEntity {
        return new UsersFilterEntity(
            vo.search,
            vo.profile,
            vo.responsibility,
            vo.isActive
        );
    }

    describe(): string {
        return JSON.stringify({
            search: this.search,
            profile: this.profile,
            responsibility: this.responsibility,
            isActive: this.isActive,
        });
    }
}

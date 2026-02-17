import { TeamsFilterVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-filter.vo';

export class TeamsFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly member?: string,
        public readonly isActive?: string
    ) {}

    static fromVo(vo: TeamsFilterVo): TeamsFilterEntity {
        return new TeamsFilterEntity(vo.search, vo.member, vo.isActive);
    }

    appliesToAdminScope(): boolean {
        return this.member === 'ADMIN_ACTION';
    }

    describe(): string {
        return JSON.stringify({
            search: this.search,
            member: this.member,
            isActive: this.isActive,
        });
    }
}

import { Status } from '@pages/team-organization/domain/enums/teams/teams-status.enum';
import { TeamsFilterVo } from '@pages/team-organization/domain/value-objects/teams/teams-filter.vo';

export class TeamsFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly member?: string,
        public readonly status?: Status
    ) {}

    static fromVo(vo: TeamsFilterVo): TeamsFilterEntity {
        return new TeamsFilterEntity(vo.search, vo.member, vo.status);
    }

    appliesToAdminScope(): boolean {
        return this.member === 'ADMIN_ACTION';
    }

    describe(): string {
        return JSON.stringify({
            search: this.search,
            member: this.member,
            status: this.status,
        });
    }
}

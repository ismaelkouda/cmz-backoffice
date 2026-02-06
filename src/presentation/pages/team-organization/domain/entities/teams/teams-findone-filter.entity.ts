import { TeamsFindOneFilterVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-findone-filter.vo';

export class TeamsFindOneFilterEntity {
    constructor(public readonly uniqId?: string) {}

    static fromVo(vo?: TeamsFindOneFilterVo): TeamsFindOneFilterEntity {
        return new TeamsFindOneFilterEntity(vo?.uniqId);
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
        });
    }
}

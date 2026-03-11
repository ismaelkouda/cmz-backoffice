import { TeamsParticipantsFilterVo } from '@pages/team-organization/domain/value-objects/teams/teams-participants-filter.vo';

export class TeamsParticipantsFilterEntity {
    constructor(
        public readonly uniqId: string,
        public readonly search?: string
    ) {}

    static toEntity(
        vo: TeamsParticipantsFilterVo
    ): TeamsParticipantsFilterEntity {
        return new TeamsParticipantsFilterEntity(
            vo.uniqId,
            vo.search ?? undefined
        );
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
            search: this.search,
        });
    }
}

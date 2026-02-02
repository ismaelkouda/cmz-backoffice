import { TeamsParticipantsFilterVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-participants-filter.vo';

export class TeamsParticipantsFilterEntity {
    constructor(
        public readonly uniqId: string,
        public readonly search?: string,
        public readonly participantEmail?: string,
        public readonly phone?: string
    ) {}

    static toEntity(
        vo: TeamsParticipantsFilterVo
    ): TeamsParticipantsFilterEntity {
        return new TeamsParticipantsFilterEntity(
            vo.uniqId,
            vo.search ?? undefined,
            vo.participantEmail ?? undefined,
            vo.phone ?? undefined
        );
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
            search: this.search,
            participantEmail: this.participantEmail,
            phone: this.phone,
        });
    }
}

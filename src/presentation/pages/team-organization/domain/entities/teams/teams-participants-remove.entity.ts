import { TeamsParticipantsRemoveVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-participants-remove.vo';

export class TeamsParticipantsRemoveEntity {
    constructor(
        public readonly uniqId: string,
        public readonly participants: string[]
    ) {}

    static toEntity(
        vo: TeamsParticipantsRemoveVo
    ): TeamsParticipantsRemoveEntity {
        return new TeamsParticipantsRemoveEntity(vo.uniqId, vo.participants);
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
            participants: this.participants,
        });
    }
}

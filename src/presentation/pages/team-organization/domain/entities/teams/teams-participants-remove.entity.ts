import { TeamsParticipantsRemoveVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-participants-remove.vo';

export class TeamsParticipantsRemoveEntity {
    constructor(
        public readonly uniqId: string,
        public readonly participants: string[]
    ) {}

    static fromVo(vo: TeamsParticipantsRemoveVo) {
        return new TeamsParticipantsRemoveEntity(vo.uniqId, vo.participants);
    }

    hasParticipant(id: string): boolean {
        return this.participants.includes(id);
    }
}

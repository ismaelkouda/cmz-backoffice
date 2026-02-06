import { TeamsParticipantsAssignVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-participants-assign.vo';

export class TeamsParticipantsAssignEntity {
    constructor(
        public readonly uniqId: string,
        public readonly participants: string[]
    ) {}

    static fromVo(vo: TeamsParticipantsAssignVo) {
        return new TeamsParticipantsAssignEntity(vo.uniqId, vo.participants);
    }

    hasParticipant(id: string): boolean {
        return this.participants.includes(id);
    }
}

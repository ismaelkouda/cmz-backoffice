import { TeamsParticipantsReassignVo } from "@presentation/pages/team-organization/domain/value-objects/teams/teams-participants-reassign.vo";

export class TeamsParticipantsReassignEntity {
    constructor(
        public readonly uniqId: string,
        public readonly participants: string[]
    ) {}

    static fromVo(vo: TeamsParticipantsReassignVo) {
        return new TeamsParticipantsReassignEntity(vo.uniqId, vo.participants);
    }

    hasParticipant(id: string): boolean {
        return this.participants.includes(id);
    }
}

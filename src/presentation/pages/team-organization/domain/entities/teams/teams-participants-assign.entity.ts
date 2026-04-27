import { TeamsParticipantsAssignVo } from '@pages/team-organization/domain/value-objects/teams/teams-participants-assign.vo';
import { Roles } from '@shared/domain/enums/roles.enum';

export class TeamsParticipantsAssignEntity {
    constructor(
        public readonly uniqId: string,
        public readonly roles: Roles,
        public readonly participants: string[]
    ) {}

    static fromVo(
        vo: TeamsParticipantsAssignVo
    ): TeamsParticipantsAssignEntity {
        return new TeamsParticipantsAssignEntity(
            vo.uniqId,
            vo.roles,
            vo.participants
        );
    }

    hasParticipant(id: string): boolean {
        return this.participants.includes(id);
    }
}

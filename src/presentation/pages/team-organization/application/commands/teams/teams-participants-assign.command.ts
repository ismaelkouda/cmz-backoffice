import { Roles } from '@shared/domain/enums/roles.enum';

export class TeamsParticipantsAssignCommand {
    constructor(
        public readonly uniqId: string,
        public readonly roles: Roles,
        public readonly participants: string[]
    ) {}
}

import { Status } from '@presentation/pages/team-organization/domain/enums/teams/teams-status.enum';

export class TeamsQuery {
    constructor(
        public readonly search?: string,
        public readonly member?: string,
        public readonly status?: Status
    ) {}
}

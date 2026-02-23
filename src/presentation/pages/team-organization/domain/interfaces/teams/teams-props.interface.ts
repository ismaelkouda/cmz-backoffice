import { Status } from '@presentation/pages/team-organization/domain/enums/teams/teams-status.enum';

export interface TeamsProps {
    uniqId: string;
    code: string;
    name: string;
    description: string;
    status: Status;
    membersCount: string;
    updatedAt: string;
}

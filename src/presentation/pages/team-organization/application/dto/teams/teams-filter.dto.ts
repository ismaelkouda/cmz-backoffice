import { Status } from '@pages/team-organization/domain/enums/teams/teams-status.enum';
export interface TeamsFilterDto {
    search?: string;
    member?: string;
    status?: Status;
}

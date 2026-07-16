import { TeamsFilterDto } from '@pages/team-organization/application/dto/teams/teams-filter.dto';
import { Status } from '@pages/team-organization/domain/enums/teams/teams-status.enum';

export interface TeamsFilterVo {
    search?: string;
    member?: string;
    status?: Status;
}

export function teamsFilterVo(
    dto: TeamsFilterDto | null = {} as TeamsFilterDto
): TeamsFilterVo {
    return {
        search: dto?.search?.trim() || undefined,
        member: dto?.member,
        status: dto?.status,
    };
}

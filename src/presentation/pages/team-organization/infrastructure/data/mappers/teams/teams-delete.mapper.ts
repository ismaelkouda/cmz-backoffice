import { TeamsDeleteDto } from '@pages/team-organization/application/dto/teams/teams-delete.dto';
import { TeamsDeleteApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-delete-api.dto';

export function teamsDeleteMapper(dto: TeamsDeleteDto): TeamsDeleteApiDto {
    const prams = {} as TeamsDeleteApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}

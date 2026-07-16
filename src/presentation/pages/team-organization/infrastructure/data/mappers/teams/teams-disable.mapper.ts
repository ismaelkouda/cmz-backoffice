import { TeamsDisableDto } from '@pages/team-organization/application/dto/teams/teams-disable.dto';
import { TeamsDisableApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-disable-api.dto';

export function teamsDisableMapper(dto: TeamsDisableDto): TeamsDisableApiDto {
    const prams = {} as TeamsDisableApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}

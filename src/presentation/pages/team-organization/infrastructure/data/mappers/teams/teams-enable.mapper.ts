import { TeamsEnableDto } from '@pages/team-organization/application/dto/teams/teams-enable.dto';
import { TeamsEnableApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-enable-api.dto';

export function teamsEnableMapper(dto: TeamsEnableDto): TeamsEnableApiDto {
    const prams = {} as TeamsEnableApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}

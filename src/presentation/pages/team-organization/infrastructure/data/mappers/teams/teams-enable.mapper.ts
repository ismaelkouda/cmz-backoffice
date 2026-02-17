import { TeamsEnableEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-enable.entity';
import { TeamsEnableApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-enable-api.dto';

export function teamsEnableMapper(vo: TeamsEnableEntity): TeamsEnableApiDto {
    const prams = {} as TeamsEnableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

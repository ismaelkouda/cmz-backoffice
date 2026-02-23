import { TeamsDisableEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-disable.entity';
import { TeamsDisableApiDto } from '@presentation/pages/team-organization/infrastructure/api/dto/teams/teams-disable-api.dto';

export function teamsDisableMapper(vo: TeamsDisableEntity): TeamsDisableApiDto {
    const prams = {} as TeamsDisableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

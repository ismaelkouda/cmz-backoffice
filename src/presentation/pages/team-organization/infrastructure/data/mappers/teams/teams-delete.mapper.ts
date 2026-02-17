import { TeamsDeleteEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-delete.entity';
import { TeamsDeleteApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-delete-api.dto';

export function teamsDeleteMapper(vo: TeamsDeleteEntity): TeamsDeleteApiDto {
    const prams = {} as TeamsDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

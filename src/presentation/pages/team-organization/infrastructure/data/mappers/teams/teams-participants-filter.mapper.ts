import { TeamsParticipantsFilterEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-filter.entity';
import { TeamsParticipantsFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-participants-filter-api.dto';

export function teamsParticipantsFilterMapper(
    vo: TeamsParticipantsFilterEntity
): TeamsParticipantsFilterApiDto {
    const params: TeamsParticipantsFilterApiDto =
        {} as TeamsParticipantsFilterApiDto;

    if (vo.uniqId) {
        params.uniq_id = vo.uniqId;
    }

    if (vo.search) {
        params.search = vo.search;
    }

    return params;
}

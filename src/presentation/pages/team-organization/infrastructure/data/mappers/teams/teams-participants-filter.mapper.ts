import { TeamsParticipantsFilterEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants-filter.entity';
import { TeamsParticipantsFilterApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-participants-filter-api.dto';

export function teamsParticipantsFilterMapper(
    vo: TeamsParticipantsFilterEntity
): TeamsParticipantsFilterApiDto {
    const params: TeamsParticipantsFilterApiDto =
        {} as TeamsParticipantsFilterApiDto;

    if (vo.uniqId) {
        params.id = vo.uniqId;
    }

    if (vo.search) {
        params.search = vo.search;
    }
    if (vo.participantEmail) {
        params.user_email = vo.participantEmail;
    }
    if (vo.phone) {
        params.phone = vo.phone;
    }

    return params;
}

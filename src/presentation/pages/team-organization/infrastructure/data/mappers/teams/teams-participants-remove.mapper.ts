import { TeamsParticipantsRemoveEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-remove.entity';
import { TeamsParticipantsRemoveApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-participants-remove-api.dto';

export function teamsParticipantsRemoveMapper(
    vo: TeamsParticipantsRemoveEntity
): TeamsParticipantsRemoveApiDto {
    const params: TeamsParticipantsRemoveApiDto =
        {} as TeamsParticipantsRemoveApiDto;

    if (vo.uniqId) {
        params.uniq_id = vo.uniqId;
    }

    if (vo.participants) {
        params.member_ids = vo.participants;
    }

    return params;
}

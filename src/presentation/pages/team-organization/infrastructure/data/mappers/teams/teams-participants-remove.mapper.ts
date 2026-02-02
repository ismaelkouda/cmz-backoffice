import { TeamsParticipantsRemoveEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants-remove.entity';
import { TeamsParticipantsRemoveApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-participants-remove-api.dto';

export function teamsParticipantsRemoveMapper(
    vo: TeamsParticipantsRemoveEntity
): TeamsParticipantsRemoveApiDto {
    const params: TeamsParticipantsRemoveApiDto =
        {} as TeamsParticipantsRemoveApiDto;

    if (vo.uniqId) {
        params.uniq_id = vo.uniqId;
    }

    if (vo.participants) {
        params.participants = vo.participants;
    }

    return params;
}

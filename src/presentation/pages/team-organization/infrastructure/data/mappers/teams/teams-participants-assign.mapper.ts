import { TeamsParticipantsAssignEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-assign.entity';
import { TeamsParticipantsAssignApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-participants-assign-api.dto';

export function teamsParticipantsAssignMapper(
    vo: TeamsParticipantsAssignEntity
): TeamsParticipantsAssignApiDto {
    const params: TeamsParticipantsAssignApiDto =
        {} as TeamsParticipantsAssignApiDto;

    if (vo.uniqId) {
        params.uniq_id = vo.uniqId;
    }

    if (vo.participants) {
        params.member_ids = vo.participants;
    }

    return params;
}

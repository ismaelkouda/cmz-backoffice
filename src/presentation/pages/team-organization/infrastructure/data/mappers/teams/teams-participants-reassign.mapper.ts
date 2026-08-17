import { TeamsParticipantsReassignEntity } from '@pages/team-organization/domain/entities/teams/teams-participants-reassign.entity';
import { TeamsParticipantsReassignApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-participants-reassign-api.dto';

export function teamsParticipantsReassignMapper(
    vo: TeamsParticipantsReassignEntity
): TeamsParticipantsReassignApiDto {
    const params: TeamsParticipantsReassignApiDto =
        {} as TeamsParticipantsReassignApiDto;

    if (vo.uniqId) {
        params.uniq_id = vo.uniqId;
    }

    if (vo.participants) {
        params.member_ids = vo.participants;
    }

    return params;
}

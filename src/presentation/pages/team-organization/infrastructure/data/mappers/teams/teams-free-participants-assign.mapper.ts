import { TeamsFreeParticipantsAssignEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-free-participants-assign.entity';
import { TeamsFreeParticipantsAssignApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-free-participants-assign-api.dto';

export function teamsFreeParticipantsAssignMapper(
    vo: TeamsFreeParticipantsAssignEntity
): TeamsFreeParticipantsAssignApiDto {
    const params: TeamsFreeParticipantsAssignApiDto =
        {} as TeamsFreeParticipantsAssignApiDto;

    if (vo.uniqId) {
        params.uniqId = vo.uniqId;
    }

    if (vo.participants) {
        params.participants = vo.participants;
    }

    return params;
}

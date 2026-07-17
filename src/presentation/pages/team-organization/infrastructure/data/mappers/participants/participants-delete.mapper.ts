import { ParticipantsDeleteDto } from '@pages/team-organization/application/dto/participants/participants-delete.dto';
import { ParticipantsDeleteApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-delete-api.dto';

export function participantsDeleteMapper(
    dto: ParticipantsDeleteDto
): ParticipantsDeleteApiDto {
    const prams = {} as ParticipantsDeleteApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}

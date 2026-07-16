import { ParticipantsDisableDto } from '@pages/team-organization/application/dto/participants/participants-disable.dto';
import { ParticipantsDisableApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-disable-api.dto';

export function participantsDisableMapper(
    dto: ParticipantsDisableDto
): ParticipantsDisableApiDto {
    const prams = {} as ParticipantsDisableApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}

import { ParticipantsEnableDto } from '@pages/team-organization/application/dto/participants/participants-enable.dto';
import { ParticipantsEnableApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-enable-api.dto';

export function participantsEnableMapper(
    dto: ParticipantsEnableDto
): ParticipantsEnableApiDto {
    const prams = {} as ParticipantsEnableApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}

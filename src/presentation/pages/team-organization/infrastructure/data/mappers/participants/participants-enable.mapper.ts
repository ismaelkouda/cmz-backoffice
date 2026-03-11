import { ParticipantsEnableEntity } from '@pages/team-organization/domain/entities/participants/participants-enable.entity';
import { ParticipantsEnableApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-enable-api.dto';

export function participantsEnableMapper(
    vo: ParticipantsEnableEntity
): ParticipantsEnableApiDto {
    const prams = {} as ParticipantsEnableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

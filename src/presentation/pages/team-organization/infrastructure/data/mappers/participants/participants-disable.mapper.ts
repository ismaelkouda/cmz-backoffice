import { ParticipantsDisableEntity } from '@pages/team-organization/domain/entities/participants/participants-disable.entity';
import { ParticipantsDisableApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-disable-api.dto';

export function participantsDisableMapper(
    vo: ParticipantsDisableEntity
): ParticipantsDisableApiDto {
    const prams = {} as ParticipantsDisableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

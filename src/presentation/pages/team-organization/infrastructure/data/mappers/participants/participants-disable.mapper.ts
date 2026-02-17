import { ParticipantsDisableEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-disable.entity';
import { ParticipantsDisableApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/participants-disable-api.dto';

export function participantsDisableMapper(
    vo: ParticipantsDisableEntity
): ParticipantsDisableApiDto {
    const prams = {} as ParticipantsDisableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

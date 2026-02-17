import { ParticipantsDeleteEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-delete.entity';
import { ParticipantsDeleteApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/participants-delete-api.dto';

export function participantsDeleteMapper(
    vo: ParticipantsDeleteEntity
): ParticipantsDeleteApiDto {
    const prams = {} as ParticipantsDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

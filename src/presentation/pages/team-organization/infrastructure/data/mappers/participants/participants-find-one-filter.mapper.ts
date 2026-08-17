import { ParticipantsFindOneFilterEntity } from '@pages/team-organization/domain/entities/participants/participants-find-one-filter.entity';
import { ParticipantsFindOneFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-find-one-filter-api.dto';

export function participantsFindOneFilterMapper(
    entity: ParticipantsFindOneFilterEntity
): ParticipantsFindOneFilterApiDto {
    const params: ParticipantsFindOneFilterApiDto =
        {} as ParticipantsFindOneFilterApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}

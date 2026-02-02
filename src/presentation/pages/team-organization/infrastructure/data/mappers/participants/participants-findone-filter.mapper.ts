import { ParticipantsFindOneFilterEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-findone-filter.entity';
import { ParticipantsFindOneFilterApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/participants-findone-filter-api.dto';

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

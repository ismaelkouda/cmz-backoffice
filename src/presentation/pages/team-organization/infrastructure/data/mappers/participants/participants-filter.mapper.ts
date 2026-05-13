import { ParticipantsFilterEntity } from '@pages/team-organization/domain/entities/participants/participants-filter.entity';
import { ParticipantsFilterApiDto } from '@pages/team-organization/infrastructure/api/dto/participants/participants-filter-api.dto';

export function participantsFilterMapper(
    entity: ParticipantsFilterEntity
): ParticipantsFilterApiDto {
    const params: ParticipantsFilterApiDto = {} as ParticipantsFilterApiDto;

    if (entity.search) {
        params.search = entity.search;
    }
    if (entity.role) {
        params.role = entity.role;
    }
    if (entity.status !== undefined) {
        params.is_active = !!entity.status;
    }

    return params;
}

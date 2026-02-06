import { ParticipantsFilterEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-filter.entity';
import { ParticipantsFilterApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/participants-filter-api.dto';

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
    if (entity.isActive !== undefined) {
        params.is_active = entity.isActive;
    }

    return params;
}

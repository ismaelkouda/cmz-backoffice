import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

import { TeamsParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-participants.entity';
import { TeamsParticipantsItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-participants-response-api.dto';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TeamsParticipantsMapper extends PaginatedMapper<
    TeamsParticipantsEntity,
    TeamsParticipantsItemApiDto
> {
    private readonly entityCache = new Map<string, TeamsParticipantsEntity>();

    protected mapItemFromDto(
        dto: TeamsParticipantsItemApiDto
    ): TeamsParticipantsEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });
        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : TeamsParticipantsEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

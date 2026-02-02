import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

import { ParticipantsEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants.entity';
import { ParticipantsItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/participants-response-api.dto';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsMapper extends PaginatedMapper<
    ParticipantsEntity,
    ParticipantsItemApiDto
> {
    private readonly entityCache = new Map<string, ParticipantsEntity>();

    protected mapItemFromDto(dto: ParticipantsItemApiDto): ParticipantsEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });
        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : ParticipantsEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

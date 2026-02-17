import { Injectable } from '@angular/core';

import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { TeamsSelectEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-select.entity';
import { TeamsSelectItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-select-api.dto';

@Injectable({ providedIn: 'root' })
export class TeamsSelectMapper extends ArrayResponseMapper<
    TeamsSelectEntity,
    TeamsSelectItemApiDto
> {
    private readonly entityCache = new Map<string, TeamsSelectEntity>();

    protected mapItemFromDto(dto: TeamsSelectItemApiDto): TeamsSelectEntity {
        MapperUtils.validateDto(dto, { required: ['uniq_id'] });
        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : TeamsSelectEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

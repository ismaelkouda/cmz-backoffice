import { Injectable } from '@angular/core';

import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { RegionsSelectEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-select.entity';
import { RegionsSelectItemApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/regions/regions-select-response-api.dto';

@Injectable({ providedIn: 'root' })
export class RegionsSelectMapper extends ArrayResponseMapper<
    RegionsSelectEntity,
    RegionsSelectItemApiDto
> {
    private readonly entityCache = new Map<string, RegionsSelectEntity>();

    protected override mapItemFromDto(
        dto: RegionsSelectItemApiDto
    ): RegionsSelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : RegionsSelectEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

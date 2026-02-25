import { Injectable } from '@angular/core';

import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { RegionsEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions.entity';
import { RegionsItemApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/regions/regions-response-api.dto';

@Injectable({ providedIn: 'root' })
export class RegionsMapper extends PaginatedMapper<
    RegionsEntity,
    RegionsItemApiDto
> {
    private readonly entityCache = new Map<string, RegionsEntity>();

    protected override mapItemFromDto(dto: RegionsItemApiDto): RegionsEntity {
        MapperUtils.validateDto(dto, {
            required: ['id'],
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(dto) : RegionsEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

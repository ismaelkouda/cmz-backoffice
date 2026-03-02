import { Injectable } from '@angular/core';

import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { MunicipalitiesEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';
import { MunicipalitiesItemApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-response-api.dto';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesMapper extends PaginatedMapper<
    MunicipalitiesEntity,
    MunicipalitiesItemApiDto
> {
    private readonly entityCache = new Map<string, MunicipalitiesEntity>();

    protected override mapItemFromDto(
        dto: MunicipalitiesItemApiDto
    ): MunicipalitiesEntity {
        MapperUtils.validateDto(dto, {
            required: ['id'],
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : MunicipalitiesEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

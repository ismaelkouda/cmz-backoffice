import { Injectable } from '@angular/core';
import { RegionsFindOneEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';
import { RegionsFindOneItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class RegionsFindOneMapper extends SimpleResponseMapper<
    RegionsFindOneEntity,
    RegionsFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, RegionsFindOneEntity>();

    protected override mapItemFromDto(
        dto: RegionsFindOneItemApiDto
    ): RegionsFindOneEntity {
        MapperUtils.validateDto(dto, {
            required: ['id'],
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : RegionsFindOneEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

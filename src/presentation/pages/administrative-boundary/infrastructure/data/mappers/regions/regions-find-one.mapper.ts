import { inject, Injectable } from '@angular/core';
import { RegionsFindOneEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';
import { RegionsFindOneItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-find-one-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { StatusMapper } from './regions-status.mapper';

@Injectable({ providedIn: 'root' })
export class RegionsFindOneMapper extends SimpleResponseMapper<
    RegionsFindOneEntity,
    RegionsFindOneItemApiDto
> {
    private readonly statusMapper = inject(StatusMapper);
    private readonly entityCache = new Map<string, RegionsFindOneEntity>();

    protected override mapItemFromDto(
        dto: RegionsFindOneItemApiDto
    ): RegionsFindOneEntity {
        MapperUtils.validateDto(dto, {
            required: ['id'],
        });

        const props = {
            uniqId: dto.id,
            name: dto.name,
            code: dto.code,
            description: dto.description,
            populationSize: dto.population_size,
            infrastructureSize: dto.infrastructure_size,
            departmentsCount: dto.departments_count,
            municipalitiesCount: dto.municipalities_count,
            status: this.statusMapper.mapApiToStatus(dto.is_active),
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${props.uniqId}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new RegionsFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

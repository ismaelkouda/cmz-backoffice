import { inject, Injectable } from '@angular/core';
import { DepartmentsByRegionIdEntity } from '@pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';
import { DepartmentsByRegionIdItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/departments-by-region-id-response-api.dto';
import { StatusMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/departments/departments-status.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class DepartmentsByRegionIdMapper extends PaginatedMapper<
    DepartmentsByRegionIdEntity,
    DepartmentsByRegionIdItemApiDto
> {
    private readonly statusMapper = inject(StatusMapper);
    private readonly entityCache = new Map<
        string,
        DepartmentsByRegionIdEntity
    >();

    protected override mapItemFromDto(
        dto: DepartmentsByRegionIdItemApiDto
    ): DepartmentsByRegionIdEntity {
        MapperUtils.validateDto(dto, {
            required: ['id'],
        });

        const props = {
            uniqId: dto.id,
            name: dto.name,
            code: dto.code,
            description: dto.description,
            populationSize: dto.population_size,
            municipalitiesCount: dto.municipalities_count,
            status: this.statusMapper.mapApiToStatus(dto.is_active),
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${props.uniqId}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new DepartmentsByRegionIdEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

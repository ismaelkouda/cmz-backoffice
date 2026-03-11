import { Injectable } from '@angular/core';
import { DepartmentsByRegionIdEntity } from '@pages/administrative-boundary/domain/entities/regions/departments-by-region-id.entity';
import { DepartmentsByRegionIdItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/departments-by-region-id-response-api.dto';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class DepartmentsByRegionIdMapper extends PaginatedMapper<
    DepartmentsByRegionIdEntity,
    DepartmentsByRegionIdItemApiDto
> {
    private readonly utils = new MapperUtils();
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

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : DepartmentsByRegionIdEntity.fromDto(dto);
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

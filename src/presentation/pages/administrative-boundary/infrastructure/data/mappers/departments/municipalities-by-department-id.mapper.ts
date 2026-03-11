import { Injectable } from '@angular/core';
import { MunicipalitiesByDepartmentIdEntity } from '@pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';
import { MunicipalitiesByDepartmentIdItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/municipalities-by-department-id-response-api.dto';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesByDepartmentIdMapper extends PaginatedMapper<
    MunicipalitiesByDepartmentIdEntity,
    MunicipalitiesByDepartmentIdItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<
        string,
        MunicipalitiesByDepartmentIdEntity
    >();

    protected override mapItemFromDto(
        dto: MunicipalitiesByDepartmentIdItemApiDto
    ): MunicipalitiesByDepartmentIdEntity {
        MapperUtils.validateDto(dto, {
            required: ['id'],
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(dto)
            : MunicipalitiesByDepartmentIdEntity.fromDto(dto);
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

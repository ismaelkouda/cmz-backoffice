import { inject, Injectable } from '@angular/core';
import { MunicipalitiesByDepartmentIdEntity } from '@pages/administrative-boundary/domain/entities/departments/municipalities-by-department-id.entity';
import { MunicipalitiesByDepartmentIdItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/municipalities-by-department-id-response-api.dto';
import { StatusMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-status.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesByDepartmentIdMapper extends PaginatedMapper<
    MunicipalitiesByDepartmentIdEntity,
    MunicipalitiesByDepartmentIdItemApiDto
> {
    private readonly statusMapper = inject(StatusMapper);
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

        const props = {
            uniqId: dto.id,
            name: dto.name,
            code: dto.code,
            description: dto.description,
            region: dto.region.id,
            populationSize: dto.population_size,
            status: this.statusMapper.mapApiToStatus(dto.is_active),
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${props.uniqId}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new MunicipalitiesByDepartmentIdEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

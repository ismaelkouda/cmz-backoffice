import { inject, Injectable } from '@angular/core';
import { DepartmentsEntity } from '@pages/administrative-boundary/domain/entities/departments/departments.entity';
import { DepartmentsItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-response-api.dto';
import { StatusMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/departments/departments-status.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class DepartmentsMapper extends PaginatedMapper<
    DepartmentsEntity,
    DepartmentsItemApiDto
> {
    private readonly statusMapper = inject(StatusMapper);
    private readonly entityCache = new Map<string, DepartmentsEntity>();

    protected override mapItemFromDto(
        dto: DepartmentsItemApiDto
    ): DepartmentsEntity {
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
            municipalitiesCount: dto.municipalities_count,
            infrastructureCount: dto.infrastructure_size,
            status: this.statusMapper.mapApiToStatus(dto.is_active),
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${props.uniqId}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new DepartmentsEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

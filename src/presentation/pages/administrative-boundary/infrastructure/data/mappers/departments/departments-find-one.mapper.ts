import { inject, Injectable } from '@angular/core';
import { DepartmentsFindOneEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-find-one.entity';
import { DepartmentsFindOneItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-find-one-response-api.dto';
import { StatusMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/departments/departments-status.mapper';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class DepartmentsFindOneMapper extends SimpleResponseMapper<
    DepartmentsFindOneEntity,
    DepartmentsFindOneItemApiDto
> {
    private readonly statusMapper = inject(StatusMapper);
    private readonly entityCache = new Map<string, DepartmentsFindOneEntity>();

    protected mapItemFromDto(
        dto: DepartmentsFindOneItemApiDto
    ): DepartmentsFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const props = {
            uniqId: dto.id,
            name: dto.name,
            code: dto.code,
            description: dto.description,
            region: dto.region_code,
            populationSize: dto.population_size,
            municipalitiesCount: dto.municipalities_count,
            status: this.statusMapper.mapApiToStatus(dto.is_active),
            createdBy: dto.created_by,
            updatedBy: dto.updated_by,
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${props.uniqId}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new DepartmentsFindOneEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

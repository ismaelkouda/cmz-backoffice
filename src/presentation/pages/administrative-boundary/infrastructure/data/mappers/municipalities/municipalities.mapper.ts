import { inject, Injectable } from '@angular/core';
import { MunicipalitiesEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';
import { MunicipalitiesItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-response-api.dto';
import { StatusMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/municipalities/municipalities-status.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesMapper extends PaginatedMapper<
    MunicipalitiesEntity,
    MunicipalitiesItemApiDto
> {
    private readonly statusMapper = inject(StatusMapper);
    private readonly entityCache = new Map<string, MunicipalitiesEntity>();

    protected override mapItemFromDto(
        dto: MunicipalitiesItemApiDto
    ): MunicipalitiesEntity {
        MapperUtils.validateDto(dto, {
            required: ['id'],
        });

        const props = {
            uniqId: dto.id,
            name: dto.name,
            code: dto.code,
            description: dto.description,
            department: dto.department.id,
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
            : new MunicipalitiesEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

import { inject, Injectable } from '@angular/core';
import { RegionsEntity } from '@pages/administrative-boundary/domain/entities/regions/regions.entity';
import { RegionsItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-response-api.dto';
import { StatusMapper } from '@pages/administrative-boundary/infrastructure/data/mappers/regions/regions-status.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class RegionsMapper extends PaginatedMapper<
    RegionsEntity,
    RegionsItemApiDto
> {
    private readonly statusMapper = inject(StatusMapper);
    private readonly entityCache = new Map<string, RegionsEntity>();

    protected override mapItemFromDto(dto: RegionsItemApiDto): RegionsEntity {
        MapperUtils.validateDto(dto, {
            required: ['id'],
        });

        const props = {
            uniqId: dto.id,
            name: dto.name,
            code: dto.code,
            description: dto.description,
            populationSize: dto.population_size,
            departmentsCount: dto.departments_count,
            municipalitiesCount: dto.municipalities_count,
            status: this.statusMapper.mapApiToStatus(dto.is_active),
            createdAt: dto.created_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${props.uniqId}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new RegionsEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

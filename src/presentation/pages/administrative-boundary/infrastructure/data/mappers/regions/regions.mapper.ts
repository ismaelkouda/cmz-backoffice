import { RegionsEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/regions.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';
import { RegionsItemApiDto } from '../../../api/dtos/regions/regions-response-api.dto';

export class RegionsMapper extends PaginatedMapper<
    RegionsEntity,
    RegionsItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, RegionsEntity>();

    protected override mapItemFromDto(dto: RegionsItemApiDto): RegionsEntity {
        console.log("entityCache.size", this.entityCache.size);
        if (this.entityCache.size > 5) {
            this.entityCache.clear();
        }
        MapperUtils.validateDto(dto, {
            required: ['id']
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);
        console.log("cached", cached);
        console.log("dto", dto);
        if (cached) return cached;

        const entity = new RegionsEntity(dto.id, dto.name, dto.code, dto.description, dto.population_size, dto.departments_count, dto.municipalities_count, dto.is_active, dto.created_by, dto.updated_by, dto.created_at, dto.updated_at);
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

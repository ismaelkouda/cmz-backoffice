import { DepartmentsByRegionIdEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/departments-by-region-id.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';
import { DepartmentsByRegionIdItemApiDto } from '../../../api/dtos/regions/departments-by-region-id-response-api.dto';

export class DepartmentsByRegionIdMapper extends PaginatedMapper<
    DepartmentsByRegionIdEntity,
    DepartmentsByRegionIdItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, DepartmentsByRegionIdEntity>();

    protected override mapItemFromDto(dto: DepartmentsByRegionIdItemApiDto): DepartmentsByRegionIdEntity {
        MapperUtils.validateDto(dto, {
            required: ['id']
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);
        if (cached) return cached;

        const entity = new DepartmentsByRegionIdEntity(dto.id, dto.name, dto.code, dto.description, dto.population_size, dto.municipalities_count, dto.is_active, dto.created_by, dto.updated_by, dto.created_at, dto.updated_at,);
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
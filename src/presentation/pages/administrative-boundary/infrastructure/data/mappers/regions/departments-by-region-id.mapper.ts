import { DepartmentsByRegionIdEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/departments-by-region-id.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';
import { DepartmentsByRegionIdItemApiDto } from '../../../api/dtos/regions/departments-by-region-id-response-api.dto';

export class DepartmentsByRegionIdMapper extends PaginatedMapper<
    DepartmentsByRegionIdEntity,
    DepartmentsByRegionIdItemApiDto
> {
    private readonly entityCache = new Map<string, DepartmentsByRegionIdEntity>();

    protected override mapItemFromDto(dto: DepartmentsByRegionIdItemApiDto): DepartmentsByRegionIdEntity {
        MapperUtils.validateDto(dto, {
            required: ['id']
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);
        const entity = cached ? cached.with(dto) : DepartmentsByRegionIdEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
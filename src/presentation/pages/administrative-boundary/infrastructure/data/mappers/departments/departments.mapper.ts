import { DepartmentsEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/departments/departments.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';
import { DepartmentsItemApiDto } from '../../../api/dtos/departments/departments-response-api.dto';

export class DepartmentsMapper extends PaginatedMapper<
    DepartmentsEntity,
    DepartmentsItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, DepartmentsEntity>();

    protected override mapItemFromDto(dto: DepartmentsItemApiDto): DepartmentsEntity {
        MapperUtils.validateDto(dto, {
            required: ['id']
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);
        if (cached) return cached;

        const entity = new DepartmentsEntity(dto.id, dto.name, dto.code, dto.description, dto.region.name, dto.population_size, dto.municipalities_count, dto.is_active, dto.created_by, dto.updated_by, dto.created_at, dto.updated_at);
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

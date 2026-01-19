import { DepartmentsFindoneEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/departments/departments-findone.entity';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';
import { DepartmentsFindoneItemApiDto } from '../../../api/dtos/departments/departments-findone-response-api.dto';

export class DepartmentsFindoneMapper extends SimpleResponseMapper<
    DepartmentsFindoneEntity,
    DepartmentsFindoneItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, DepartmentsFindoneEntity>();

    protected override mapItemFromDto(dto: DepartmentsFindoneItemApiDto): DepartmentsFindoneEntity {
        MapperUtils.validateDto(dto, {
            required: ['updated_at']
        });

        const cacheKey = `dto:${dto.updated_at}`;
        const cached = this.entityCache.get(cacheKey);
        if (cached) return cached;

        const entity = new DepartmentsFindoneEntity(dto.id, dto.name, dto.code, dto.description, dto.region.code, dto.population_size, dto.municipalities_count, dto.is_active, dto.created_by, dto.updated_by, dto.created_at, dto.updated_at);
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

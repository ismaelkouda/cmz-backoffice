import { MunicipalitiesByDepartmentIdEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/departments/municipalities-by-department-id.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';
import { MunicipalitiesByDepartmentIdItemApiDto } from '../../../api/dtos/departments/municipalities-by-department-id-response-api.dto';

export class MunicipalitiesByDepartmentIdMapper extends PaginatedMapper<
    MunicipalitiesByDepartmentIdEntity,
    MunicipalitiesByDepartmentIdItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, MunicipalitiesByDepartmentIdEntity>();

    protected override mapItemFromDto(dto: MunicipalitiesByDepartmentIdItemApiDto): MunicipalitiesByDepartmentIdEntity {
        MapperUtils.validateDto(dto, {
            required: ['id']
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(dto) : MunicipalitiesByDepartmentIdEntity.fromDto(dto);
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
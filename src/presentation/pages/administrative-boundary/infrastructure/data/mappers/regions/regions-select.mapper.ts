import { DepartmentsSelectEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/departments/departments-select.entity';
import { MunicipalitiesSelectEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/municipalities/municipalities-select.entity';
import { RegionsSelectEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/regions-select.entity';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';
import { RegionsSelectItemApiDto } from '../../../api/dtos/regions/regions-select-response-api.dto';

export class RegionsSelectMapper extends ArrayResponseMapper<
    RegionsSelectEntity,
    RegionsSelectItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, RegionsSelectEntity>();

    protected override mapItemFromDto(dto: RegionsSelectItemApiDto): RegionsSelectEntity {
        MapperUtils.validateDto(dto, {
            required: ['id']
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);
        if (cached) return cached;

        const entity = new RegionsSelectEntity(
            dto.name,
            dto.code,
            dto.departments.map((department) => new DepartmentsSelectEntity(
                department.name,
                department.code,
                department.municipalities.map((municipality) => new MunicipalitiesSelectEntity(
                    municipality.name,
                    municipality.code
                ))
            ))
        );
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

import { DepartmentsSelectEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/departments/departments-select.entity';
import { MunicipalitiesSelectEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/municipalities/municipalities-select.entity';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';
import { DepartmentsSelectItemApiDto } from '../../../api/dtos/departments/departments-select-response-api.dto';

export class DepartmentsSelectMapper extends ArrayResponseMapper<
    DepartmentsSelectEntity,
    DepartmentsSelectItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, DepartmentsSelectEntity>();

    protected override mapItemFromDto(dto: DepartmentsSelectItemApiDto): DepartmentsSelectEntity {
        MapperUtils.validateDto(dto, {
            required: ['id']
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);
        if (cached) return cached;

        const entity = new DepartmentsSelectEntity(dto.name, dto.code, dto.municipalities.map((municipality) => new MunicipalitiesSelectEntity(municipality.name, municipality.code)));
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

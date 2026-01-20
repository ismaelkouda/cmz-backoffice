import { DepartmentsFindoneEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/departments/departments-findone.entity';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';
import { DepartmentsFindoneItemApiDto } from '../../../api/dtos/departments/departments-findone-response-api.dto';

export class DepartmentsFindoneMapper extends SimpleResponseMapper<
    DepartmentsFindoneEntity,
    DepartmentsFindoneItemApiDto
> {
    private readonly entityCache = new Map<string, DepartmentsFindoneEntity>();

    protected override mapItemFromDto(dto: DepartmentsFindoneItemApiDto): DepartmentsFindoneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(dto) : DepartmentsFindoneEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

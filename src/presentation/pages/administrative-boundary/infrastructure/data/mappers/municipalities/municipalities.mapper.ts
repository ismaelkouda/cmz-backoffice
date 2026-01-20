import { MunicipalitiesEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/municipalities/municipalities.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';
import { MunicipalitiesItemApiDto } from '../../../api/dtos/municipalities/municipalities-response-api.dto';

export class MunicipalitiesMapper extends PaginatedMapper<
    MunicipalitiesEntity,
    MunicipalitiesItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, MunicipalitiesEntity>();

    protected override mapItemFromDto(dto: MunicipalitiesItemApiDto): MunicipalitiesEntity {
        MapperUtils.validateDto(dto, {
            required: ['id']
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(dto) : MunicipalitiesEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

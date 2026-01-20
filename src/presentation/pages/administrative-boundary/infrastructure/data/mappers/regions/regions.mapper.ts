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
        MapperUtils.validateDto(dto, {
            required: ['id']
        });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(dto) : RegionsEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

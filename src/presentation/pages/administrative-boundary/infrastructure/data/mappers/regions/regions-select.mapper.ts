import { RegionsSelectEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/regions-select.entity';
import { RegionsSelectItemApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/regions-select-response-api.dto';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

export class RegionsSelectMapper extends ArrayResponseMapper<
    RegionsSelectEntity,
    RegionsSelectItemApiDto
> {
    private readonly entityCache = new Map<string, RegionsSelectEntity>();

    protected override mapItemFromDto(dto: RegionsSelectItemApiDto): RegionsSelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(dto) : RegionsSelectEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }

}

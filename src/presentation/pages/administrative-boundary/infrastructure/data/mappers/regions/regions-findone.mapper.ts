import { RegionsFindoneEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/regions-findone.entity';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';
import { RegionsFindoneItemApiDto } from '../../../api/dtos/regions/regions-findone-response-api.dto';

export class RegionsFindoneMapper extends SimpleResponseMapper<
    RegionsFindoneEntity,
    RegionsFindoneItemApiDto
> {
    private readonly entityCache = new Map<string, RegionsFindoneEntity>();

    protected override mapItemFromDto(dto: RegionsFindoneItemApiDto): RegionsFindoneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(dto) : RegionsFindoneEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

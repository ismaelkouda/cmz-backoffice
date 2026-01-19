import { RegionsFindoneEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/regions-findone.entity';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';
import { RegionsFindoneItemApiDto } from '../../../api/dtos/regions/regions-findone-response-api.dto';

export class RegionsFindoneMapper extends SimpleResponseMapper<
    RegionsFindoneEntity,
    RegionsFindoneItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, RegionsFindoneEntity>();

    protected override mapItemFromDto(dto: RegionsFindoneItemApiDto): RegionsFindoneEntity {
        MapperUtils.validateDto(dto, {
            required: ['updated_at']
        });

        const cacheKey = `dto:${dto.updated_at}`;
        const cached = this.entityCache.get(cacheKey);
        if (cached) return cached;

        const entity = new RegionsFindoneEntity(dto.id, dto.name, dto.code, dto.description, dto.population_size, dto.departments_count, dto.municipalities_count, dto.is_active, dto.created_by, dto.updated_by, dto.created_at, dto.updated_at);
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

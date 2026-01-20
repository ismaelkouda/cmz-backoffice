import { MunicipalitiesSelectEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/municipalities/municipalities-select.entity';
import { ArrayResponseMapper } from '@shared/data/mappers/base/array-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';
import { MunicipalitiesSelectItemApiDto } from '../../../api/dtos/municipalities/municipalities-select-response-api.dto';

export class MunicipalitiesSelectMapper extends ArrayResponseMapper<
    MunicipalitiesSelectEntity,
    MunicipalitiesSelectItemApiDto
> {
    private readonly entityCache = new Map<string, MunicipalitiesSelectEntity>();

    protected override mapItemFromDto(dto: MunicipalitiesSelectItemApiDto): MunicipalitiesSelectEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(dto) : MunicipalitiesSelectEntity.fromDto(dto)

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

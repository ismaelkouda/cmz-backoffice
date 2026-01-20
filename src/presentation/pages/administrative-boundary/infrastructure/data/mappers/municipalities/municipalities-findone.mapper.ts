import { MunicipalitiesFindoneEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/municipalities/municipalities-findone.entity';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';
import { MunicipalitiesFindoneItemApiDto } from '../../../api/dtos/municipalities/municipalities-findone-response-api.dto';

export class MunicipalitiesFindoneMapper extends SimpleResponseMapper<
    MunicipalitiesFindoneEntity,
    MunicipalitiesFindoneItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, MunicipalitiesFindoneEntity>();

    protected override mapItemFromDto(dto: MunicipalitiesFindoneItemApiDto): MunicipalitiesFindoneEntity {
        MapperUtils.validateDto(dto, { required: ['id'] });

        const cacheKey = `dto:${dto.id}`;
        let cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(dto) : MunicipalitiesFindoneEntity.fromDto(dto);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

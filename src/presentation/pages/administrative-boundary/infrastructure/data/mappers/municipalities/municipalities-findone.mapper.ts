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
        console.log('mapItemFromDto', dto);
        MapperUtils.validateDto(dto, {
            required: ['id']
        });

        const cacheKey = `dto:${dto.id}`;

        const cached = this.entityCache.get(cacheKey);

        if (cached) {
            console.log("dto", dto);
            console.log('cached', cached.updatedAt);
            console.log('dto', dto.updated_at);
            if (cached.updatedAt !== dto.updated_at) {
                console.log('Updating cached entity');
                console.log('cached', cached);
                cached.syncFromDto(dto);
            }
            return cached;
        }
        console.log('Creating new entity');
        console.log('Creating dto', dto);

        const entity = new MunicipalitiesFindoneEntity(dto.id, dto.name, dto.code, dto.description, dto.region.code, dto.department.code, dto.population_size, dto.is_active, dto.created_by, dto.updated_by, dto.created_at, dto.updated_at);
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

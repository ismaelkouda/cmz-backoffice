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

        if (cached) {
            console.log("dto", dto);
            console.log('cached', cached.updatedAt);
            console.log('dto', dto.updated_at);
            if (cached.updatedAt !== dto.updated_at) {
                console.log('Updating cached entity');
                cached.syncFromDto(dto);
            }
            return cached;
        }

        const entity = new MunicipalitiesEntity(dto.id, dto.name, dto.code, dto.description, dto.region.name, dto.department.name, dto.population_size, dto.is_active, dto.created_by, dto.updated_by, dto.created_at, dto.updated_at);
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}

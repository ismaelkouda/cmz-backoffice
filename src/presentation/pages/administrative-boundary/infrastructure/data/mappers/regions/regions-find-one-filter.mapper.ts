import { RegionsFindOneFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-find-one-filter.entity';
import { RegionsFindOneFilterApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/regions/regions-find-one-filter-api.dto';

export function regionsFindOneFilterMapper(
    entity: RegionsFindOneFilterEntity
): RegionsFindOneFilterApiDto {
    const params: RegionsFindOneFilterApiDto = {} as RegionsFindOneFilterApiDto;

    if (entity.uniqId) {
        params.code = entity.uniqId;
    }

    return params;
}

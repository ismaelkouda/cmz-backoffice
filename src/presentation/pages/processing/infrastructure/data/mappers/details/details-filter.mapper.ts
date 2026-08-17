import { DetailsFilterEntity } from '@pages/processing/domain/entities/details/details-filter.entity';
import { DetailsFilterApiDto } from '@pages/processing/infrastructure/api/dto/details/details-filter-api.dto';

export function detailsFilterMapper(
    entity: DetailsFilterEntity
): DetailsFilterApiDto {
    const params: DetailsFilterApiDto = {} as DetailsFilterApiDto;

    if (entity.uniqId) {
        params.uniq_id = entity.uniqId;
    }

    return params;
}

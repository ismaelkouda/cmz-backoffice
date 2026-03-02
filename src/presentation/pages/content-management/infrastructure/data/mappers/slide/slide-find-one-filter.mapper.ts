import { SlideFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-find-one-filter.entity';
import { SlideFindOneFilterApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/slide/slide-find-one-filter-api.dto';

export function slideFindOneFilterMapper(
    entity: SlideFindOneFilterEntity
): SlideFindOneFilterApiDto {
    const params: SlideFindOneFilterApiDto = {} as SlideFindOneFilterApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}

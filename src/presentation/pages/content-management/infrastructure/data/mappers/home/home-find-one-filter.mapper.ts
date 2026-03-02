import { HomeFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/home/home-find-one-filter.entity';
import { HomeFindOneFilterApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/home/home-find-one-filter-api.dto';

export function homeFindOneFilterMapper(
    entity: HomeFindOneFilterEntity
): HomeFindOneFilterApiDto {
    const params: HomeFindOneFilterApiDto = {} as HomeFindOneFilterApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}

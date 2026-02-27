import { NewsFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/news/news-find-one-filter.entity';
import { NewsFindOneFilterApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/news/news-find-one-filter-api.dto';

export function newsFindOneFilterMapper(
    entity: NewsFindOneFilterEntity
): NewsFindOneFilterApiDto {
    const params: NewsFindOneFilterApiDto = {} as NewsFindOneFilterApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}

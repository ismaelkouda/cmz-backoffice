import { NewsFilterEntity } from '@pages/content-management/domain/entities/news/news-filter.entity';
import { NewsFilterApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-filter-api.dto';

export function newsFilterMapper(entity: NewsFilterEntity): NewsFilterApiDto {
    const params: NewsFilterApiDto = {} as NewsFilterApiDto;

    if (entity.search) {
        params.search = entity.search;
    }
    if (entity.status) {
        params.status = entity.status;
    }
    if (entity.startDate) {
        params.start_date = entity.startDate;
    }
    if (entity.endDate) {
        params.end_date = entity.endDate;
    }

    return params;
}

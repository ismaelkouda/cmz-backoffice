import { Status } from '@pages/content-management/domain/enums/news/news-status.enum';
import { NewsFilterVo } from '@pages/content-management/domain/value-objects/news/news-filter.vo';
import { NewsFilterApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-filter-api.dto';

export function newsFilterMapper(vo: NewsFilterVo): NewsFilterApiDto {
    const params: NewsFilterApiDto = {} as NewsFilterApiDto;

    if (vo.search) {
        params.search = vo.search;
    }
    if (vo.status) {
        params.is_published = vo.status === Status.PUBLISH;
    }
    if (vo.startDate) {
        params.start_date = vo.startDate;
    }
    if (vo.endDate) {
        params.end_date = vo.endDate;
    }

    return params;
}

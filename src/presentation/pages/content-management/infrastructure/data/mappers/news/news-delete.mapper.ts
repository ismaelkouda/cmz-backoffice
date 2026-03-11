import { NewsDeleteEntity } from '@pages/content-management/domain/entities/news/news-delete.entity';
import { NewsDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-delete-api.dto';

export function newsDeleteMapper(vo: NewsDeleteEntity): NewsDeleteApiDto {
    const prams = {} as NewsDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

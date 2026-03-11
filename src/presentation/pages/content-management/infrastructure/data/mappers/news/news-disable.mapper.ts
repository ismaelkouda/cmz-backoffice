import { NewsDisableEntity } from '@pages/content-management/domain/entities/news/news-disable.entity';
import { NewsDisableApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-disable-api.dto';

export function newsDisableMapper(vo: NewsDisableEntity): NewsDisableApiDto {
    const prams = {} as NewsDisableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

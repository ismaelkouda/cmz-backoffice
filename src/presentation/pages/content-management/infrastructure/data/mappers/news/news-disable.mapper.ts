import { NewsDisableEntity } from '@presentation/pages/content-management/domain/entities/news/news-disable.entity';
import { NewsDisableApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/news/news-disable-api.dto';

export function newsDisableMapper(vo: NewsDisableEntity): NewsDisableApiDto {
    const prams = {} as NewsDisableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

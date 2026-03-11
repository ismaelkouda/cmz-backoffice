import { NewsEnableEntity } from '@pages/content-management/domain/entities/news/news-enable.entity';
import { NewsEnableApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-enable-api.dto';

export function newsEnableMapper(vo: NewsEnableEntity): NewsEnableApiDto {
    const prams = {} as NewsEnableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

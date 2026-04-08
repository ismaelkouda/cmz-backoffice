import { NewsPublishEntity } from '@pages/content-management/domain/entities/news/news-publish.entity';
import { NewsPublishApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-enable-api.dto';

export function newsPublishMapper(vo: NewsPublishEntity): NewsPublishApiDto {
    const prams = {} as NewsPublishApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

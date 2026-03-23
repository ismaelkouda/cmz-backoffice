import { NewsPublishApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-enable-api.dto';
import { NewsPublishEntity } from '@presentation/pages/content-management/domain/entities/news/news-publish.entity';

export function newsPublishMapper(vo: NewsPublishEntity): NewsPublishApiDto {
    const prams = {} as NewsPublishApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

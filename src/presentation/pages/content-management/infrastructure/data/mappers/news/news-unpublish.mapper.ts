import { NewsUnpublishApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-disable-api.dto';
import { NewsUnpublishEntity } from '@presentation/pages/content-management/domain/entities/news/news-unpublish.entity';

export function newsUnpublishMapper(
    vo: NewsUnpublishEntity
): NewsUnpublishApiDto {
    const prams = {} as NewsUnpublishApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

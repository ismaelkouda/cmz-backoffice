import { NewsUnpublishDto } from '@pages/content-management/application/dto/news/news-unpublish.dto';
import { NewsUnpublishApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-disable-api.dto';

export function newsUnpublishMapper(
    dto: NewsUnpublishDto
): NewsUnpublishApiDto {
    const prams = {} as NewsUnpublishApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}

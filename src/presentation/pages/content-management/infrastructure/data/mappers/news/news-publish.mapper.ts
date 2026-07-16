import { NewsPublishDto } from '@pages/content-management/application/dto/news/news-publish.dto';
import { NewsPublishApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-enable-api.dto';

export function newsPublishMapper(dto: NewsPublishDto): NewsPublishApiDto {
    const prams = {} as NewsPublishApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}

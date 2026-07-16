import { NewsDeleteDto } from '@pages/content-management/application/dto/news/news-delete.dto';
import { NewsDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-delete-api.dto';

export function newsDeleteMapper(dto: NewsDeleteDto): NewsDeleteApiDto {
    const prams = {} as NewsDeleteApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}

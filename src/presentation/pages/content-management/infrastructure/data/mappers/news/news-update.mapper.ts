import { NewsUpdateEntity } from '@pages/content-management/domain/entities/news/news-update.entity';
import { NewsUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-update-api.dto';

export function newsUpdateMapper(entity: NewsUpdateEntity): NewsUpdateApiDto {
    const params: NewsUpdateApiDto = {} as NewsUpdateApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }
    if (entity.type) {
        params.type = entity.type;
    }
    if (entity.image) {
        params.image_file = entity.image;
    }
    if (entity.video) {
        params.video_url = entity.video;
    }
    if (entity.category) {
        params.category = entity.category;
    }
    if (entity.subCategory) {
        params.sub_category = entity.subCategory;
    }
    if (entity.hashtags.length > 0) {
        params.hashtags = entity.hashtags;
    }
    if (entity.title) {
        params.title = entity.title;
    }
    if (entity.resume) {
        params.resume = entity.resume;
    }
    if (entity.content) {
        params.content = entity.content;
    }

    return params;
}

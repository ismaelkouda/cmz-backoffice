import { NewsCreateEntity } from '@pages/content-management/domain/entities/news/news-create.entity';
import { NewsCreateApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-create-api.dto';

export function newsCreateMapper(entity: NewsCreateEntity): NewsCreateApiDto {
    const params: NewsCreateApiDto = {} as NewsCreateApiDto;

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
        params.category_id = entity.category;
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

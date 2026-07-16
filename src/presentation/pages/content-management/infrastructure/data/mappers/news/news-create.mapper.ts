import { NewsCreateProps } from '@pages/content-management/domain/interfaces/news/news-create-props.interface';
import { NewsCreateApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-create-api.dto';

export function newsCreateMapper(props: NewsCreateProps): NewsCreateApiDto {
    const params: NewsCreateApiDto = {} as NewsCreateApiDto;

    if (props.type) {
        params.type = props.type;
    }
    if (props.image) {
        params.image_file = props.image;
    }
    if (props.video) {
        params.video_url = props.video;
    }
    if (props.category) {
        params.category_id = props.category;
    }
    if (props.subCategory) {
        params.sub_category_id = props.subCategory;
    }
    if (props.hashtags.length > 0) {
        params.hashtags = props.hashtags;
    }
    if (props.title) {
        params.title = props.title;
    }
    if (props.resume) {
        params.resume = props.resume;
    }
    if (props.content) {
        params.content = props.content;
    }

    return params;
}

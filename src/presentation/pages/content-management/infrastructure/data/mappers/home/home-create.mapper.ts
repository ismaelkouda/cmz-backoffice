import { HomeCreateEntity } from '@presentation/pages/content-management/domain/entities/home/home-create.entity';
import { HomeCreateApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/home/home-create-api.dto';

export function homeCreateMapper(entity: HomeCreateEntity): HomeCreateApiDto {
    const params: HomeCreateApiDto = {} as HomeCreateApiDto;

    if (entity.image) {
        params.image = entity.image;
    }
    if (entity.platforms) {
        params.platforms = entity.platforms;
    }
    if (entity.startDate) {
        params.start_date = entity.startDate;
    }
    if (entity.endDate) {
        params.end_date = entity.endDate;
    }
    if (entity.title) {
        params.title = entity.title;
    }
    if (entity.platforms) {
        params.platforms = entity.platforms;
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
    if (entity.buttonLabel) {
        params.button_label = entity.buttonLabel;
    }
    if (entity.buttonUrl) {
        params.button_url = entity.buttonUrl;
    }

    return params;
}

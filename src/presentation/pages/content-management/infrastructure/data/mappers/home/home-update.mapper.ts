import { HomeUpdateEntity } from '@presentation/pages/content-management/domain/entities/home/home-update.entity';
import { HomeUpdateApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/home/home-update-api.dto';

export function homeUpdateMapper(entity: HomeUpdateEntity): HomeUpdateApiDto {
    const params: HomeUpdateApiDto = {} as HomeUpdateApiDto;

    if (entity.uniqId) {
        params.uniq_id = entity.uniqId;
    }
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

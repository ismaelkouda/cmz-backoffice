import { SlideCreateEntity } from '@pages/content-management/domain/entities/slide/slide-create.entity';
import { SlideCreateApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-create-api.dto';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';
import { PlatformMapper } from '@shared/data/mappers/platform.mapper';

export function slideCreateMapper(
    entity: SlideCreateEntity,
    platformMapper: PlatformMapper,
    apiDateMapper: ApiDateMapper
): SlideCreateApiDto {
    const params: SlideCreateApiDto = {} as SlideCreateApiDto;

    if (entity.timeDuration) {
        params.time_duration_in_seconds = entity.timeDuration;
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
    if (entity.platforms.length > 0) {
        params.platforms = entity.platforms.map((p) =>
            platformMapper.mapStringToDto(p)
        );
    }
    if (entity.startDate) {
        params.start_date = apiDateMapper.toDateApi(entity.startDate);
    }
    if (entity.endDate) {
        params.end_date = apiDateMapper.toDateApi(entity.endDate);
    }
    if (entity.title) {
        params.title = entity.title;
    }
    if (entity.subtitle) {
        params.subtitle = entity.subtitle;
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

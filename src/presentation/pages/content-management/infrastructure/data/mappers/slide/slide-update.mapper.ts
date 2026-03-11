import { inject } from '@angular/core';
import { SlideUpdateEntity } from '@pages/content-management/domain/entities/slide/slide-update.entity';
import { SlideUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-update-api.dto';
import { PlatformMapper } from '@shared/data/mappers/platform.mapper';

export function slideUpdateMapper(
    entity: SlideUpdateEntity
): SlideUpdateApiDto {
    const platformMapper = inject(PlatformMapper);
    const params: SlideUpdateApiDto = {} as SlideUpdateApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }
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
            platformMapper.mapToDto(p)
        );
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

import { inject } from '@angular/core';
import { HomeCreateEntity } from '@pages/content-management/domain/entities/home/home-create.entity';
import { HomeCreateApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-create-api.dto';
import { PlatformMapper } from '@shared/data/mappers/platform.mapper';

export function homeCreateMapper(entity: HomeCreateEntity): HomeCreateApiDto {
    const platformMapper = inject(PlatformMapper);
    const params: HomeCreateApiDto = {} as HomeCreateApiDto;

    if (entity.image) {
        params.image_file = entity.image;
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
    if (entity.platforms.length > 0) {
        params.platforms = entity.platforms.map((p) =>
            platformMapper.mapToDto(p)
        );
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

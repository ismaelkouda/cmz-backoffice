import { inject, Injectable } from '@angular/core';
import { SlideUpdateEntity } from '@pages/content-management/domain/entities/slide/slide-update.entity';
import { SlideUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-update-api.dto';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';
import { PlatformMapper } from '@shared/data/mappers/platform.mapper';

@Injectable({ providedIn: 'root' })
export class SlideUpdateMapper {
    private readonly platformMapper = inject(PlatformMapper);
    private readonly apiDateMapper = inject(ApiDateMapper);

    mapEntityToApi(entity: SlideUpdateEntity): SlideUpdateApiDto {
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
                this.platformMapper.mapStringToDto(p)
            );
        }
        if (entity.period.start) {
            params.start_date = this.apiDateMapper.toDateApi(
                entity.period.start
            );
        }
        if (entity.period.end) {
            params.end_date = this.apiDateMapper.toDateApi(entity.period.end);
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

        return params;
    }
}

import { inject, Injectable } from '@angular/core';
import { SlideUpdateProps } from '@pages/content-management/domain/interfaces/slide/slide-update-props.interface';
import { SlideUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-update-api.dto';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';
import { PlatformMapper } from '@shared/data/mappers/platform.mapper';

@Injectable({ providedIn: 'root' })
export class SlideUpdateMapper {
    private readonly platformMapper = inject(PlatformMapper);
    private readonly apiDateMapper = inject(ApiDateMapper);

    mapEntityToApi(props: SlideUpdateProps): SlideUpdateApiDto {
        const params: SlideUpdateApiDto = {} as SlideUpdateApiDto;

        if (props.uniqId) {
            params.id = props.uniqId;
        }

        if (props.timeDuration) {
            params.time_duration_in_seconds = props.timeDuration;
        }
        if (props.type) {
            params.type = props.type;
        }
        if (props.image) {
            params.image_file = props.image;
        }
        if (props.video) {
            params.video_url = props.video;
        }
        if (props.platforms.length > 0) {
            params.platforms = props.platforms.map((p) =>
                this.platformMapper.mapStringToDto(p)
            );
        }
        if (props.period.start) {
            params.start_date = this.apiDateMapper.toDateApi(
                props.period.start
            );
        }
        if (props.period.end) {
            params.end_date = this.apiDateMapper.toDateApi(props.period.end);
        }
        if (props.title) {
            params.title = props.title;
        }
        if (props.subtitle) {
            params.subtitle = props.subtitle;
        }
        if (props.content) {
            params.content = props.content;
        }
        if (props.buttonLabel) {
            params.button_label = props.buttonLabel;
        }

        return params;
    }
}

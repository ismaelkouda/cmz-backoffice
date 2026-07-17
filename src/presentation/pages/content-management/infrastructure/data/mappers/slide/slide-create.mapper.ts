import { inject, Injectable } from '@angular/core';
import { SlideCreateProps } from '@pages/content-management/domain/interfaces/slide/slide-create-props.interface';
import { SlideCreateApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-create-api.dto';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';
import { PlatformMapper } from '@shared/data/mappers/platform.mapper';

@Injectable({ providedIn: 'root' })
export class SlideCreateMapper {
    private readonly platformMapper = inject(PlatformMapper);
    private readonly apiDateMapper = inject(ApiDateMapper);

    mapEntityToApi(props: SlideCreateProps): SlideCreateApiDto {
        const params: SlideCreateApiDto = {} as SlideCreateApiDto;

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

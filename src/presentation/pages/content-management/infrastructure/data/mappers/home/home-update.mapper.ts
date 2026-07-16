import { inject, Injectable } from '@angular/core';
import { HomeUpdateProps } from '@pages/content-management/domain/interfaces/home/home-update-props.interface';
import { HomeUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-update-api.dto';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';
import { PlatformMapper } from '@shared/data/mappers/platform.mapper';

@Injectable({ providedIn: 'root' })
export class HomeUpdateMapper {
    private readonly platformMapper = inject(PlatformMapper);
    private readonly apiDateMapper = inject(ApiDateMapper);

    mapEntityToApi(props: HomeUpdateProps): HomeUpdateApiDto {
        const params: HomeUpdateApiDto = {} as HomeUpdateApiDto;

        if (props.uniqId) {
            params.uniq_id = props.uniqId;
        }

        if (props.image) {
            params.image_file = props.image;
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
        if (props.platforms.length > 0) {
            params.platforms = props.platforms.map((p) =>
                this.platformMapper.mapStringToDto(p)
            );
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
        if (props.buttonLabel) {
            params.button_label = props.buttonLabel;
        }
        if (props.buttonUrl) {
            params.button_url = props.buttonUrl;
        }

        return params;
    }
}

import { inject, Injectable } from '@angular/core';
import { HomeUpdateEntity } from '@pages/content-management/domain/entities/home/home-update.entity';
import { HomeUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-update-api.dto';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';
import { PlatformMapper } from '@shared/data/mappers/platform.mapper';

@Injectable({ providedIn: 'root' })
export class HomeUpdateMapper {
    private readonly platformMapper = inject(PlatformMapper);
    private readonly apiDateMapper = inject(ApiDateMapper);

    mapEntityToApi(entity: HomeUpdateEntity): HomeUpdateApiDto {
        const params: HomeUpdateApiDto = {} as HomeUpdateApiDto;

        if (entity.uniqId) {
            params.uniq_id = entity.uniqId;
        }

        if (entity.image) {
            params.image_file = entity.image;
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
        if (entity.platforms.length > 0) {
            params.platforms = entity.platforms.map((p) =>
                this.platformMapper.mapStringToDto(p)
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
}

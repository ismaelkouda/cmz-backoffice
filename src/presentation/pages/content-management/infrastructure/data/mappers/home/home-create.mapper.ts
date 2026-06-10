import { inject, Injectable } from '@angular/core';
import { HomeCreateEntity } from '@pages/content-management/domain/entities/home/home-create.entity';
import { HomeCreateApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-create-api.dto';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';
import { PlatformMapper } from '@shared/data/mappers/platform.mapper';

@Injectable({ providedIn: 'root' })
export class HomeCreateMapper {
    private readonly platformMapper = inject(PlatformMapper);
    private readonly apiDateMapper = inject(ApiDateMapper);

    mapEntityToApi(entity: HomeCreateEntity): HomeCreateApiDto {
        const params: HomeCreateApiDto = {} as HomeCreateApiDto;

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

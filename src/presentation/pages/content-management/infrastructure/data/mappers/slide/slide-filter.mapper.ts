import { SlideFilterEntity } from '@pages/content-management/domain/entities/slide/slide-filter.entity';
import { SlideFilterApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-filter-api.dto';

export function slideFilterMapper(
    entity: SlideFilterEntity
): SlideFilterApiDto {
    const params: SlideFilterApiDto = {} as SlideFilterApiDto;

    if (entity.search) {
        params.search = entity.search;
    }
    if (entity.platforms) {
        params.platforms = entity.platforms;
    }
    if (entity.status) {
        params.status = entity.status;
    }
    if (entity.startDate) {
        params.start_date = entity.startDate;
    }
    if (entity.endDate) {
        params.end_date = entity.endDate;
    }

    return params;
}

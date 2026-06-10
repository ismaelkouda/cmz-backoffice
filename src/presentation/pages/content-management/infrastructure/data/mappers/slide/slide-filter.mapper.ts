import { SlideFilterEntity } from '@pages/content-management/domain/entities/slide/slide-filter.entity';
import { Status } from '@pages/content-management/domain/enums/slide/slide-status.enum';
import { SlideFilterApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-filter-api.dto';

export function slideFilterMapper(
    entity: SlideFilterEntity
): SlideFilterApiDto {
    const params: SlideFilterApiDto = {};

    if (entity.search) {
        params.search = entity.search;
    }
    if (entity.platforms) {
        params.platforms = entity.platforms;
    }
    if (entity.status) {
        params.is_active = entity.status === Status.ACTIVE;
    }
    if (entity.startDate) {
        params.start_date = entity.startDate;
    }
    if (entity.endDate) {
        params.end_date = entity.endDate;
    }

    return params;
}

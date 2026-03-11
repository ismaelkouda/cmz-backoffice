import { HomeFilterEntity } from '@pages/content-management/domain/entities/home/home-filter.entity';
import { HomeFilterApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-filter-api.dto';

export function homeFilterMapper(entity: HomeFilterEntity): HomeFilterApiDto {
    const params: HomeFilterApiDto = {} as HomeFilterApiDto;

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

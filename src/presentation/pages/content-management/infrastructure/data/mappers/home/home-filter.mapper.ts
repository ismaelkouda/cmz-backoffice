import { Status } from '@pages/content-management/domain/enums/home/home-status.enum';
import { HomeFilterVo } from '@pages/content-management/domain/value-objects/home/home-filter.vo';
import { HomeFilterApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-filter-api.dto';

export function homeFilterMapper(vo: HomeFilterVo): HomeFilterApiDto {
    const params: HomeFilterApiDto = {} as HomeFilterApiDto;

    if (vo.search) {
        params.search = vo.search;
    }
    if (vo.platforms) {
        params.platforms = vo.platforms;
    }
    if (vo.status) {
        params.is_active = vo.status === Status.ACTIVE;
    }
    if (vo.startDate) {
        params.start_date = vo.startDate;
    }
    if (vo.endDate) {
        params.end_date = vo.endDate;
    }

    return params;
}

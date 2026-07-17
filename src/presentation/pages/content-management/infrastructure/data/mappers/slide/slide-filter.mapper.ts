import { Status } from '@pages/content-management/domain/enums/slide/slide-status.enum';
import { SlideFilterVo } from '@pages/content-management/domain/value-objects/slide/slide-filter.vo';
import { SlideFilterApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-filter-api.dto';

export function slideFilterMapper(vo: SlideFilterVo): SlideFilterApiDto {
    const params: SlideFilterApiDto = {};

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

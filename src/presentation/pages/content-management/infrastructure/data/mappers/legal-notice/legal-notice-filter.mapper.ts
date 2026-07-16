import { Status } from '@pages/content-management/domain/enums/legal-notice/legal-notice-status.enum';
import { LegalNoticeFilterVo } from '@pages/content-management/domain/value-objects/legal-notice/legal-notice-filter.vo';
import { LegalNoticeFilterApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-filter-api.dto';

export function legalNoticeFilterMapper(
    filter: LegalNoticeFilterVo
): LegalNoticeFilterApiDto {
    const params: LegalNoticeFilterApiDto = {} as LegalNoticeFilterApiDto;

    if (filter.search) {
        params.search = filter.search;
    }
    if (filter.version) {
        params.version = filter.version;
    }
    if (filter.status) {
        params.is_published = filter.status === Status.PUBLISH;
    }
    if (filter.startDate) {
        params.start_date = filter.startDate;
    }
    if (filter.endDate) {
        params.end_date = filter.endDate;
    }

    return params;
}

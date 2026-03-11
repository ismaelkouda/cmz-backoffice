import { LegalNoticeFilterEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-filter.entity';
import { LegalNoticeFilterApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-filter-api.dto';

export function legalNoticeFilterMapper(
    entity: LegalNoticeFilterEntity
): LegalNoticeFilterApiDto {
    const params: LegalNoticeFilterApiDto = {} as LegalNoticeFilterApiDto;

    if (entity.search) {
        params.search = entity.search;
    }
    if (entity.version) {
        params.version = entity.version;
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

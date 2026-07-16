import { Status } from '@pages/content-management/domain/enums/terms-use/terms-use-status.enum';
import { TermsUseFilterVo } from '@pages/content-management/domain/value-objects/terms-use/terms-use-filter.vo';
import { TermsUseFilterApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-filter-api.dto';

export function termsUseFilterMapper(
    filter: TermsUseFilterVo
): TermsUseFilterApiDto {
    const params: TermsUseFilterApiDto = {} as TermsUseFilterApiDto;

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

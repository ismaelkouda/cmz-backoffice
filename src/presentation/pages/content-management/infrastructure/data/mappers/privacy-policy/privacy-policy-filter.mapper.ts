import { Status } from '@pages/content-management/domain/enums/privacy-policy/privacy-policy-status.enum';
import { PrivacyPolicyFilterVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-filter.vo';
import { PrivacyPolicyFilterApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-filter-api.dto';

export function privacyPolicyFilterMapper(
    filter: PrivacyPolicyFilterVo
): PrivacyPolicyFilterApiDto {
    const params: PrivacyPolicyFilterApiDto = {} as PrivacyPolicyFilterApiDto;

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

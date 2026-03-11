import { PrivacyPolicyFilterEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-filter.entity';
import { PrivacyPolicyFilterApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-filter-api.dto';

export function privacyPolicyFilterMapper(
    entity: PrivacyPolicyFilterEntity
): PrivacyPolicyFilterApiDto {
    const params: PrivacyPolicyFilterApiDto = {} as PrivacyPolicyFilterApiDto;

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

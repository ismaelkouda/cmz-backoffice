import { PrivacyPolicyFilterEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-filter.entity';
import { Status } from '@pages/content-management/domain/enums/privacy-policy/privacy-policy-status.enum';
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
        params.is_published = entity.status === Status.PUBLISH;
    }
    if (entity.startDate) {
        params.start_date = entity.startDate;
    }
    if (entity.endDate) {
        params.end_date = entity.endDate;
    }

    return params;
}

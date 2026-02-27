import { PrivacyPolicyFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one-filter.entity';
import { PrivacyPolicyFindOneFilterApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-find-one-filter-api.dto';

export function privacyPolicyFindOneFilterMapper(
    entity: PrivacyPolicyFindOneFilterEntity
): PrivacyPolicyFindOneFilterApiDto {
    const params: PrivacyPolicyFindOneFilterApiDto =
        {} as PrivacyPolicyFindOneFilterApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }

    return params;
}

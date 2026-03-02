import { PrivacyPolicyPublishEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-publish.entity';
import { PrivacyPolicyPublishApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-publish-api.dto';

export function privacyPolicyPublishMapper(
    vo: PrivacyPolicyPublishEntity
): PrivacyPolicyPublishApiDto {
    const prams = {} as PrivacyPolicyPublishApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

import { PrivacyPolicyPublishDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-publish.dto';
import { PrivacyPolicyPublishApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-publish-api.dto';

export function privacyPolicyPublishMapper(
    dto: PrivacyPolicyPublishDto
): PrivacyPolicyPublishApiDto {
    const prams = {} as PrivacyPolicyPublishApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}

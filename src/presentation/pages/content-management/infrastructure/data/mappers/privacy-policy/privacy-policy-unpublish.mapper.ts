import { PrivacyPolicyUnpublishDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-unpublish.dto';
import { PrivacyPolicyUnpublishApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-unpublish-api.dto';

export function privacyPolicyUnpublishMapper(
    dto: PrivacyPolicyUnpublishDto
): PrivacyPolicyUnpublishApiDto {
    const prams = {} as PrivacyPolicyUnpublishApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}

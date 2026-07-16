import { PrivacyPolicyDeleteDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-delete.dto';
import { PrivacyPolicyDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-delete-api.dto';

export function privacyPolicyDeleteMapper(
    dto: PrivacyPolicyDeleteDto
): PrivacyPolicyDeleteApiDto {
    const prams = {} as PrivacyPolicyDeleteApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}

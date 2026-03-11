import { PrivacyPolicyUnpublishEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-unpublish.entity';
import { PrivacyPolicyUnpublishApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-unpublish-api.dto';

export function privacyPolicyUnpublishMapper(
    vo: PrivacyPolicyUnpublishEntity
): PrivacyPolicyUnpublishApiDto {
    const prams = {} as PrivacyPolicyUnpublishApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

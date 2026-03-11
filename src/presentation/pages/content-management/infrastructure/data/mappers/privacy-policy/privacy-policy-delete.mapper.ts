import { PrivacyPolicyDeleteEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-delete.entity';
import { PrivacyPolicyDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-delete-api.dto';

export function privacyPolicyDeleteMapper(
    vo: PrivacyPolicyDeleteEntity
): PrivacyPolicyDeleteApiDto {
    const prams = {} as PrivacyPolicyDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}

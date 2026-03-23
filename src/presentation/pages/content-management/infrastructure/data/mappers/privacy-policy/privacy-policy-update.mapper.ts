import { PrivacyPolicyUpdateEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-update.entity';
import { PrivacyPolicyUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-update-api.dto';

export function privacyPolicyUpdateMapper(
    entity: PrivacyPolicyUpdateEntity
): PrivacyPolicyUpdateApiDto {
    const params: PrivacyPolicyUpdateApiDto = {} as PrivacyPolicyUpdateApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }
    if (entity.version) {
        params.version = entity.version;
    }
    if (entity.content) {
        params.content = entity.content;
    }

    return params;
}

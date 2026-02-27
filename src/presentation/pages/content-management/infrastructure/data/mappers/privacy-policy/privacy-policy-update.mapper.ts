import { PrivacyPolicyUpdateEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-update.entity';
import { PrivacyPolicyUpdateApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-update-api.dto';

export function privacyPolicyUpdateMapper(
    entity: PrivacyPolicyUpdateEntity
): PrivacyPolicyUpdateApiDto {
    const params: PrivacyPolicyUpdateApiDto = {} as PrivacyPolicyUpdateApiDto;

    if (entity.uniqId) {
        params.id = entity.uniqId;
    }
    if (entity.version) {
        params.first_name = entity.version;
    }
    if (entity.content) {
        params.last_name = entity.content;
    }

    return params;
}

import { PrivacyPolicyCreateEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-create.entity';
import { PrivacyPolicyCreateApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-create-api.dto';

export function privacyPolicyCreateMapper(
    entity: PrivacyPolicyCreateEntity
): PrivacyPolicyCreateApiDto {
    const params: PrivacyPolicyCreateApiDto = {} as PrivacyPolicyCreateApiDto;

    if (entity.version) {
        params.version = entity.version;
    }
    if (entity.content) {
        params.content = entity.content;
    }

    return params;
}

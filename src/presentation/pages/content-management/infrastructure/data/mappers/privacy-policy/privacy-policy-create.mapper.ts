import { PrivacyPolicyCreateEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-create.entity';
import { PrivacyPolicyCreateApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-create-api.dto';

export function privacyPolicyCreateMapper(
    entity: PrivacyPolicyCreateEntity
): PrivacyPolicyCreateApiDto {
    const params: PrivacyPolicyCreateApiDto = {} as PrivacyPolicyCreateApiDto;

    if (entity.version) {
        params.first_name = entity.version;
    }
    if (entity.content) {
        params.last_name = entity.content;
    }

    return params;
}

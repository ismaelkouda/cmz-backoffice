import { PrivacyPolicyCreateValidateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-create.validate-contract';
import { PrivacyPolicyCreateApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-create-api.dto';

export function privacyPolicyCreateMapper(
    contract: PrivacyPolicyCreateValidateContract
): PrivacyPolicyCreateApiDto {
    const params: PrivacyPolicyCreateApiDto = {} as PrivacyPolicyCreateApiDto;

    if (contract.version) {
        params.version = contract.version;
    }
    if (contract.content) {
        params.content = contract.content;
    }

    return params;
}

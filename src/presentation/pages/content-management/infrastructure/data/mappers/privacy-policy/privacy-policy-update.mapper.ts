import { PrivacyPolicyUpdateValidateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-update.validate-contract';
import { PrivacyPolicyUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-update-api.dto';

export function privacyPolicyUpdateMapper(
    contract: PrivacyPolicyUpdateValidateContract
): PrivacyPolicyUpdateApiDto {
    const params: PrivacyPolicyUpdateApiDto = {} as PrivacyPolicyUpdateApiDto;

    if (contract.uniqId) {
        params.id = contract.uniqId;
    }
    if (contract.version) {
        params.version = contract.version;
    }
    if (contract.content) {
        params.content = contract.content;
    }

    return params;
}

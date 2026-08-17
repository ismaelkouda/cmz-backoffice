import { PrivacyPolicyUpdateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-update.contract';
import { PrivacyPolicyUpdateValidateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-update.validate-contract';
import { validatePrivacyPolicyUpdate } from '@pages/content-management/domain/validators/privacy-policy/privacy-policy-update.validator';

export function privacyPolicyUpdateVo(
    contract: PrivacyPolicyUpdateContract
): PrivacyPolicyUpdateValidateContract {
    validatePrivacyPolicyUpdate(contract);
    return {
        uniqId: contract.uniqId,
        version: contract.version,
        content: contract.content,
    };
}

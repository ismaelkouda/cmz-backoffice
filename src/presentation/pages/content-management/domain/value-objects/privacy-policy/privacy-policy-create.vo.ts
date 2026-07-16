import { PrivacyPolicyCreateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-create.contract';
import { PrivacyPolicyCreateValidateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-create.validate-contract';
import { validatePrivacyPolicyCreate } from '@pages/content-management/domain/validators/privacy-policy/privacy-policy-create.validator';

export function privacyPolicyCreateVo(
    contract: PrivacyPolicyCreateContract
): PrivacyPolicyCreateValidateContract {
    validatePrivacyPolicyCreate(contract);
    return {
        version: contract.version,
        content: contract.content,
    };
}

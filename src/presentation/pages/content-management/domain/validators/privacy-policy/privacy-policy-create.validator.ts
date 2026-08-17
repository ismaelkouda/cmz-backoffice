import { PrivacyPolicyCreateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-create.contract';
import { PrivacyPolicyCreateValidateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validatePrivacyPolicyCreate(
    contract: PrivacyPolicyCreateContract
): asserts contract is PrivacyPolicyCreateValidateContract {
    if (!contract.version) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.PRIVACY_POLICY.FORM.ERROR.CREATE.VERSION_REQUIRE'
        );
    }
    if (!contract.content) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.PRIVACY_POLICY.FORM.ERROR.CREATE.CONTENT_REQUIRE'
        );
    }
}

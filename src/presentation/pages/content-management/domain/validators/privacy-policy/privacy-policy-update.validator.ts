import { PrivacyPolicyUpdateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-update.contract';
import { PrivacyPolicyUpdateValidateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validatePrivacyPolicyUpdate(
    contract: PrivacyPolicyUpdateContract
): asserts contract is PrivacyPolicyUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.PRIVACY_POLICY.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.version) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.PRIVACY_POLICY.FORM.ERROR.UPDATE.VERSION_REQUIRE'
        );
    }
    if (!contract.content) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.PRIVACY_POLICY.FORM.ERROR.UPDATE.CONTENT_REQUIRE'
        );
    }
}

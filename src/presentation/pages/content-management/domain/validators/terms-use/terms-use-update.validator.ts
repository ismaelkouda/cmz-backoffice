import { TermsUseUpdateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-update.contract';
import { TermsUseUpdateValidateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateTermsUseUpdate(
    contract: TermsUseUpdateContract
): asserts contract is TermsUseUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.TERMS_USE.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.version) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.TERMS_USE.FORM.ERROR.UPDATE.VERSION_REQUIRE'
        );
    }
    if (!contract.content) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.TERMS_USE.FORM.ERROR.UPDATE.CONTENT_REQUIRE'
        );
    }
}

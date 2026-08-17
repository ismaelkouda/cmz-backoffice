import { TermsUseCreateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-create.contract';
import { TermsUseCreateValidateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateTermsUseCreate(
    contract: TermsUseCreateContract
): asserts contract is TermsUseCreateValidateContract {
    if (!contract.version) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.TERMS_USE.FORM.ERROR.CREATE.VERSION_REQUIRE'
        );
    }
    if (!contract.content) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.TERMS_USE.FORM.ERROR.CREATE.CONTENT_REQUIRE'
        );
    }
}

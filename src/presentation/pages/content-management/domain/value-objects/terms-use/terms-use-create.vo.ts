import { TermsUseCreateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-create.contract';
import { TermsUseCreateValidateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-create.validate-contract';
import { validateTermsUseCreate } from '@pages/content-management/domain/validators/terms-use/terms-use-create.validator';

export function termsUseCreateVo(
    contract: TermsUseCreateContract
): TermsUseCreateValidateContract {
    validateTermsUseCreate(contract);
    return {
        version: contract.version,
        content: contract.content,
    };
}

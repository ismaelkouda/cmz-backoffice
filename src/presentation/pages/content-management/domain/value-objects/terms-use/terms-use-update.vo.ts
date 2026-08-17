import { TermsUseUpdateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-update.contract';
import { TermsUseUpdateValidateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-update.validate-contract';
import { validateTermsUseUpdate } from '@pages/content-management/domain/validators/terms-use/terms-use-update.validator';

export function termsUseUpdateVo(
    contract: TermsUseUpdateContract
): TermsUseUpdateValidateContract {
    validateTermsUseUpdate(contract);
    return {
        uniqId: contract.uniqId,
        version: contract.version,
        content: contract.content,
    };
}

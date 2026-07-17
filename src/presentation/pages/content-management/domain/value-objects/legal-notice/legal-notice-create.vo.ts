import { LegalNoticeCreateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-create.contract';
import { LegalNoticeCreateValidateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-create.validate-contract';
import { validateLegalNoticeCreate } from '@pages/content-management/domain/validators/legal-notice/legal-notice-create.validator';

export function legalNoticeCreateVo(
    contract: LegalNoticeCreateContract
): LegalNoticeCreateValidateContract {
    validateLegalNoticeCreate(contract);
    return {
        version: contract.version,
        content: contract.content,
    };
}

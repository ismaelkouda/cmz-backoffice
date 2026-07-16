import { LegalNoticeUpdateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-update.contract';
import { LegalNoticeUpdateValidateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-update.validate-contract';
import { validateLegalNoticeUpdate } from '@pages/content-management/domain/validators/legal-notice/legal-notice-update.validator';

export function legalNoticeUpdateVo(
    contract: LegalNoticeUpdateContract
): LegalNoticeUpdateValidateContract {
    validateLegalNoticeUpdate(contract);
    return {
        uniqId: contract.uniqId,
        version: contract.version,
        content: contract.content,
    };
}

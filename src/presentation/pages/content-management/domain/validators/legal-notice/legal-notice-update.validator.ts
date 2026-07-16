import { LegalNoticeUpdateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-update.contract';
import { LegalNoticeUpdateValidateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateLegalNoticeUpdate(
    contract: LegalNoticeUpdateContract
): asserts contract is LegalNoticeUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.LEGAL_NOTICE.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.version) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.LEGAL_NOTICE.FORM.ERROR.UPDATE.VERSION_REQUIRE'
        );
    }
    if (!contract.content) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.LEGAL_NOTICE.FORM.ERROR.UPDATE.CONTENT_REQUIRE'
        );
    }
}

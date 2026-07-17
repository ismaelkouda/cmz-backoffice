import { LegalNoticeCreateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-create.contract';
import { LegalNoticeCreateValidateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateLegalNoticeCreate(
    contract: LegalNoticeCreateContract
): asserts contract is LegalNoticeCreateValidateContract {
    if (!contract.version) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.LEGAL_NOTICE.FORM.ERROR.CREATE.VERSION_REQUIRE'
        );
    }
    if (!contract.content) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.LEGAL_NOTICE.FORM.ERROR.CREATE.CONTENT_REQUIRE'
        );
    }
}

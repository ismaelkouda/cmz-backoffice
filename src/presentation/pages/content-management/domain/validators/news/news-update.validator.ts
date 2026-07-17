import { NewsUpdateContract } from '@pages/content-management/domain/contracts/news/news-update.contract';
import { NewsUpdateValidateContract } from '@pages/content-management/domain/contracts/news/news-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateNewsUpdate(
    contract: NewsUpdateContract
): asserts contract is NewsUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.NEWS.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.type) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.NEWS.FORM.ERROR.UPDATE.TYPE_REQUIRE'
        );
    }
    if (contract.type === 'IMAGE' && !contract.image) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.NEWS.FORM.ERROR.UPDATE.IMAGE_REQUIRE'
        );
    }
    if (contract.type === 'VIDEO' && !contract.video) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.NEWS.FORM.ERROR.UPDATE.VIDEO_REQUIRE'
        );
    }
    if (!contract.title) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.NEWS.FORM.ERROR.UPDATE.TITLE_REQUIRE'
        );
    }
    if (!contract.resume) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.NEWS.FORM.ERROR.UPDATE.RESUME_REQUIRE'
        );
    }
    if (!contract.content) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.NEWS.FORM.ERROR.UPDATE.CONTENT_REQUIRE'
        );
    }
    if (!contract.category) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.NEWS.FORM.ERROR.UPDATE.CATEGORY_REQUIRE'
        );
    }
}

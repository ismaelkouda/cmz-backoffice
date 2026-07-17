import { NewsCreateContract } from '@pages/content-management/domain/contracts/news/news-create.contract';
import { NewsCreateValidateContract } from '@pages/content-management/domain/contracts/news/news-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateNewsCreate(
    contract: NewsCreateContract
): asserts contract is NewsCreateValidateContract {
    if (!contract.type) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.NEWS.FORM.ERROR.CREATE.TYPE_REQUIRE'
        );
    }
    if (contract.type === 'IMAGE' && !contract.image) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.NEWS.FORM.ERROR.CREATE.IMAGE_REQUIRE'
        );
    }
    if (contract.type === 'VIDEO' && !contract.video) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.NEWS.FORM.ERROR.CREATE.VIDEO_REQUIRE'
        );
    }
    if (!contract.title) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.NEWS.FORM.ERROR.CREATE.TITLE_REQUIRE'
        );
    }
    if (!contract.resume) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.NEWS.FORM.ERROR.CREATE.RESUME_REQUIRE'
        );
    }
    if (!contract.content) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.NEWS.FORM.ERROR.CREATE.CONTENT_REQUIRE'
        );
    }
    if (!contract.category) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.NEWS.FORM.ERROR.CREATE.CATEGORY_REQUIRE'
        );
    }
}

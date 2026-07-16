import { SlideCreateContract } from '@pages/content-management/domain/contracts/slide/slide-create.contract';
import { SlideCreateValidateContract } from '@pages/content-management/domain/contracts/slide/slide-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateSlideCreate(
    contract: SlideCreateContract
): asserts contract is SlideCreateValidateContract {
    if (contract.timeDuration === null || contract.timeDuration === undefined) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.CREATE.TIME_DURATION_REQUIRE'
        );
    }
    if (Number.isNaN(contract.timeDuration) || contract.timeDuration <= 0) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.CREATE.TIME_DURATION_INVALID'
        );
    }
    if (!contract.type) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.CREATE.TYPE_REQUIRE'
        );
    }
    if (contract.type === 'IMAGE' && !contract.image) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.CREATE.IMAGE_REQUIRE'
        );
    }
    if (contract.type === 'VIDEO' && !contract.video) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.CREATE.VIDEO_REQUIRE'
        );
    }
    if (!contract.title) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.CREATE.TITLE_REQUIRE'
        );
    }
    if (!contract.platforms?.length) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.CREATE.PLATFORMS_REQUIRE'
        );
    }
    if (!contract.startDate) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.CREATE.START_DATE_REQUIRE'
        );
    }
    if (!contract.endDate) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.CREATE.END_DATE_REQUIRE'
        );
    }
    if (contract.buttonLabel && !contract.buttonUrl) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.CREATE.BUTTON_URL_REQUIRE'
        );
    }
    if (contract.buttonUrl && !contract.buttonLabel) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.CREATE.BUTTON_LABEL_REQUIRE'
        );
    }
}

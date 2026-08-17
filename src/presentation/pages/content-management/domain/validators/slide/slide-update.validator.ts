import { SlideUpdateContract } from '@pages/content-management/domain/contracts/slide/slide-update.contract';
import { SlideUpdateValidateContract } from '@pages/content-management/domain/contracts/slide/slide-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateSlideUpdate(
    contract: SlideUpdateContract
): asserts contract is SlideUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (contract.timeDuration === null || contract.timeDuration === undefined) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.UPDATE.TIME_DURATION_REQUIRE'
        );
    }
    if (Number.isNaN(contract.timeDuration) || contract.timeDuration <= 0) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.UPDATE.TIME_DURATION_INVALID'
        );
    }
    if (!contract.type) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.UPDATE.TYPE_REQUIRE'
        );
    }
    if (contract.type === 'IMAGE' && !contract.image) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.UPDATE.IMAGE_REQUIRE'
        );
    }
    if (contract.type === 'VIDEO' && !contract.video) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.UPDATE.VIDEO_REQUIRE'
        );
    }
    if (!contract.title) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.UPDATE.TITLE_REQUIRE'
        );
    }
    if (!contract.platforms?.length) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.UPDATE.PLATFORMS_REQUIRE'
        );
    }
    if (!contract.startDate) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.UPDATE.START_DATE_REQUIRE'
        );
    }
    if (!contract.endDate) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.UPDATE.END_DATE_REQUIRE'
        );
    }
    if (contract.buttonLabel && !contract.buttonUrl) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.UPDATE.BUTTON_URL_REQUIRE'
        );
    }
    if (contract.buttonUrl && !contract.buttonLabel) {
        throw new GenericRequiredError(
            'CONTENT_MANAGEMENT.SLIDE.FORM.ERROR.UPDATE.BUTTON_LABEL_REQUIRE'
        );
    }
}
